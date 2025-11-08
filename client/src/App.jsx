import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"; 
import RootLayout from './pages/RootLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';


export const router = createBrowserRouter(
  [ 
    { path: "/", element: <Navigate to="/app" replace /> },
    { path: "/app", 
      element: <RootLayout />,
      children: [
        {index: true, element: <LandingPage />},
        {path: 'login', element: <LoginPage />}
      ],
    },
    { path: "*", element: <Navigate to="/app" replace /> }, // simple catch-all
  ]
)

function App() {
  return <RouterProvider router={router} />;
}

export default App
