import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Map from "./map.jsx";

function App() {
  const [count, setCount] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState(null)

  const checkConnection = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/check-connection`)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setConnectionStatus(data.message || 'Connected!')
    } catch (error) {
      setConnectionStatus('❌ Connection failed')
      console.error(error)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <>
      <div>
        <div className="App">
      <Map />
    </div>
      </div>
  

      {connectionStatus && <p>{connectionStatus}</p>}
    </>
  )
}

export default App
