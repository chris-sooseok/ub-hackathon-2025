
import { Outlet } from "react-router-dom";

export default function RootLayout() {
    const [connectionStatus, setConnectionStatus] = useState(null)
    
    const checkConnection = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/check-connection`)
          if (!response.ok) throw new Error('Network response was not ok')
          const data = await response.json()
          setConnectionStatus(data.message || 'Connected!')
        } catch (error) {
          setConnectionStatus('❌ Connection failed')
          console.error(error)
        }
      }

    useEffect(() => {
        checkConnection()
    }, [])


    return (
    <>
        {console.log(connectionStatus)}
        <Outlet />
    </>
    )
}