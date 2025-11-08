import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./pages/RootLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect "/" → "/app" */}
        <Route path="/" element={<Navigate to="/app" replace />} />

        {/* App section with nested routes rendered inside RootLayout's <Outlet /> */}
        <Route path="/app" element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        {/* Catch-all → "/app" */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
