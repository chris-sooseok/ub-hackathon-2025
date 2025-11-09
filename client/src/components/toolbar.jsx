// toolbar contains login/register if not logged in
// pic/map button and options if logged on
import { useState } from "react";
import cameraIcon from "../assets/icons/Camera.svg";
import mapIcon from "../assets/icons/Map.svg";
import settingsIcon from "../assets/icons/Settings.svg";
import { Link } from "react-router-dom";

const Toolbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const onPostPage = location.pathname.startsWith("/make-post");

    return (
        <div id="toolbar">
            {/* Case 1: Logged in & NOT on post page */}
            {isLoggedIn && !onPostPage ? (
                <>
                    <button className="btn left secondary icon">
                        <img src={settingsIcon} alt="options" />
                    </button>
                    <Link to="/make-post" className="btn center primary icon">
                        <img src={cameraIcon} alt="make post" />
                    </Link>
                </>
            ) : isLoggedIn && onPostPage ? (
                // Case 2: Logged in & on post page
                <>
                    <button className="btn left secondary icon">
                        <img src={settingsIcon} alt="options" />
                    </button>
                    <Link to="/app" className="btn center primary icon">
                        <img src={mapIcon} alt="map" />
                    </Link>
                </>
            ) : (
                // Case 3: Not logged in
                <>
                    <Link to="/app/login" className="btn tb-3 primary">Log In</Link>
                    <Link to="/app/signup" className="btn tb-3 secondary">Register</Link>
                </>
            )}
        </div>
    )
}

export default Toolbar;