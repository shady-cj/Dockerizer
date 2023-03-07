# Dockerizer

## Description :bulb:
You might already have an idea what this project is about from the name. *Dockerizer* is a simple application that helps developers containerize their application using docker with just few clicks and typing where needed. It takes your application and its specifications and then builds an image of it using the famous docker. 

Before we go deep into how to use the application let us iterating what the app solves and what it doesn't

## What it does:
- [x] Containerize applications using a dockerfile
- [x] Pushes the image created to your dockerhub repository.
- [x] Dockerize one application at a time

## What it doesn't do:
- It doesn't dockerize multiple applications, in the event where you have `backend`, `frontend`, `database` where using `docker-compose` triumphs the application cannot containerize all at a time unless you do that one at a time. (This would be improved in the future
- It might not do well with large applications since it might take more time to build
- It doesn't deploy your application, it only creates a docker image and pushes that image to your dockerhub repository


