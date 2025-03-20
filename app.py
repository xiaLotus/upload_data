from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)

# 設置上傳檔案的資料夾
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploaded_files')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 允許的檔案擴展名
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'txt', 'docx'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return jsonify({"error": "沒有檔案部分"}), 400

    files = request.files.getlist('files')

    if len(files) == 0:
        return jsonify({"error": "未選擇任何檔案"}), 400

    saved_files = []

    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            file_ext = filename.rsplit('.', 1)[1].lower()
            if file_ext in ['png', 'jpg', 'jpeg', 'gif']:
                # 處理圖片類型
                pass
            elif file_ext in ['pdf', 'txt', 'docx']:
                # 處理文件類型
                pass

            saved_files.append(filename)
        else:
            return jsonify({"error": f"檔案 {file.filename} 不允許的檔案類型"}), 400

    return jsonify({"message": "檔案成功上傳", "files": saved_files}), 200

if __name__ == '__main__':
    app.run(debug=True)
