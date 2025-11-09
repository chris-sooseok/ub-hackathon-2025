
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function AuthTestPage() {

  const isAuthenticated = useContext(AuthContext)
  if (isAuthenticated) {
    console.log("test page authenticated");
  }
  else {
    console.log("test page authenticated");
  }

  return (
  <>
    {isAuthenticated}
  </>
  );
}