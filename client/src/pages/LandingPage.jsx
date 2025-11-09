import MapPage from "../components/Map.jsx"
import Toolbar from "../components/Toolbar.jsx"

export default function LandingPage() {
  // const navigate = useNavigate();
  // const isAuthenticated = useContext(AuthContext);

  return (
    <>
      <MapPage />
      <Toolbar />
      {/* {!isAuthenticated && (
        <>
          <button type="button" onClick={() => navigate("login")}>
            Go to Login
          </button>
          <button type="button" onClick={() => navigate("signup")}>
            Go to Signup
          </button>
        </>
      )} */}
    </>
  );
}
