# Dockerizer

## Medium Blog Posts :newspaper:
- [Using the dockerizer application](https://medium.com/@petersp2000/using-the-dockerizer-application-d2e0b16a40d4)
## Description :bulb:
You might already have an idea what this project is about from the name. **Dockerizer** is a simple application that helps developers containerize their application using docker with just few clicks and typing (where needed). It takes your application and its specifications and goes on to build an image of it using the famous docker. 

Before we go deep into how the application works let us start by iterating over what the application solves and what it doesn't

## What it solves:
- [x] Containerize applications using a dockerfile
- [x] Pushes the image created to your dockerhub repository.
- [x] Dockerize one application at a time

## What it doesn't solve:
- It doesn't dockerize multiple applications, in the event where you have **backend**, **frontend**, **database** where using `docker-compose` triumphs, the application cannot containerize all at a time unless you do that one at a time. (This would be improved in the future
- It might not do well with large applications since it might take more time to build
- It doesn't deploy your application, it only creates a docker image and pushes that image to your dockerhub repository


### Contents
- [Getting started](#getting-started)
- [Sections](#sections)
   - [Source code](#source-code)
      - [Github repo link](#github-link)
      - [Zipped files](#zip)
   - [Application Configuration](#application-configuration)
   - [Personalized Information](#personalized-information)
- [Walkthrough on Technologies and libraries used](#tools-walkthrough)

#### Getting started.

To use the application it is expected that you have a little idea of how docker works and what is needed to dockerize an application. Here is [docker official docs]('https://docs.docker.com/get-started/'). You should know when docker is need and when it is not.
You also need to have a way of getting your source code packaged in a way that will easily be accessed.
The User Interface of the application is friendly enough but maybe not enough so you can read through the documentation to clear out doubts on some informations that is not clear. You can be sure it'll be fully addressed below.


#### Sections

The application is divided into sections and each of these sections has atleast a field that needs to be filled up for your app to be dockerized.

We'll be discussing each sections, explaining what each fields does, what is expected as a value.


#### Source Code
The first section is the source code. This is so important because this is what the application would be working on. It is important that you have application packaged in a manner that will be easily accessed.
There are two ways you can provide your source code. via **Zipped File** or **Github link**

#### Github Link
![Dockerizer - Google Chrome 3_7_2023 9_26_10 PM (2)](https://user-images.githubusercontent.com/66220414/223544559-09414ac3-9823-4f21-a373-17d9fefd58f1.png)

All you need to do is copy paste in your github repo link of the application you want to dockerize.

#### Zip
![Dockerizer - Google Chrome 3_7_2023 9_30_14 PM (2)](https://user-images.githubusercontent.com/66220414/223546140-f3544020-a989-4eb1-9bac-427c019616be.png)

Using zip files can be a little tricky depending on the tool and algorithm used in zipping and compressing your project which might actually be a problem while using the application.
Currently the application only supports zip(`.zip`), gzip(`.gz') going forward this options would be extended.
It's important to note that the application should be properly zipped as this might cause some unexpected errors if not properly done.



#### Application Configuration.

This section defines how the application should be dockerized. Not all fields is required but the required ones should be filled properly to getting the desired output. 

1. The first field is to specify the root folder of your application


![Dockerizer - Google Chrome 3_7_2023 10_17_54 PM (2)](https://user-images.githubusercontent.com/66220414/223555224-dcabb0c5-60d9-4d7e-b3cd-52e5ed475ea3.png)

The concept of specify a root folder can be a little tricky and can be misconstrued and we'll explain better below.

Take for instance you have a packaged application of the following folder structure of a full stack application and you intend to dockerize only the *backend* application 

![index jsx - Dockerizer - Visual Studio Code 3_7_2023 10_23_16 PM (3)](https://user-images.githubusercontent.com/66220414/223556713-8e8e0c40-83bf-4fcb-a516-eebfff6d5c5e.png)


what will be the root folder in this case? Well it goes both ways you can specify the current folder as the root folder the current folder here is the `Dockerizer` folder that contains both the *backend* and *frontend* application or you can specify the `/backend/` folder if you specified the `Dockerizer` folder then you might need to make a little more clarification going forward. The root folder here would determine where the dockerfile would be created if you don't have dockerfile or which base folder to start seaching for a dockerfile from if present. 

Again the root folder that is being asked in the application is the folder you want every other folder structure to be relative to. (i.e the current application you want to create an image of what is the root folder?). In the example above you can(should) take `/backend/` as the root folder. In the folder structure example above if left blank the Dockerizer folder would be used.


![index jsx - Dockerizer - Visual Studio Code 3_7_2023 10_23_24 PM (3)](https://user-images.githubusercontent.com/66220414/223558895-f738f249-c6ca-4445-bf00-eed89f0d7dcd.png)

As said earlier the path provided in the root folder option is relative to the main application root folder. The main application root folder is also the base folder after unpackaging the application.
It doesn't also matter if there is preceeding slash `/` in the path provided this would be taken care of in the backend.



2. The next field to fill under this section is whether there's a dockerfile already available or not. This gives the flexibility of creating a custom file already in the application folder and the just specifying the path to the dockerfile and the image will be build based on the commands in the dockerfile provided

![Dockerizer - Google Chrome 3_7_2023 10_43_22 PM (2)](https://user-images.githubusercontent.com/66220414/223561062-bfa70496-b199-4219-b175-6d643a1fe2da.png)

if there's already a `Dockerfile` present, a path to the dockerfile is expected using the root folder option specified above as the base folder in which the dockerfile path is relative to. For instance if a Dockerfile created in the `backend/` folder then and i already specified `backend` as my root folder then the docker file path should be left blank or you can type in a "." (period with no quotes). And this would look for a file named `Dockerfile` in the specified folder

3. if there's no docker file you have the option of pasting/writing you customised dockerfile to be used.

![Dockerizer - Google Chrome 3_7_2023 11_05_10 PM (2)](https://user-images.githubusercontent.com/66220414/223564245-567adacc-e233-4fd1-bef4-ea69b11cc7a0.png)

Using the custom dockerfile would ignore every other options in the section. The only valid option that would matter would be the root folder.

:warning: It is important to note that if you're using the custom dockerfile option a `Dockerfile` would be created in the root folder specified above.
So in the event where you have `Dockerizer` as the root folder your custom dockerfile would be created in that same folder.

If you neither have dockerfile present in your project nor a template to copy and paste you can use the other option of selecting an image in the drop down. It is important to know that the custom dockerfile has higher precedence over the other selection options. 

Let's walkthrough how to use them.

![Dockerizer - Google Chrome 3_7_2023 11_23_36 PM (2)](https://user-images.githubusercontent.com/66220414/223567498-5009c766-a490-48c8-ab24-e96f2f52587e.png)

Select an image to use and a new set of options shows up and also another new drop down shows up. This drop down provides series of tags you can use which is not always required. if you leave blank without selecting any the default of `latest` would be used.
:triangular_flag_on_post: NOTE: Not all official images and tags might be present. If the image you want to use is an official image and isn't present you can just type it there the dropdown as the ability to receive normal text so you can absolutely type in your image if it's not present. Same goes for the tag.

The *App Directory Path* field is solely for determining what folder to copy while using the `COPY` command in the dockerfile template being built. If you leave the field blank the default of `COPY . .`  is used. You can also use an unquoted period(.) as a value. that would also mean the same thing. 

:triangular_flag_on_post: **Although there's a limitation to this which would be improved fully in version 2. The limitation is that you can only use the `COPY` command once which is going to copy only the folder specified in *App Directory Path* but not allow the copying of individual files or copying more than one file separately. If you have to use that you can just simply use the *custom dockerfile* textbox and it will work perfectly.**
e.g it doesn't support 
```
COPY fileA fileA
COPY fileB fileB
COPY fileC fileC
```

The rest of the fields in order that they appear includes

- The commands to run while buiding the image: This refers the commands to run with the `RUN` command. Which is basically commands to be run while the image is being built. It uses the `RUN` command in the dockerfile and you can add as many commands as you would like to.
- Port opening: This exposes a port on the image which will only be very effective when running the container of the image. The port option opens up a port on the image in which other container being created from the image can use. It uses the `EXPOSE` command.
- Commands to start up the application refers to the commands to be specified in the dockerfile `CMD` command you can add as much as you need to.
- Environment variables. You can add as much environment variable as you need. it uses the `ENV` command. It uses the format `name=variable`. 
- 


#### Personalized Information

![Dockerizer - Google Chrome 3_7_2023 11_49_42 PM (2)](https://user-images.githubusercontent.com/66220414/223572041-2ae5db4c-613c-46d0-84b8-9f01bdab058b.png)

The last section before we fully dockerize our application.

Here are the fields in order they appear and what they mean.

- This image name / app name: This is basically the docker hub repo name of your project or the name of your project itself. (You must likely name your dockerhub repo your app name or project name).
- The image tag - This simply means the version you want to currently create an image for. Docker itself encourages project versioning which is important in progressive projects. If this field is left blank the default of "latest" is used.
- The dockerhub credentials(username and password) - This is required so as to push the created image to the users dockerhub account. You don't have to worry about your credential leaks as this would not be stored/saved anywhere. All informations are deleted after every session (succesful or not)


#### Tools Walkthrough

### Dependencies :couple:

**Front-End**: 
- [React](https://reactjs.org/) 

**Backend**:

- [Flask](https://flask.palletsprojects.com/en/2.2.x/)
- [Fabric](https://www.fabfile.org/)
- [docker](https://docs.docker.com/get-started/)
- [gunicorn](https://gunicorn.org/)
- [PyJWT](https://pyjwt.readthedocs.io/en/stable/)
- [haproxy](https://www.haproxy.org/)

The frontend is a simple react application that communicates with the flask backend api
While the backend consist of a flask application that serves the api. Spin up a docker container from a pre-built image to run all each users dockerizer request. Also with the use of gunicorn and asynchronous request hadling the application is able to manage multiple request at the same time with no extra delay. And ofcourse haproxy for security and reverse-proxying request to the backend.


P.S. It's important to know the application is still being tested and might sometimes fail. It might also fail because the current infrastructure isn't powerful enough to handle high traffic.




