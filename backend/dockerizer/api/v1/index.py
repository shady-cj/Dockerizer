from werkzeug.utils import secure_filename
from flask import Flask, request
from flask_cors import CORS
import os 
import zipfile
import tarfile
from dockerizer.containerizer.setup import setup_config

app = Flask(__name__.split(".")[0])
CORS(app, resources={r"*": {"origins": "*"}})


@app.route('/', methods=['POST'], strict_slashes=False)
def index():
    """ 
    Main route that accepts all the application configurations and
    options required to build the application
    
    """
    # print(dict(request.files)) # {'zipFile': <FileStorage: 'stripmining.jpg' ('image/jpeg')>}
    f = request.files.get('zipFile')

    application = dict(request.form)
    zipped = None
    if f:
        filename = str(secure_filename(f.filename))
        f.save(filename)
        if tarfile.is_tarfile(filename):
            zipped = 'tar_zip'
        elif zipfile.is_zipfile(filename):
            zipped = 'regular_zip'
        if not zipped:
            return {"error": "Invalid or Corrupted Zip file"}, 400
        application.update({'zipFilename': filename, 'zip_type': zipped})
    
    response = setup_config(application)
    # f.save(secure_filename(f.filename))
    # print(dict(request.form)) # {'sourceCodeType': 'zip', 'gitRepoLink': ''}
    if response[1] != 200:
        return {"message": response[0]}, response[1]
    return {"message": response[0], "image": response[2]}, response[1]

@app.route('/images', methods=['GET'], strict_slashes=False)
def fetchImages():
    """
    The route returns available official image (100 images)
    """
    import requests
    req = requests.get("https://hub.docker.com/v2/repositories/library/?page_size=100")
    response = req.json()
    images = []
    if req.status_code == 200:
        for image in response.get("results"):
            images.append(image.get("name"))
        return {"images": images}, 200
    return {"images": images}, 200

@app.route('/<image>/tags', methods=['GET'], strict_slashes=False)
def fetchTags(image):
    """
    returns the tags corresponding to the image.
    """
    import requests
    req = requests.get(f"https://hub.docker.com/v2/repositories/library/{image}/tags?page_size=200")
    response = req.json()
    tags = []
    if req.status_code == 200:
        for tag in response.get("results"):
            tags.append(tag.get("name"))
        return {"tags": tags}, 200
    return {"tags": tags}, 200



if __name__ == "__main__":
    app.run(host='0.0.0.0', port='8000')
