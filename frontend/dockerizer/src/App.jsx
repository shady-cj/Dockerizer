import { useState } from 'react'
import Header from './components/Header'
import Main from './components/Main'
import Message from './components/Message'

function App() {

  const [message, setMessage] = useState(null)

  return (
    <div className="App">
      {
        message && <Message message={message} setMessage={setMessage} />
      }
      <Header />
      <Main setMessage={setMessage} />
    </div>
  )
}

export default App
