import React from "react";
import { Component,useState, useEffect } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import CustomWebcam from "../WebcamComponent.jsx";

export default function MapPage() {
    const handleClick = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/map/send/`+id)
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      console.log(data.message)
    } catch (error) {
      console.error(error)
    }
  
  }

  
  return (
    <>
    <div>
      <CustomWebcam id={1}/>
    </div>
    <MapContainer center={[43.0001, -78.7865]} zoom={15} scrollWheelZoom={true} maxBounds={[[43.014648, -78.804791], [42.984009, -78.757779]]} minZoom={17} 
>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[43.0001, -78.78659]}>
        <Popup>
          <button onClick={handleClick(1)}>Press Me</button>
        </Popup>
      </Marker>
    </MapContainer>
    </>
  );
}