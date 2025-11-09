// toolbar contains login/register if not logged in
// pic/map button and options if logged on
import { useState } from "react";
import cameraIcon from "../assets/icons/Camera.svg";
import mapIcon from "../assets/icons/Map.svg";
import settingsIcon from "../assets/icons/Settings.svg";

const Toolbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const onPostPage = location.pathname.startsWith("/make-post");

    return (
        <div id="toolbar">
            {/* Case 1: Logged in & NOT on post page */}
            {isLoggedIn && !onPostPage ? (
                <>
                    <button className="left secondary icon">
                        <img src={settingsIcon} alt="options" />
                    </button>
                    <button className="center primary icon">
                        <img src={cameraIcon} alt="make post" />
                    </button>
                </>
            ) : isLoggedIn && onPostPage ? (
                // Case 2: Logged in & on post page
                <>
                    <button className="left secondary icon">
                        <img src={settingsIcon} alt="options" />
                    </button>
                    <button className="center primary icon">
                        <img src={mapIcon} alt="map" />
                    </button>
                </>
            ) : (
                // Case 3: Not logged in
                <>
                    <button className="tb-3 primary">Log In</button>
                    <button className="tb-3 secondary">Register</button>
                </>
            )}
        </div>
    )
}

export default Toolbar;