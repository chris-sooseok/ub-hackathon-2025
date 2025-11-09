import React from "react";
import { Component,useState, useEffect } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import CustomWebcam from "../WebcamComponent.jsx";

export default function Map() {
 
   
  

  
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
      
      <Marker position={[43.0001, -78.78659]} >
        <Popup>
          <img src={`${import.meta.env.VITE_API_URL || ''}/map/get/1`} alt = {"No Photo found"}/>
        </Popup>
      </Marker>
      <Marker position={[43.000654, -78.787099]} >
        <Popup>
          <img src={`${import.meta.env.VITE_API_URL || ''}/map/get/2`} alt={"No photo found"}/>
        </Popup>
      </Marker>
      <Marker position={[43.001130, -78.788515]}>
        <Popup>
          <img src={`${import.meta.env.VITE_API_URL || ''}/map/get/3`}alt={"No photo found"}/>
        </Popup>
      </Marker>
    </MapContainer>
    </>
  );
}