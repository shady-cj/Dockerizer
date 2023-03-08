import React from 'react'

const error_page = () => {


  return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i style={{color: "red"}}>The route you are looking for doesn't exist</i>
        </p>
    </div>
  )
}

export default error_page
