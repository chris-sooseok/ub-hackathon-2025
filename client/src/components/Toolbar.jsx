// src/components/Navbar.jsx
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import settingsIcon from "../assets/icons/Settings.svg";
import styles from "./Toolbar.module.css"; // use this module

export default function Toolbar() {
  const isAuthenticated = useContext(AuthContext); // boolean
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();                 // for redirect after sign out

  async function handleSignOut() {
    try {
      // expects a backend route that clears the session cookie
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",                 // send cookies
        headers: { Accept: "application/json" }
      });
    } catch {
      // ignore network errors; we'll still navigate
    } finally {
      setOpen(false);                           // close the toggle
      navigate("/app/login", { replace: true }); // go to login (AuthContext will re-check)
    }
  }

  return (
    <div className={styles.toolbar}>
      {isAuthenticated ? (
        <div className={styles.settingsWrap}>
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls="settings-menu"
          >
            <img src={settingsIcon} alt="options" />
          </button>

          {open && (
            <div id="settings-menu" className={styles.settingsMenu} role="menu">
              <div id="leaderTitle" role ="columnheader" className={styles.menuItem}>Leaderboard</div>
                <hr role ="separator"></hr>
                <hr role ="separator"></hr>
                <div id="leader1" role ="cell" className={styles.menuItem}>Neem - 40pts</div>
                <hr role ="separator"></hr>
                <div id="leader2" role ="cell" className={styles.menuItem}>Chris - 20pts</div>
                <hr role ="separator"></hr>
                <div id="leader3" role ="cell" className={styles.menuItem}>Alex - 15pts</div>
                <hr role ="separator"></hr>
                <div id="leader4" role ="cell" className={styles.menuItem}>Oscar - 10pts</div>
                <hr role ="separator"></hr>
                <div id="leader5" role ="cell" className={styles.menuItem}>Azriel - 5pts</div>
                <hr role ="separator"></hr>
                <hr role ="separator"></hr>
              <div className={styles.menuItem} role="button" onClick={handleSignOut}>
                Sign out
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link to="/app/login"  className={`${styles.btn} ${styles.primary} ${styles.tb3}`}>
            Log In
          </Link>
          <Link to="/app/signup" className={`${styles.btn} ${styles.secondary} ${styles.tb3}`}>
            Register
          </Link>
        </>
      )}
    </div>
  );
}
