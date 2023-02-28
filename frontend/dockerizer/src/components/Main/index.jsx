import React from 'react'
import './index.css'

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
    runCommands: {},
    cmdCommands: {},
    ports: {},
    envs: {}
}

function Main() {
    const [options, setOptions] = React.useState(defaultOptions);
    const [sourceCodeInput, setSourceCodeInput] = React.useState("");
    const [images, setImages] = React.useState([])
    const [tags, setTags] = React.useState([])
    const [runCommandsNums, setRunCommandsNums] = React.useState([1])
    const [cmdCommandsNums, setCmdCommandsNums] = React.useState([1])
    const [portsNums, setPortsNums] = React.useState([1])
    const [envsNums, setEnvsNums] = React.useState([1])

    const handleChange = (e) => {
        if (e.target.name === "sourceCodeType")
            showCorrectInput(e.target.value);
        if (e.target.name === "dockerfilePresent")
        {
            if (e.target.value.trim() == "no")
                loadImages()
            
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
        console.log(options);
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
        if (options.customDockerfile.length < 10)
        {
            if (!options.baseImage.length)
            {
                alert("If you don't have a valid dockerfile template please select a base docker image to correctly build your image")
                return;
            }

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
        console.log(data);
        // 192.168.0.106
        // 172.20.10.5
        const response = await fetch('http://192.168.0.105:8000', {
            method: "POST",
            body: data,
        })
        const result = await response.json()
        .catch(err=> console.log(err))
        console.log(result);
        // setTags([])
        // setOptions(defaultOptions)

    }

    const loadImages = async () => {
        const req = await fetch("http://192.168.0.105:8000/images")
        const resp = await req.json()
        .catch(err => console.log(err))
        console.log(resp)
        setImages(resp.images)

    }
    const loadTags = async (imageName) => {
        setTags([])
        const req = await fetch(`http://192.168.0.105:8000/${imageName}/tags`)
        const response = await req.json()
        .catch(err => console.log(err))
        console.log(response)
        setTags(response.tags)
    }


  return (
    <main>
          <div className='contents'>
              <fieldset className='source-code-type'>
                  <legend>
                      Source code? 
                  </legend>
             
                  <input type="radio" id="link" name="sourceCodeType" value="repo" onChange={handleChange} />
                  <label htmlFor="link">GitHub Repo</label>
                  <input type="radio" id="file" name="sourceCodeType" value="zip" onChange={handleChange} />
                  <label htmlFor="file">Zip File</label>
                  <div className='code-info'>
                      
                
                  {
                      sourceCodeInput && (
                          sourceCodeInput == "zip" ? (
    
                                  <input type="file" name="zipFile" value={options.zipFile} accept=".zip,.gz" onChange={handleFileChange} />
                              
                            ) : (
                                <input type="text" className='repo_text' value={options.gitRepoLink} name="gitRepoLink" onChange={handleChange}/>
                            )
                      )
                      }
                      </div>
              </fieldset>
              <fieldset className='application-info'>
                  <legend>
                      Application Configuration
                  </legend>
                  <section className='root-folder'>
                      <label htmlFor='rootfolder-text'>What is the root folder of your application</label>
                      <input type="text" name="rootFolder" value={options.rootFolder} id="rootfolder-text" onChange={handleChange} /><br/>
                      <small style={{ color: "gray", marginLeft: "0.25rem", fontSize:"0.7em"}}>You can just type in "." or leave empty if the root folder is the present application folder.</small>
                  </section>
                  <section className='dockerfile-present'>
                      <h4>Do you have a dockerfile present in the source code provided?</h4>
                      <input type="radio" name="dockerfilePresent" id='dockerfile-yes' value='yes' onChange={handleChange} /> <label htmlFor='dockerfile-yes'>Yes</label> 
                      <input type="radio" name="dockerfilePresent" id='dockerfile-no' value='no' onChange={handleChange}/> <label htmlFor="dockerfile-no"> No </label>

                      <section style={{margin: "0.45rem 0.7rem"}}>
                        {
                        options.dockerfilePresent === "yes" ? <>
                            <label htmlFor="dockerfilePath" style={{marginRight: "0.7rem", fontSize:"0.8em"}}>The Dockerfile path relative to the root folder specified</label>
                            <input type="text" name="dockerfilePath" value={options.dockerfilePath} id="dockerfilePath" onChange={handleChange} style={{fontSize: "0.6em", height: "0.8rem",width: "8rem"}} placeholder="Leave blank if same as root folder"/> 
                        </> : <>
                            {
                                images.length ? <>
                                    <label htmlFor="image" style={{marginRight: "0.8rem"}}>Type or Choose your base image</label>
                                    <input list="images" id="image" name="baseImage" value={options.baseImage} style={{padding: "0.1rem 0.3rem"}} placeholder='select your image here!' onChange={handleChange}/>
                                    <datalist id="images">
                                        {images.map((image, index) => {
                                            return <option key={index} value={image}/>
                                        })}
                                    </datalist>
                                    {
                                        tags.length ? <div style={{margin: "0.3rem 0.2rem"}}>
                                            <label htmlFor="tag" style={{marginRight: "0.8rem", fontSize: "0.85em"}}>Type or Choose the tag or version for the image</label>
                                            <input list="tags" id="tag" name="imageTag" value={options.imageTag} style={{padding: "0.1rem 0.3rem"}} placeholder='select the tag/version here!' onChange={handleChange}/>
                                            <datalist id="tags">
                                                {tags.map((tag, index) => {
                                                    return <option key={index} value={tag}/>
                                                })}
                                            </datalist>
                                        </div> : <></>
                                    }
                                    {
                                        options.baseImage.length ? <section>
                                        <div>
                                        <label style={{fontSize: "0.85em"}}>Do you have commands you would like to run while building the image?</label><br/>
                                        {
                                                runCommandsNums.map((item, index) => {
                                                return <div key={item}>
                                                        <input type="text" name="runCommands" onChange={(e) => handleExtrasChange(e, `run-${item}`)} placeholder='npm install'/>
                                                        {
                                                            item !== 1 && <small onClick={()=>{
                                                                setRunCommandsNums(prev => prev.filter(val => val != item))
                                                                handleExtrasRemoval('runCommands', `run-${item}`)
                                                            }}> Remove</small>
                                                        }
                                                        
                                                        </div>
                                            })

                                        }
                                        <a style={{ cursor: "pointer", fontSize: "0.85em", marginLeft: "0.4em"}} onClick={
                                            ()=> setRunCommandsNums(prev => {
                                                const last = prev[prev.length - 1]
                                                return [...prev, last + 1]
                                            })
                                        }>More...</a>
                                        </div>
                                        <div>
                                        <label style={{fontSize: "0.85em"}}>Do you have a port you need to open up on the image(for running containers)</label>
                                        {
                                            portsNums.map((item) => {
                                                return <div key={item}>
                                                    <input type="text" name="ports" onChange={(e) => handleExtrasChange(e, `port-${item}`)} placeholder='4000' />
                                                    {
                                                        item !== 1 && <small onClick={()=> {
                                                            setPortsNums(prev => prev.filter(val => val != item))
                                                            handleExtrasRemoval('ports', `port-${item}`)
                                                        }
                                                        }> Remove</small>
                                                    }
                                                        </div>
                                            })
                                        } 
                                        <a style={{cursor: "pointer", fontSize: "0.85em", marginLeft: "0.4em"}} onClick={
                                            ()=> setPortsNums(prev => {
                                                const last = prev[prev.length - 1]
                                                return [...prev, last + 1]
                                            })
                                        }>More...</a>
                                        </div>
                                        <div>
                                        <label style={{fontSize: "0.85em"}}>Commands to start up your apps?</label>
                                        {
                                            
                                            cmdCommandsNums.map((item, index) => {
                                                return <div key={item}><input type="text" name="cmdCommands" onChange={(e) => handleExtrasChange(e, `cmd-${item}`)} placeholder='npm run dev' />
                                                {
                                                    item !== 1 && <small onClick={()=> {
                                                        setCmdCommandsNums(prev => prev.filter(val => val != item))
                                                        handleExtrasRemoval('cmdCommands', `cmd-${item}`)
                                                    }}> Remove</small>
                                                }
                                                
                                                </div>
                                            })
                                        } 
                                        <a style={{cursor: "pointer", fontSize: "0.85em", marginLeft: "0.4em"}} onClick={
                                            ()=> setCmdCommandsNums(prev => {
                                                const last = prev[prev.length - 1]
                                                return [...prev, last + 1]
                                            })
                                        }>More...</a>
                                        </div>
                                        <div>
                                        <label style={{fontSize: "0.85em"}}>Environment variables?</label>
                                        {
                                            envsNums.map((item, index) => {
                                                return <div key={item}><input type="text" name="envs" onChange={(e) => handleExtrasChange(e, `env-${item}`)} placeholder="foo=bar"/>
                                                {
                                                    item !== 1 && <small onClick={()=>{
                                                        setEnvsNums(prev => prev.filter(val => val != item))
                                                        handleExtrasRemoval('envs', `env-${item}`)
                                                    }}> Remove</small>
                                                }
                                                </div>
                                            })
                                        } 
                                        <a style={{cursor:"pointer", fontSize: "0.85em", marginLeft: "0.4em"}} onClick={
                                            ()=> setEnvsNums(prev => {
                                                const last = prev[prev.length - 1]
                                                return [...prev, last + 1]
                                            })
                                        }>More...</a>
                                        </div>
                                    </section> : <></>
                                    }
                                    
                                    <section style={{marginTop: "1rem"}}>
                                        <div style={{marginBottom:"0.4rem"}}>
                                        <label htmlFor="custom-dockerfile" style={{fontSize: "0.85em"}}>
                                            Custom Dockerfile? paste or type here
                                        </label>
                                        </div>
                                        <textarea rows={"10"} cols={"50"} style={{maxWidth: "25rem", padding: "0.4rem 0.55rem"}} value={options.customDockerfile} onChange={handleChange} name="customDockerfile"></textarea>
                                    </section>


                                    </> : <> 
                                    {options.dockerfilePresent === "no" ? <div>loading...</div> : <></>}
                                    </>
                                    
                            }
                            
                        </>
                        
                    }

                      </section>
                  </section>
                  
              </fieldset>

              <button style={{fontWeight: "bold"}} onClick={handleSubmit}>Dockerize</button>
      </div>
    </main>
  )
}

export default Main
