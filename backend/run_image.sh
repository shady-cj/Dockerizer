#!/bin/bash
 docker run -it -v /var/run/docker.sock:/var/run/docker.sock -v ~/.ssh:/root/.ssh -v /etc/ssh:/etc/ssh dockerizer

