
from werkzeug.utils import secure_filename
from flask import Flask, request
from flask_cors import CORS
import os 
import zipfile
from dockerizer.containerizer.setup import setup_config

app = Flask(__name__.split(".")[0])
CORS(app, resources={r"*": {"origins": "*"}})


@app.route('/', methods=['POST'], strict_slashes=False)
def index():
    # print(dict(request.files)) # {'zipFile': <FileStorage: 'stripmining.jpg' ('image/jpeg')>}
    f = request.files.get('zipFile')
    application = dict(request.form)
    if f:
        if not zipfile.is_zipfile(f):
            return {"error": "Invalid or Corrupted Zip file"}
        application.update({'zipFile': f})
    
    print(application)
    response = setup_config(application)
    # f.save(secure_filename(f.filename))
    # print(dict(request.form)) # {'sourceCodeType': 'zip', 'gitRepoLink': ''}
    return {"message": response[0]}, response[1]

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='8000')
