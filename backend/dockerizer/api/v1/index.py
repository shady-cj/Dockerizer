
from werkzeug.utils import secure_filename
from flask import Flask, request
from flask_cors import CORS
import os 
import zipfile

app = Flask(__name__.split(".")[0])
CORS(app, resources={r"*": {"origins": "*"}})


@app.route('/', methods=['POST'], strict_slashes=False)
def index():
    print(request.environ)
    # print(dict(request.files)) # {'zipFile': <FileStorage: 'stripmining.jpg' ('image/jpeg')>}
    f = request.files.get('zipFile')
    if not zipfile.is_zipfile(f):
        return {"error": "Invalid or Corrupted Zip file"}
    f.save(secure_filename(f.filename))
    # print(dict(request.form)) # {'sourceCodeType': 'zip', 'gitRepoLink': ''}
    
    return {"message": "Hello world"}

if __name__ == "__main__":
    app.run()