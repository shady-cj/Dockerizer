import React from 'react'
import "./userSpecInfo.css"

const userSpecInfo = ({ appOptions }) => {
    const {options, handleChange} = appOptions
  return (
      <div className="user-spec subheader">
          
        <fieldset className='user-spec__info'>
                <legend>Personalized Information</legend>
                <section>
                    <div>
                        <label htmlFor="app-name">What do you want to name your image/app ?</label>
                        <input type="text" name="appName" id="app-name" value={options.appName} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="app-tag">What do you want to tag your image/app (version)?</label>
                        <input type="text" name="appTag" id="app-tag" value={options.appTag} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="username">What is your dockerhub username</label>
                        <input type="text" name="hubUsername" id="username" value={options.hubUsername} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="password">What is your dockerhub password</label>
                        <input type="password" name="hubPassword" id="password" value={options.hubPassword} onChange={handleChange}/>
                    </div><br/>
                    <small>It's important to know that your information won't be stored or saved anywhere it's strictly for pushing your image to your docker hub account so you can be assured that it's safe</small>

                    
                </section>
            </fieldset>
    </div>
  )
}

export default userSpecInfo