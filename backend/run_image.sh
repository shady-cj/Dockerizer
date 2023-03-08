#!/bin/bash
docker run -it -v /var/run/docker.sock:/var/run/docker.sock -v ~/.ssh/id_rsa:/root/.ssh/id_rsa -v ~/.ssh/known_hosts:/root/.ssh/known_hosts -v "./$1":/app/application_config --name "$2" dockerizer
