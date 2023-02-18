import React from 'react'
import './index.css'

const defaultOptions = {
    sourceCodeType: "",
    zipFile: null,
    gitRepoLink: "",
}

function Main() {
    const [options, setOptions] = React.useState(defaultOptions);
    const [sourceCodeInput, setSourceCodeInput] = React.useState("");

    const handleChange = (e) => {
        if (e.target.name == "sourceCodeType")
            showCorrectInput(e.target.value);
        setOptions(prevOpt => ({ ...prevOpt, [e.target.name]: e.target.value }));
        console.log(options);
    }
    const handleFileChange = (e) => {
        console.log(e.target.files[0]);
        setOptions(prevOpt=>({... prevOpt, [e.target.name]: e.target.files[0]}))
    }

    const showCorrectInput = (inputType) => {
        setSourceCodeInput(inputType);
        setOptions(prevOpt => ({ ...prevOpt, zipFile: null, gitRepoLink: "" }));
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
    
                                  <input type="file" name="zipFile" onChange={handleFileChange} />
                              
                            ) : (
                                <input type="text" className='repo_text' name="gitRepoLink" onChange={handleChange}/>
                            )
                      )
                      }
                      </div>
              </fieldset>
      </div>
    </main>
  )
}

export default Main
