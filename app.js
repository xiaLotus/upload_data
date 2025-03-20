// app.js
const { UploadFilled } = ElementPlusIconsVue;

const app = Vue.createApp({
  components: {
    UploadFilled,
  },
    data() {
      return {
        uploadRef: null,
        uploadedFiles: []
      };
    },
    mounted() {
      this.uploadRef = this.$refs.uploadRef;
    },
    methods: {
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
            this.uploadedFiles = [];
            this.uploadRef.clearFiles();
          })
          .catch(() => {
            ElementPlus.ElMessage.info("已取消操作");
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
      }
    }
  });
  // 註冊所有 Element Plus 圖標
Object.keys(ElementPlusIconsVue).forEach(key => {
  app.component(key, ElementPlusIconsVue[key]);
});

  // 分開註冊插件與掛載應用
  app.use(ElementPlus);
  app.mount('#app');
  