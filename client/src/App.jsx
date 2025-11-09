import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css"
import RootLayout from "./pages/RootLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";
import AuthTestPage from './pages/AuthTestPage.jsx';
import { AuthProvider } from "./context/AuthContext.jsx";
import Test from "./pages/Test.jsx";

export default function App() {

  return (
    <> 
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect "/" → "/app" */}
          <Route path="/" element={<Navigate to="/app" replace />} />

          {/* App section with nested routes rendered inside RootLayout's <Outlet /> */}
          <Route path="/app" element={<RootLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="test" element={<AuthTestPage />} />
            <Route path="/test" element={<Test />}/>
            <Route path="/make-post" element={<Test />}/>
          </Route>

          {/* Catch-all → "/app" */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </>
  );
}
