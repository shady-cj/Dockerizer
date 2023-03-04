import React from 'react'
import './index.css'
import SourceCode from './sourceCode';
import UserSpecInfo from './userSpecInfo';
import ApplicationInfo from "./applicationInfo"
import { Icon } from '@iconify/react';

const defaultOptions = {
    sourceCodeType: "",
    zipFile: null,
    gitRepoLink: "",
    dockerfilePresent: "",
    rootFolder: "",
    dockerfilePath: "",
    baseImage: "",
    imageTag: "",
    customDockerfile: "",
    appName: "",
    appDirectory: "",
    hubUsername: "",
    hubPassword: "",
    runCommands: {},
    cmdCommands: {},
    ports: {},
    envs: {}
}

function Main({setMessage}) {
    const [options, setOptions] = React.useState(defaultOptions);
    const [sourceCodeInput, setSourceCodeInput] = React.useState("");
    const [images, setImages] = React.useState([])
    const [tags, setTags] = React.useState([])
    const [runCommandsNums, setRunCommandsNums] = React.useState([1])
    const [cmdCommandsNums, setCmdCommandsNums] = React.useState([1])
    const [portsNums, setPortsNums] = React.useState([1])
    const [envsNums, setEnvsNums] = React.useState([1])
    const [loadingTags, setLoadingTags] = React.useState(false)
    const [dockerizerLoading, setDockerizerLoading] = React.useState(false)

    const handleChange = (e) => {
        if (e.target.name === "sourceCodeType")
            showCorrectInput(e.target.value);
        if (e.target.name === "dockerfilePresent")
        {
            if (e.target.value.trim() == "no")
                loadImages()
            
        }
        if (["appName", "appTag"].includes(e.target.name))
        {
            e.target.value = e.target.value.replace(' ', '')
        }
        if (e.target.name === "baseImage")
            loadTags(e.target.value)
            
        setOptions(prevOpt => ({ ...prevOpt, [e.target.name]: e.target.value.trim() }));
        console.log(options);
    }
    const handleExtrasChange = (e, key) => {
        setOptions(prevOpt => ({...prevOpt, [e.target.name]: {...prevOpt[e.target.name], [key]: e.target.value}}))
    }
    const handleExtrasRemoval = (optionKey, valueKey) => {
        setOptions(prevOpt => {
            const prevOptObj = prevOpt[optionKey]
            const newOptObj = {}
            for (let k in prevOptObj)
            {
                if (k !== valueKey)
                    newOptObj[k] = prevOptObj[k]
            }
            console.log(newOptObj)
            prevOpt[optionKey] = newOptObj
            return prevOpt
        })
    }
    const handleFileChange = (e) => {
        console.log(e.target.files[0]);
        setOptions(prevOpt=>({... prevOpt, [e.target.name]: e.target.files[0]}))
    }

    const showCorrectInput = (inputType) => {
        setSourceCodeInput(inputType);
        setOptions(prevOpt => ({ ...prevOpt, zipFile: null, gitRepoLink: "" }));
    }
    
    const handleSubmit = async (e) => {
        if (dockerizerLoading == true)
            return;
        if (options.sourceCodeType === "zip" && options.zipFile === null)
        {
            alert('Error: No zip file selected')
            return;
            
        }
        else if (options.sourceCodeType === "repo" && options.gitRepoLink === "")
        {
            alert('Error: No repo link added')
            return;
            }
        else if (options.sourceCodeType === "")
        {
            alert("Choose a zip file or put a repo link of the source code to dockerize")
            return;
        }
        if (options.dockerfilePresent === "") 
        {
            alert("Confirm if you have a dockerfile present in your source code folder!");
            return;
        }
        if (options.dockerfilePresent === "no")
        {
            if (options.customDockerfile.length < 10)
            {
                if (!options.baseImage.length)
                {
                    alert("If you don't have a valid dockerfile template please select a base docker image to correctly build your image")
                    return;
                }
            }
        }
        
        if (options.appName === "") {
            alert("Give your image a name")
            return;
        }
        if (options.hubUsername == "") {
            alert("Provide your dockerhub username")
            return;
        }
        if (options.hubPassword == "") {
            alert("Provide your dockerhub password")
            return;
        }
        const parsedOptions = {
                    ...options, 
                    runCommands: JSON.stringify(options.runCommands),
                    cmdCommands: JSON.stringify(options.cmdCommands),
                    envs: JSON.stringify(options.envs),
                    ports: JSON.stringify(options.ports)
                }
            
        const data = new FormData();
        for (let optionKey in parsedOptions) {
            data.append(optionKey, parsedOptions[optionKey])
        }
        // console.log(data);

        // 192.168.0.106
        // 172.20.10.5
        // http://192.168.1.105:5173/
        setDockerizerLoading(true)
        const response = await fetch('http://192.168.1.105:8000', {
            method: "POST",
            body: data,
        })
        const result = await response.json()
        .catch(err => console.log(err))
        setMessage(result)
        setDockerizerLoading(false)

    }

    const loadImages = async () => {
        const req = await fetch("http://192.168.1.105:8000/images")
        const resp = await req.json()
        .catch(err => console.log(err))
        console.log(resp)
        setImages(resp.images)

    }
    const loadTags = async (imageName) => {
        setLoadingTags(true)
        setTags([])
        const req = await fetch(`http://192.168.1.105:8000/${imageName}/tags`)
        const response = await req.json()
        .catch(err => console.log(err))
        console.log(response)
        setTags(response.tags)
        setLoadingTags(false)
    }


  return (
    <main>
          <div className='contents'>
              
              <SourceCode appOptions={{ sourceCodeInput, handleChange, handleFileChange, options}} />
              <ApplicationInfo
                  appOptions={{
                    options,
                    handleChange,
                    images,
                    tags, 
                    handleExtrasChange,
                    handleExtrasRemoval,
                    runCommandsNums,
                    setCmdCommandsNums,
                    setRunCommandsNums,
                    cmdCommandsNums,
                    portsNums,
                    setPortsNums,
                    envsNums,
                    setEnvsNums,
                    loadingTags
              }}/>
              <UserSpecInfo appOptions={{ handleChange, options }} />
            
              <button className={dockerizerLoading ?'button-loading' : ''}  onClick={handleSubmit}>
                  {
                      dockerizerLoading ? <Icon icon="eos-icons:three-dots-loading" /> : "Dockerize"
                          
                  }
              </button>
      </div>
    </main>
  )
}

export default Main
