import { useNavigate } from "react-router-dom"; // hook for programmatic navigation

export default function LandingPage() {
  const navigate = useNavigate(); // gives you a navigate(...) function

  return (
    <>
    <button
      type="button"
      onClick={() => navigate("login")} // relative to /app → goes to /app/login
    >
      Go to Login
    </button>    
    <button
      type="button"
      onClick={() => navigate("signup")} // relative to /app → goes to /app/login
    >
      Go to Signup
    </button>
    </>
  );
}
