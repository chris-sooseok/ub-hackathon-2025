// src/components/Map.jsx
import { useState, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import CustomWebcam from "./WebcamComponent.jsx";
import styles from "./Map.module.css"; // <-- new CSS module

// onAdd uses handleAdd function
function ClickToAddMarker({ onAdd }) {
  useMapEvents({
    click(e) {
      const t = e.originalEvent?.target;
      if (t && (t.closest(".leaflet-popup") || t.closest(".no-map-click"))) return;
      onAdd(e.latlng);
    },
  });
  return null;
}

export default function Map() {
  const [marker, setMarker] = useState(null);
  const [showCam, setShowCam] = useState(false);

  function handleAdd(latlng) {
    setMarker({
      id: `${latlng.lat},${latlng.lng}`,
      position: [latlng.lat, latlng.lng],
    });
    setShowCam(false);
  }

  const pin = useMemo(() => {
    if (!marker) return "";
    const [lat, lng] = marker.position;
    return `${lat.toFixed(5)}_${lng.toFixed(5)}`;
  }, [marker]);

  const stop = (e) => e.stopPropagation();

  return (
    <MapContainer
      center={[43.0001, -78.7865]}
      zoom={15}
      scrollWheelZoom
      maxBounds={[[43.014648, -78.804791], [42.984009, -78.757779]]}
      minZoom={17}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickToAddMarker onAdd={handleAdd} />

      {marker && (
        <Marker
          key={marker.id}
          position={marker.position}
          eventHandlers={{ add: (e) => e.target.openPopup() }}
        >
          <Popup autoPan>
            <div className="no-map-click" onMouseDown={stop} onClick={stop} onTouchStart={stop} style={{ minWidth: 220 }}>
              {!showCam ? (
                <button
                  type="button"
                  onClick={(e) => { stop(e); setShowCam(true); }}
                >
                  Take picture
                </button>
              ) : (
                <CustomWebcam
                  lat={marker.position[0]}
                  lng={marker.position[1]}
                  onUploaded={() => setShowCam(false)}
                  onCancel={() => setShowCam(false)}
                />
              )}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
