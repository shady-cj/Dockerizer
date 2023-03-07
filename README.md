# Dockerizer

## Description :bulb:
You might already have an idea what this project is about from the name. **Dockerizer** is a simple application that helps developers containerize their application using docker with just few clicks and typing where needed. It takes your application and its specifications and then builds an image of it using the famous docker. 

Before we go deep into how the application works let us start by iterating over what the application solves and what it doesn't

## What it does:
- [x] Containerize applications using a dockerfile
- [x] Pushes the image created to your dockerhub repository.
- [x] Dockerize one application at a time

## What it doesn't do:
- It doesn't dockerize multiple applications, in the event where you have **backend**, **frontend**, **database** where using `docker-compose` triumphs, the application cannot containerize all at a time unless you do that one at a time. (This would be improved in the future
- It might not do well with large applications since it might take more time to build
- It doesn't deploy your application, it only creates a docker image and pushes that image to your dockerhub repository


### Contents
- [Getting started](#getting-started)
- [Sections](#sections)
   - [Source code](#source-code)
      - [Github repo link](#github-link)
      - [Zipped files](#zip)
   - Application Configuration.
   - User Specific Information.
- Walkthrough on Technologies and libraries used.

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




