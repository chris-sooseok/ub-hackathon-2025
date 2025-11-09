import MapPage from "../components/Map";
import Toolbar from "../components/Toolbar";

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
