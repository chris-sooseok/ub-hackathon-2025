import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css"
import RootLayout from "./pages/RootLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";
import Test from "./pages/Test.jsx";

export default function App() {
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
    <BrowserRouter>
      <Routes>
        {/* Redirect "/" → "/app" */}
        {/* <Route path="/" element={<Navigate to="/app" replace />} /> */}

        {/* App section with nested routes rendered inside RootLayout's <Outlet /> */}
        <Route path="/app" element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        {/* Catch-all → "/app" */}
        <Route path="/test" element={<Test />}/>
        <Route path="/make-post" element={<Test />}/>
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
