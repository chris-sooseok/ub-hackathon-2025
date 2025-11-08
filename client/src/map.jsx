import React from "react";
import { Component } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

export default function Map() {
    const handleClick = () => {
    const [data, setdata] = useState({
        message:""
    });
  useEffect(() => {
        // Using fetch to fetch the api from 
        // flask server it will be redirected to proxy
        fetch("/map/send/1").then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                setdata({
                    message: data.message,
                });
            })
        );
    }, []);
    console.log(data);
  }
  return (
    <MapContainer center={[43.0001, -78.7865]} zoom={15} scrollWheelZoom={true} maxBounds={[[43.014648, -78.804791], [42.984009, -78.757779]]} minZoom={17} 
>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[43.0001, -78.78659]}>
        <Popup>
          <button onClick={handleClick}>Press Me</button>
        </Popup>
      </Marker>
    </MapContainer>
  );
}