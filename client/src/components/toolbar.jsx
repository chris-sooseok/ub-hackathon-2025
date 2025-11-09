// toolbar contains login/register if not logged in
// pic/map button and options if logged on
import cameraIcon from "../assets/icons/Camera.svg";
import mapIcon from "../assets/icons/Map.svg";
import settingsIcon from "../assets/icons/Settings.svg";

export default Toolbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const onPostPage = location.pathname.startsWith("/make-post");

    return (
        <div id="toolbar">
            {/* Case 1: Logged in & NOT on post page */}
            {isLoggedIn && !onPostPage ? (
                <>
                    <button>
                        <img src={settingsIcon} alt="options" />
                    </button>
                    <button>
                        <img src={cameraIcon} alt="make post" />
                    </button>
                </>
            ) : isLoggedIn && onPostPage ? (
                // Case 2: Logged in & on post page
                <>
                    <button>
                        <img src={settingsIcon} alt="options" />
                    </button>
                    <button>
                        <img src={mapIcon} alt="map" />
                    </button>
                </>
            ) : (
                // Case 3: Not logged in
                <>
                    <button>Log In</button>
                    <button>Register</button>
                </>
            )}
        </div>
    )
}