#!/usr/bin/python3

from fabric.api import run,env,local,sudo,cd,execute
import uuid
import zipfile

env.hosts=['127.0.0.1']
env.user = 'ceejay'
env.password = 'ceejayluvscr7'

def codebase_setup(app):
    session_id = uuid.uuid4()
    local('mkdir -p static/session-{}'.format(session_id))
    current_directory = local('pwd', capture=True)
    print(current_directory)
    with cd('{}/static/session-{}'.format(current_directory, session_id)):
        if app.get("sourceCodeType") == "zip":
            try:
                with zipfile.ZipFile(app.get("zipFile"), allowZip64=True) as file:
                    file.extractall(path='{}/static/session-{}'.format(current_directory, session_id))
            except:
                return ["Error: File size if too large", 400]
        else:
            try:
                run('git clone {} .'.format(app.get("gitRepoLink")))

            except:
                return ["An error occured while cloning", 400]
    # local('rm -rf static')
    return ["success", 200]