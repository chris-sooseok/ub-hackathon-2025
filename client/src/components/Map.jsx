// src/components/Map.jsx
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import CustomWebcam from "./WebcamComponent.jsx";
import styles from "./Map.module.css";

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
  const [pins, setPins] = useState([]);          // saved pins from backend
  const [marker, setMarker] = useState(null);    // one temporary marker for new pin
  const [showCam, setShowCam] = useState(false); // show camera UI for temp marker

  // Fetch all pins on first render
  useEffect(() => {
    const ctrl = new AbortController();          // allows aborting if component unmounts
    fetchPins(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  async function fetchPins(signal) {
    try {
      const r = await fetch(`${import.meta.env.VITE_API_URL}/map/fetch-pins`, { signal }); // GET all pins
      if (!r.ok) return;
      const data = await r.json();
      setPins(Array.isArray(data) ? data : []);
    } catch { /* ignore for now */ }
  }

  function handleAdd(latlng) {
    setMarker({
      id: `${latlng.lat},${latlng.lng}`,
      position: [latlng.lat, latlng.lng],
    });
    setShowCam(false);
  }

  const stop = (e) => e.stopPropagation();       // prevents map from treating popup clicks as map clicks

  return (
    <MapContainer
      center={[43.0001, -78.7865]}
      zoom={17}
      scrollWheelZoom
      maxBounds={[[43.014648, -78.804791], [42.984009, -78.757779]]}
      minZoom={17}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickToAddMarker onAdd={handleAdd} />

      {/* Saved pins from backend */}
      {pins.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]}>
          <Popup autoPan>Saved pin</Popup>
        </Marker>
      ))}

      {/* Temporary marker for creating a new pin */}
      {marker && (
        <Marker
          key={marker.id}
          position={marker.position}
          eventHandlers={{ add: (e) => e.target.openPopup() }}
        >
          <Popup autoPan>
            <div
              className="no-map-click"
              onMouseDown={stop}
              onClick={stop}
              onTouchStart={stop}
              style={{ minWidth: 220 }}
            >
              {!showCam ? (
                <button
                  type="button"
                  className={styles.takePhotoBtn}
                  onClick={() => setShowCam(true)}
                >
                  Take picture
                </button>
              ) : (
                <CustomWebcam
                  lat={marker.position[0]}
                  lng={marker.position[1]}
                  onUploaded={async () => {
                    setShowCam(false);
                    setMarker(null);        // Remove temp marker so the button disappears
                    await fetchPins();      // Reload pins so new one shows up
                  }}
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
