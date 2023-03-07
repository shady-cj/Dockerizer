from werkzeug.utils import secure_filename
from flask import Flask, request
from flask_cors import CORS
import os 
import zipfile
import tarfile
from fabric.api import local
import json
import uuid
#from dockerizer.containerizer.setup import setup_config

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
    s_id = str(uuid.uuid4())
    application = dict(request.form)
    zipped = None
    if f:
        filename = str(secure_filename(f.filename)) + "_" + s_id
        f.save(filename)
        if tarfile.is_tarfile(filename):
            zipped = 'tar_zip'
        elif zipfile.is_zipfile(filename):
            zipped = 'regular_zip'
        if not zipped:
            return {"error": "Invalid or Corrupted Zip file"}, 400
        application.update({'zipFilename': filename, 'zip_type': zipped})
    obj_filename = f"app-option_{s_id}"
    container_name = f"container_{s_id}"
    with open(obj_filename, "w") as f_obj:
        json.dump(application, f_obj)
    if zipped is not None:
        local(f"~/backend/run_image_with_zip.sh {obj_filename} {filename} {container_name}")
    else:
        local(f"~/backend/run_image.sh {obj_filename} {container_name}")
    with open(obj_filename) as f_out:
        response = json.load(f_out)
    local(f"rm {obj_filename}")
    if zipped is not None:
        local(f"rm {filename}")
    local(f"docker rm -f {container_name}")
    if response[1] != 200:
        return {"error": response[0]}, response[1]
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
