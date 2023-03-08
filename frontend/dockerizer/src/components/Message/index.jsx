import React from 'react'
import './index.css'
import { Icon } from '@iconify/react';

const index = ({message, setMessage}) => {
  return (
      <section className='modal-overlay'>
          
          <div className='display-message'>
                <small onClick={()=>setMessage(null)}><Icon icon="material-symbols:cancel-outline-sharp" /></small>
              {
                  message?.error ? <>
                      <h4 className="error-message">Error <Icon icon="material-symbols:cancel" /></h4>
                      <p> {message?.error} </p>     
                    </> :
                      <>
                          <h4 className="success-message"> Success <Icon icon="gridicons:checkmark-circle" /> </h4>
                          <p>Access Your image below</p>
                          <a href={message?.image} target="_blank">{message?.image}</a>
                      </>
              }
          </div>
    </section>
  )
}

export default index