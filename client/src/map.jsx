import React from "react";
import { Component,useState, useEffect } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import CustomWebcam from "./WebcamComponent.jsx";

export default function Map() {
 
// //    

//     // GET request using fetch with async/await
//     const response = fetch(`${import.meta.env.VITE_API_URL || ''}/map/get`);
//     pin_list = response.json();
//     pin_list = pin_list["pins"];
//     for (const [key, value] of Object.entries(pin_list)) {
//     // note: we are adding a key prop here to allow react to uniquely identify each
//     // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
//     pin_render.push(<Marker position={value["loc"]}/>);


//         console.log(value["loc"]);
//     }


    var pin_id =0;
    const handleClick = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/map/get/`+id);
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      v = document.getElementById();
      v.src=data
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