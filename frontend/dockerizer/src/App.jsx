import { useState } from 'react'
import Header from './components/Header'
import Main from './components/Main'
import Message from './components/Message'
import { Route, Routes } from "react-router-dom"
import ErrorPage from './error-page'

function App() {

  const [message, setMessage] = useState(null)

  return (
    <div className="App">
      {
        message && <Message message={message} setMessage={setMessage} />
      }
      <Header />
      <Routes>
        <Route path="/" element={<Main setMessage={setMessage} />} />
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
      
    </div>
  )
}

export default App
