
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

export default function RootLayout() {

    const checkConnection = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/check-connection`)
          if (!response.ok) throw new Error('Network response was not ok')
          const data = await response.json()
          console.log(data.message);
        } catch (error) {
          console.error(error)
        }
      }

    useEffect(() => {
        checkConnection()
    }, [])

    return (
    <>
        <Outlet />
    </>
    )
}