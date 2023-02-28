#!/usr/bin/python3
from fabric.api import run,env,local,sudo,cd,execute
import uuid
import zipfile
import tarfile
import json

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
                repo_link = app.get("gitRepoLink")
                if repo_link.find("git@github.com:") == -1:
                    sp = repo_link.split("github.com")
                    sp = sp[1].strip("/")
                    print(sp)
                    repo_link = "git@github.com:" + sp + ".git"
                    print(repo_link)
                run('git clone {} .'.format(repo_link))

            except:
                return ["An error occured while cloning", 400]

        current_path = current_directory + "/static/session-" + str(session_id)
        root_folder = app.get('rootFolder').lstrip('/')
        if root_folder == "":
            root_folder = "."
        else:
            current_path = current_path + "/" + root_folder
        
        try:
            with cd(root_folder):
                docker_file_path = app.get("dockerfilePath")
                if docker_file_path == "":
                    docker_file_path = "."
                
                if app.get('dockerfilePresent') == 'yes':
                    try:
                        run("docker build -t app-{} {}".format(session_id, docker_file_path))
                    except:
                        return ["An error occured while building your image from the dockerfile you provided,\
    check the dockerfile and the path provided and ensure no error", 400]
                else:
                    custom_dockerfile = app.get("customDockerfile").strip()
                    compose_dockerfile = ""
                    if len(custom_dockerfile) > 10:
                        compose_dockerfile = custom_dockerfile
                    else:
                        
                        docker_base_image = app.get("baseImage")
                        docker_image_tag = app.get("imageTag")
                        tag = f":{docker_image_tag}" if len(docker_image_tag.strip()) else ""
                        docker_run_commands = eval(app.get("runCommands"))
                        docker_cmd_commands = eval(app.get("cmdCommands"))
                        docker_envs = eval(app.get("envs"))
                        docker_ports = eval(app.get("ports"))
                        compose_dockerfile = f"FROM {docker_base_image}{tag}\n"
                        compose_dockerfile += "WORKDIR /app\n"
                        compose_dockerfile += "COPY . .\n"
                        for key, command in docker_run_commands.items():
                            compose_dockerfile += f"RUN {command}\n"
                        for key, env in docker_envs.items():
                            compose_dockerfile += f"ENV {env}\n"
                        for key, cmd in docker_cmd_commands.items():
                            compose_dockerfile += "CMD "
                            cmd_array = cmd.split(" ")
                            stripped_cmd_array = []
                            for c in cmd_array:
                                stripped_cmd_array.append(c.strip())
                            

                            compose_dockerfile += f"{json.dumps(stripped_cmd_array)}\n"
                        for key, port in docker_ports.items():
                            compose_dockerfile += f"EXPOSE {port}\n"
                        print(compose_dockerfile)
                    try:
                        with open(f"{current_path}/Dockerfile",  "w+") as f:
                            f.write(compose_dockerfile)
                    except:
                        return ["An error occured while saving the dockerfile provided", 400]
                    try:
                        run("docker build -t app-{} .".format(session_id))    
                    except:
                        return ["An error occured with the dockerfile template you provided", 400]
                        
                        
        except Exception as e:
            print(e)
            return ["Invalid root path provided", 400]
        # run("docker build -t app-{} .".format(session_id))
        # run("docker ps")
    local('rm -rf static')
    return ["success", 200]