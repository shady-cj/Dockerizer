#!/usr/bin/python3
"""
This module contains all the necessary fabric tasks
needed to build the image
"""
from fabric.api import run,env,local,cd,settings
import uuid
import zipfile
import tarfile
import json
import os
import jwt


#env.hosts=['100.25.109.39']a
env.hosts=['127.0.0.1']
env.user = os.getenv("USER")
# env.password = os.getenv("PASSWORD")
env.key_filename=['~/.ssh/dockerizer_pem']

def codebase_setup(app):
    """
    This a fabric task that executes all the required command needed
    to build the docker image remotely
    """
    session_id = str(uuid.uuid4())
    local('mkdir -p static/session-{}'.format(session_id))
    current_directory = local('pwd', capture=True)
    with cd('{}/static/session-{}'.format(current_directory, session_id)):
        """
        Processing the source code
        depending on the source code type which is either through zip(zip, tar) or github
        """
        if app.get("sourceCodeType") == "zip":
            filename = app.get("zipFilename")
            if app.get("zip_type") == "regular_zip":
                try:
                    with zipfile.ZipFile(filename, allowZip64=True) as file:
                        file.extractall(path='{}/static/session-{}'.format(current_directory, session_id))
                except zipfile.LargeZipFile:
                    local(f"rm -rf static/session-{session_id}")
                    return ["Error: File size if too large", 400]
                except:
                    local(f"rm -rf static/session-{session_id}")
                    return ["Error: Something went wrong while unzipping file", 400]
            else:
                try:
                    with tarfile.open(filename) as t:
                        t.extractall(path='{}/static/session-{}/'.format(current_directory, session_id))
                except Exception as e:
                    local(f"rm -rf static/session-{session_id}")
                    return ["Error: Something went wrong while extracting tarfile", 400]
                
        else:
            try:
                # Converting github urls to the ssh form incase it's not already in the format
                repo_link = app.get("gitRepoLink")
            
                if repo_link.find("git@github.com:") == -1:
                    sp = repo_link.split("github.com")
                    sp = sp[1].strip("/")
                    repo_link = "git@github.com:" + sp + ".git"
                
                with settings(warn_only=True):
                    r = run('git clone {} .'.format(repo_link))
                    if r.failed:
                        local(f"rm -rf static/session-{session_id}")
                        return ["An error occured while cloning", 400] 
            except Exception as e:
                print(e)
                local(f"rm -rf static/session-{session_id}")
                return ["An error occured while cloning the repo you provided, possibly an invalid link", 400]
        current_path = current_directory + "/static/session-" + session_id
        root_folder = app.get('rootFolder').lstrip('/')
        if root_folder == "":
            root_folder = "."
        else:
            current_path = current_path + "/" + root_folder
        
        try:
            with cd(root_folder):
                username = app.get("hubUsername")
                docker_file_path = app.get("dockerfilePath").strip().lstrip("/")
                app_name = app.get("appName")
                app_tag = app.get("appTag")
                image_name = f"{username}/{app_name}"
                app_tag = "latest" if len(app_tag.strip()) == 0 else app_tag
                if docker_file_path == "":
                    docker_file_path = "."
                
                if app.get('dockerfilePresent') == 'yes':
                    with settings(warn_only=True):
                        r = run("docker build -t {}:{} {}".format(image_name, app_tag, docker_file_path))
                        if r.failed:    
                            local(f"rm -rf static/session-{session_id}")
                            return ["An error occured while building your image from the dockerfile you provided,\
check the dockerfile template and the path provided and ensure no error", 400]
                else:
                    custom_dockerfile = app.get("customDockerfile").strip()
                    compose_dockerfile = ""
                    if len(custom_dockerfile) > 10:
                        compose_dockerfile = custom_dockerfile
                    else:
                        # compose a dockerfile based on the options provided
                        docker_base_image = app.get("baseImage")
                        docker_image_tag = app.get("imageTag")
                        tag = f":{docker_image_tag}" if len(docker_image_tag.strip()) else ""
                        docker_run_commands = eval(app.get("runCommands"))
                        docker_cmd_commands = eval(app.get("cmdCommands"))
                        docker_envs = eval(app.get("envs"))
                        docker_ports = eval(app.get("ports"))
                        app_directory = app.get("appDirectory")
                        app_directory = "." if app_directory.strip() == "" else app_directory.lstrip('/')
                        compose_dockerfile = f"FROM {docker_base_image}{tag}\n"
                        compose_dockerfile += "WORKDIR /app\n"
                        compose_dockerfile += f"COPY {app_directory} .\n"
                        for key, command in docker_run_commands.items():
                            compose_dockerfile += f"RUN {command}\n"
                        for key, env in docker_envs.items():
                            compose_dockerfile += f"ENV {env}\n"
                        if  len(docker_cmd_commands.items()):
                            compose_dockerfile += "CMD"
                            for key, cmd in docker_cmd_commands.items():
                                compose_dockerfile += f" {cmd.strip()};"
                            compose_dockerfile += "\n"
                        for key, port in docker_ports.items():
                            compose_dockerfile += f"EXPOSE {port}\n"
                        print(compose_dockerfile)
                    try:
                        with open(f"{current_path}/Dockerfile",  "w+") as f:
                            f.write(compose_dockerfile)
                    except:
                        local(f"rm -rf static/session-{session_id}")
                        return ["An error occured while saving the dockerfile provided", 400]
                    # Building the docker image after composing the dockerfile from the options provided
                    with settings(warn_only = True):
                        r = run("docker build -t {}:{} .".format(image_name, app_tag))
                        if r.failed:
                            local(f"rm -rf static/session-{session_id}")
                            return ["An error occured while trying to build image perhaps something went wrong with the dockerfile options you provided", 400]
                
                # Getting the password and encrypting it
                password = app.get("hubPassword")
                secret_name = f"{str(uuid.uuid4())}{session_id}"
                # secret = str(uuid.uuid4()) + "-" + session_id
                secret = str(uuid.uuid5(uuid.UUID(session_id), session_id))
                encoded_password = jwt.encode({"password": password}, secret, algorithm="HS256")
                jwt_dict = {
                    "enc": encoded_password,
                    "secret": secret
                }
                try:
                    # authenticating into docker hub cli
                    with open(f"/tmp/{secret_name}", "w") as f:
                        json.dump(jwt_dict, f)
                    run(f"chmod 600 /tmp/{secret_name}")
                    with settings(warn_only=True):
                        r = run("cat /tmp/{} | {}/secret_parser.py | docker login -u {} --password-stdin".format(secret_name, current_directory, username))
                        if r.failed:
                            local(f"rm -f /tmp/{secret_name}")
                            local(f"rm -rf static/session-{session_id}")
                            local(f'docker rmi -f {image_name}:{app_tag}')
                            return ["An error occured while trying to login to your dockerhub account", 400]
                    run(f"rm /tmp/{secret_name}")
                except Exception as e:
                    local(f"rm -rf static/session-{session_id}")
                    local(f'docker rmi -f {image_name}:{app_tag}')
                    return ["An error occured", 400]
                
                with settings(warn_only=True):
                    r = run("docker push {}:{}".format(image_name, app_tag))
                    if r.failed:
                        local(f"rm -rf static/session-{session_id}")
                        local(f'docker rmi -f {image_name}:{app_tag}')
                        local("rm ~/.docker/config.json")
                        return ["Something went wrong while trying to push to dockerhub", 400]                                             
        except Exception as e:
            local('rm -rf static')
            return ["Invalid root path provided", 400]
        
        """
        cleaning up if all is successful
        """
        local(f"rm -rf static/session-{session_id}")
        local(f'docker rmi -f {image_name}:{app_tag}')
        local("rm ~/.docker/config.json")
    return ["success", 200, f'https://hub.docker.com/repository/docker/{image_name}']

