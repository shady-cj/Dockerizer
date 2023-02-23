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
        setOptions(prevOpt => ({ ...prevOpt, [e.target.name]: e.target.value.trim() }));
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
    
    const handleSubmit = async (e) => {
        console.log(options);
        if (options.sourceCodeType == "zip" && options.zipFile == null)
            alert('Error: No zip file selected')
        else if (options.sourceCodeType == "repo" && options.gitRepoLink == "")
            alert('Error: No repo link added')
        else if (options.sourceCodeType == "")
            alert("Choose a zip file or put a repo link of the source code to dockerize")
        const data = new FormData();
        for (let optionKey in options) {
            data.append(optionKey, options[optionKey])
        }
        console.log(data);
        const response = await fetch('http://192.168.0.106:8000', {
            method: "POST",
            body: data,
        })
        const result = await response.json()
        .catch(err=> console.log(err))
        console.log(result);

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
    
                                  <input type="file" name="zipFile" accept=".zip,.rar,.7z,.gz" onChange={handleFileChange} />
                              
                            ) : (
                                <input type="text" className='repo_text' name="gitRepoLink" onChange={handleChange}/>
                            )
                      )
                      }
                      </div>
              </fieldset>

              <button style={{fontWeight: "bold"}} onClick={handleSubmit}>Dockerize</button>
      </div>
    </main>
  )
}

export default Main
