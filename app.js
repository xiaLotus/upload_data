// app.js
const { UploadFilled } = ElementPlusIconsVue;

const app = Vue.createApp({
  components: {
    UploadFilled,
  },
  data() {
    return {
      uploadRef: null,
      uploadedFiles: [],
      uploadResults: [], // 存放所有上傳結果
    };
  },
  mounted() {
    this.uploadRef = this.$refs.uploadRef;
  },
  methods: {
    async confirmBeforeUpload() {
      if (!this.uploadRef) {
        ElementPlus.ElMessage.warning("沒有可上傳的檔案");
        return;
      }
      
      const userConfirmed = await ElementPlus.ElMessageBox.confirm(
        "是否確認上傳所有選擇的檔案？",
        "確認上傳",
        {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch(() => false);
      
      if (userConfirmed) {
        this.uploadResults = []; // 清空上次結果
        this.submitUpload();
      } else {
        ElementPlus.ElMessage({
          type: "error",
          message: "❗ 已取消上傳",
          duration: 3000,
          showClose: true,
        });
      }
    },
    submitUpload() {
      if (this.uploadRef) {
        this.uploadRef.submit();
      } else {
        console.error("上傳元件未初始化，請檢查 ref 綁定是否正確");
      }
    },
    handleSuccess(response, file, fileList) {
      if (!response || !response.files) {
        ElementPlus.ElMessage.error("上傳成功但回應格式錯誤");
        return;
      }

      this.uploadedFiles = response.files;

      ElementPlus.ElMessageBox.confirm(
        `以下檔案已成功上傳：\n${this.uploadedFiles.join("\n")}`,
        "上傳成功",
        {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "success",
          center: true,
        }
      )
        .then(() => {
          ElementPlus.ElMessage.success("已確認上傳");
        })
        .catch(() => {
          ElementPlus.ElMessage({
            type: "error",
            message: "❗ 上傳已取消，檔案將被刪除",
            duration: 3000,
            showClose: true,
          });
          this.deleteFileFromServer(file.name);
          this.$nextTick(() => {
            this.uploadRef.clearFiles();
          });
        });
    },
    handleError(err, file) {
      ElementPlus.ElMessageBox.alert(
        `檔案 ${file.name} 無法上傳: ${err?.error || "未知錯誤"}`,
        "上傳失敗",
        {
          confirmButtonText: "關閉",
          type: "error",
        }
      );
    },
    deleteFileFromServer(fileName) {
      fetch(`http://localhost:5000/delete-file`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: fileName }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            ElementPlus.ElMessage.success("伺服器已刪除該檔案");
          } else {
            ElementPlus.ElMessage.error("刪除失敗：" + data.error);
          }
        })
        .catch(() => {
          ElementPlus.ElMessage.error("與伺服器連線失敗，無法刪除");
        });
    },
  },
});

// 註冊所有 Element Plus 圖標
Object.keys(ElementPlusIconsVue).forEach((key) => {
  app.component(key, ElementPlusIconsVue[key]);
});

// 分開註冊插件與掛載應用
app.use(ElementPlus);
app.mount("#app");
