import React from 'react'
import "./applicationInfo.css"
import { Icon } from '@iconify/react';

const applicationInfo = ({ appOptions }) => {
    const {
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

    } = appOptions
  return (
      <div className='application subheader'>
          
        <fieldset className='application-info'>
                <legend>
                    Application Configuration
                </legend>
                <section className='root-folder'>
                  <label htmlFor='rootfolder-text'>What is the root folder of your application</label>
                  <div className='root-folder-wrapper'>
                    <input className='root-folder-text' type="text" name="rootFolder" value={options.rootFolder} id="rootfolder-text" onChange={handleChange} />
                    <small>You can just type in "." or leave empty if the root folder is the present application folder.</small>
                  </div>
              </section>
              <section className='dockerfile-present'>
                  <section>
                      
                    <h4 className={options.dockerfilePresent === "yes" ? "show-dock-path": undefined}>Do you have a dockerfile present in the source code provided?</h4>
                    <div> 
                        <div>
                        <input type="radio" name="dockerfilePresent" id='dockerfile-yes' value='yes' onChange={handleChange} /> <label htmlFor='dockerfile-yes'>Yes</label> 
                        </div>
                        <div>
                            
                            <input type="radio" name="dockerfilePresent" id='dockerfile-no' value='no' onChange={handleChange} /> <label htmlFor="dockerfile-no"> No </label>
                        </div>
                    </div>
                  </section>

                  <section>
                    {
                    options.dockerfilePresent === "yes" ? <div className='docker-file-path'>
                        <label htmlFor="dockerfilePath" style={{marginRight: "0.7rem", fontSize:"0.8em"}}>The Dockerfile path relative to the root folder specified</label>
                        <input type="text" name="dockerfilePath" value={options.dockerfilePath} id="dockerfilePath" onChange={handleChange} style={{fontSize: "0.6em", height: "0.8rem",width: "8rem"}} placeholder="Leave blank if same as root folder"/> 
                          </div> : <div className={images.length ? 'options-container' : undefined}>
                        {
                            images.length ? <div className="image-info-container">
                              <section className='image-container'>
                                              
                                    <label htmlFor="image" style={{marginRight: "0.8rem"}}>Type or Choose your base image</label>
                                    <input list="images" id="image" name="baseImage" value={options.baseImage} style={{padding: "0.1rem 0.3rem"}} placeholder='select your image here!' onChange={handleChange}/>
                                    <datalist id="images">
                                        {images.map((image, index) => {
                                            return <option key={index} value={image}/>
                                        })}
                                    </datalist>
                                </section> 
                                {
                                    loadingTags ? <Icon icon="eos-icons:three-dots-loading" /> :
                                    tags.length ? <div className='tag-info-container'>
                                        <label htmlFor="tag" >Type or Choose the tag or version for the image</label>
                                        <input list="tags" id="tag" name="imageTag" value={options.imageTag} style={{padding: "0.1rem 0.3rem"}} placeholder='select the tag/version here!' onChange={handleChange}/>
                                        <datalist id="tags">
                                            {tags.map((tag, index) => {
                                                return <option key={index} value={tag}/>
                                            })}
                                        </datalist>
                                    </div> : <></>
                                }
                                {
                                    options.baseImage.length ? <section className='command-options'>
                                    <div>
                                        <label htmlFor="app-dir">App Directory Path</label>
                                        <input type="text" name="appDirectory" id="app-dir" placeholder='Directory your app is present in? e.g /app' className='appdir-info' onChange={handleChange} />
                                        {/* <small style={{ color: "gray", marginLeft: "0.25rem", fontSize:"0.7em"}}>Provide the directory in which the app you wish to create an image of is present(relative to the root folder). leave blank or enter "." if it's the same directory as the root folder/directory</small> */}
                                    </div>
                                    <div>
                                        <label>Do you have commands you would like to run while building the image?</label>
                                        <div className='extras-input'>
                                            {
                                                runCommandsNums.map((item, index) => {
                                                    return <div key={item}>
                                                        {
                                                            item !== 1 && <small onClick={()=>{
                                                                setRunCommandsNums(prev => prev.filter(val => val != item))
                                                                handleExtrasRemoval('runCommands', `run-${item}`)
                                                            }}> <Icon icon="material-symbols:cancel-outline-sharp" /></small>
                                                        }
                                                        <input type="text" name="runCommands" onChange={(e) => handleExtrasChange(e, `run-${item}`)} placeholder='npm install'/>
                                                        
                                                        
                                                        </div>
                                            })

                                        }
                                        <a onClick={
                                            ()=> setRunCommandsNums(prev => {
                                                const last = prev[prev.length - 1]
                                                return [...prev, last + 1]
                                            })
                                        }>More...</a>
                                        </div>
                                    </div>
                                    <div>
                                    <label>Do you have a port you need to open up on the image(for running containers)</label>
                                        <div className='extras-input'>
                                                          
                                            {
                                            portsNums.map((item) => {
                                                return <div key={item}>
                                                    {
                                                        item !== 1 && <small onClick={()=> {
                                                            setPortsNums(prev => prev.filter(val => val != item))
                                                            handleExtrasRemoval('ports', `port-${item}`)
                                                        }
                                                        }> <Icon icon="material-symbols:cancel-outline-sharp" /></small>
                                                    }
                                                    <input type="text" name="ports" onChange={(e) => handleExtrasChange(e, `port-${item}`)} placeholder='4000' />
                                                    
                                                        </div>
                                            })
                                            } 
                                        <a onClick={
                                        ()=> setPortsNums(prev => {
                                            const last = prev[prev.length - 1]
                                            return [...prev, last + 1]
                                        })
                                        }>More...</a>
                                        </div>
                                                          
                                    
                                    </div>
                                    <div>
                                        <label>Commands to start up your apps?</label>
                                        <div className='extras-input'>     
                                            {
                                            
                                            cmdCommandsNums.map((item, index) => {
                                                return <div key={item}>
                                                    {
                                                    item !== 1 && <small onClick={()=> {
                                                        setCmdCommandsNums(prev => prev.filter(val => val != item))
                                                        handleExtrasRemoval('cmdCommands', `cmd-${item}`)
                                                    }}> <Icon icon="material-symbols:cancel-outline-sharp" /></small>
                                                    }
                                                    <input type="text" name="cmdCommands" onChange={(e) => handleExtrasChange(e, `cmd-${item}`)} placeholder='npm run dev' />
                                                
                                                
                                                </div>
                                            })
                                        } 
                                        <a onClick={
                                            ()=> setCmdCommandsNums(prev => {
                                                const last = prev[prev.length - 1]
                                                return [...prev, last + 1]
                                            })
                                        }>More...</a>
                                        </div>
                                    </div>
                                    <div>
                                         <label>Environment variables?</label>
                                        <div className='extras-input'>           
                                            {
                                                envsNums.map((item, index) => {
                                                    return <div key={item}>
                                                        {
                                                        item !== 1 && <small onClick={()=>{
                                                            setEnvsNums(prev => prev.filter(val => val != item))
                                                            handleExtrasRemoval('envs', `env-${item}`)
                                                        }}> <Icon icon="material-symbols:cancel-outline-sharp" /></small>
                                                        }
                                                        <input type="text" name="envs" onChange={(e) => handleExtrasChange(e, `env-${item}`)} placeholder="foo=bar" />
                                                    </div>
                                                })
                                            } 
                                            <a onClick={
                                                ()=> setEnvsNums(prev => {
                                                    const last = prev[prev.length - 1]
                                                    return [...prev, last + 1]
                                                })
                                            }>More...</a>
                                        </div>
                                    </div>
                                </section> : <></>
                                }
                                
                                <section className='custom-dockerfile-container'>
                                    <label htmlFor="custom-dockerfile">
                                        Custom Dockerfile? paste or type here
                                    </label>
                                              <textarea rows={"10"} cols={"50"} onChange={handleChange} name="customDockerfile"
                                                  placeholder='
                                                  FROM python:3.10-slim-bullseye...'></textarea>
                                </section>


                                </div> : <> 
                                {options.dockerfilePresent === "no" ? <Icon icon="eos-icons:three-dots-loading" /> : <></>}
                                </>
                                
                        }
                        
                    </div>
                    
                }

                    </section>
                </section>
                
            </fieldset>
    </div>
  )
}

export default applicationInfo