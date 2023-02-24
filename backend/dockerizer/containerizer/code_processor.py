#!/usr/bin/python3

from fabric.api import run,env,local,sudo,cd,execute
import uuid
import zipfile
import tarfile
import os



env.hosts=['127.0.0.1']
env.user = 'ceejay'
env.password = 'ceejayluvscr7'

def codebase_setup(app):
    session_id = uuid.uuid4()
    local('mkdir -p static/session-{}'.format(session_id))
    current_directory = local('pwd', capture=True)
    with cd('{}/static/session-{}'.format(current_directory, session_id)):
        if app.get("sourceCodeType") == "zip":
            filename = app.get("zipFilename")
            if app.get("zip_type") == "regular_zip":
                try:
                    with zipfile.ZipFile(filename, allowZip64=True) as file:
                        file.extractall(path='{}/static/session-{}'.format(current_directory, session_id))
                except zipfile.LargeZipFile:
                    local("rm -f {}".format(filename))
                    return ["Error: File size if too large", 400]
                except:
                    local("rm -f {}".format(filename))
                    return ["Error: Something went wrong while unzipping file", 400]
            else:
                try:
                    with tarfile.open(filename) as t:
                        # print(t.list(), "end")
                        t.extractall(path='{}/static/session-{}/'.format(current_directory, session_id))
                except Exception as e:
                    print(e, "errorrr=====")
                    local("rm -f {}".format(filename))
                    return ["Error: Something went wrong while extracting tarfile", 400]
            local("rm -f {}".format(filename))
                
        else:
            try:
                run('git clone {} .'.format(app.get("gitRepoLink")))

            except:
                return ["An error occured while cloning", 400]
        if app.get('dockerfilePresent') === 'yes':
            root_folder = app.get('rootFolder').lstrip('/')
            print(os.getcwd())
            print(os.path.exists(root_folder))
            try:
                with cd(root_folder):
                    find_dockerfile = run('find . -name Dockerfile')
                    print(find_dockerfile.strip('\n'))
            except:
                return ["Invalid root path provided", 400]
        # run("docker build -t app-{} .".format(session_id))
        # run("docker ps")
    # local('rm -rf static')
    return ["success", 200]