import { useNavigate } from "react-router-dom";
import MapPage from "../MapPage.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useContext } from "react";
import Toolbar from "../components/toolbar"

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useContext(AuthContext);

  return (
    <>
      <MapPage />
      <Toolbar />
      {!isAuthenticated && (
        <>
          <button type="button" onClick={() => navigate("login")}>
            Go to Login
          </button>
          <button type="button" onClick={() => navigate("signup")}>
            Go to Signup
          </button>
        </>
      )}
    </>
  );
}
