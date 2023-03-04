import React from 'react'
import './sourceCode.css'

const sourceCode = ({appOptions}) => {
    const {handleChange, sourceCodeInput, handleFileChange, options} = appOptions
    return (
        <div className='source-code subheader'>
            <fieldset className='source-code-type'>
                  <legend>
                      Source code
                  </legend>
             
                  <input type="radio" id="link" name="sourceCodeType" value="repo" onChange={handleChange} />
                  <label htmlFor="link">GitHub Repo</label>
                  <input type="radio" id="file" name="sourceCodeType" value="zip" onChange={handleChange} />
                  <label htmlFor="file">Zip File</label>
                  <div className='code-info'>
                      
                
                  {
                      sourceCodeInput && (
                          sourceCodeInput == "zip" ? (
    
                                  <input type="file" name="zipFile" accept=".zip,.gz" onChange={handleFileChange} />
                              
                            ) : (
                                <input type="text" className='repo_text' value={options.gitRepoLink} name="gitRepoLink" onChange={handleChange}/>
                            )
                      )
                      }
                      </div>
            </fieldset>
        </div>
    )
}

export default sourceCode