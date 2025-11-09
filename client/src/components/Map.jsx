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
  const [pins, setPins] = useState([]);
  const [marker, setMarker] = useState(null);          // temp marker for new pin
  const [showCam, setShowCam] = useState(false);       // camera for temp marker

  // per-saved-pin UI state
  const [activePinCamId, setActivePinCamId] = useState(null);   // which saved pin is opening camera
  const [pinImages, setPinImages] = useState({});                // { [id]: objectUrl }
  const [pinLoading, setPinLoading] = useState({});              // { [id]: true/false }
  const [pinError, setPinError] = useState({});                  // { [id]: string|null }

  useEffect(() => {
    const ctrl = new AbortController();
    fetchPins(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  async function fetchPins(signal) {
    try {
      const r = await fetch(`${import.meta.env.VITE_API_URL}/map/fetch-pins`, { signal });
      if (!r.ok) return;
      const data = await r.json();
      setPins(Array.isArray(data) ? data : []);
    } catch {}
  }

  function handleAdd(latlng) {
    setMarker({ id: `${latlng.lat},${latlng.lng}`, position: [latlng.lat, latlng.lng] });
    setShowCam(false);
    setActivePinCamId(null); // close any saved-pin camera
  }

  const stop = (e) => e.stopPropagation();

  // fetch image blob for a pin when its popup opens (uses /map/fetch-image?id=...)
  async function loadPinImage(pinId) {
    if (!pinId || pinImages[pinId] || pinLoading[pinId]) return;
    setPinLoading((m) => ({ ...m, [pinId]: true }));
    setPinError((m) => ({ ...m, [pinId]: null }));
    try {
      const r = await fetch(`${import.meta.env.VITE_API_URL}/map/fetch-image?id=${pinId}`);
      if (!r.ok) throw new Error("failed to fetch image");
      const blob = await r.blob();
      const url = URL.createObjectURL(blob); // comment: release with URL.revokeObjectURL later if you add cleanup
      setPinImages((m) => ({ ...m, [pinId]: url }));
    } catch (err) {
      setPinError((m) => ({ ...m, [pinId]: "Could not load image." }));
    } finally {
      setPinLoading((m) => ({ ...m, [pinId]: false }));
    }
  }

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
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          eventHandlers={{
            popupopen: () => loadPinImage(p.id),
          }}
        >
          <Popup autoPan>
            <div className="no-map-click" onMouseDown={stop} onClick={stop} onTouchStart={stop} style={{ minWidth: 240 }}>
              {/* Image area */}
              {pinLoading[p.id] ? (
                <div style={{ marginBottom: 8 }}>Loading image…</div>
              ) : pinImages[p.id] ? (
                <img
                  src={pinImages[p.id]}
                  alt="pin"
                  style={{ display: "block", width: "100%", height: 160, objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
                />
              ) : pinError[p.id] ? (
                <div style={{ marginBottom: 8, color: "#ef4444" }}>{pinError[p.id]}</div>
              ) : (
                <div style={{ marginBottom: 8 }}>No image.</div>
              )}

              {/* Take picture for this saved pin */}
              {activePinCamId === p.id ? (
                <CustomWebcam
                  lat={p.lat}
                  lng={p.lng}
                  onUploaded={async () => {
                    setActivePinCamId(null);
                    await fetchPins();       // refresh pins after upload
                    // optional: re-fetch image for this pin to show the latest
                    setPinImages((m) => ({ ...m, [p.id]: undefined }));
                    loadPinImage(p.id);
                  }}
                  onCancel={() => setActivePinCamId(null)}
                />
              ) : (
                <button
                  type="button"
                  className={styles.takePhotoBtn}
                  onClick={() => setActivePinCamId(p.id)}
                  style={{ width: "100%" }}
                >
                  Take picture
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Temporary marker for creating a brand-new pin */}
      {marker && (
        <Marker
          key={marker.id}
          position={marker.position}
          eventHandlers={{ add: (e) => e.target.openPopup() }}
        >
          <Popup autoPan>
            <div className="no-map-click" onMouseDown={stop} onClick={stop} onTouchStart={stop} style={{ minWidth: 240 }}>
              {!showCam ? (
                <button
                  type="button"
                  className={styles.takePhotoBtn}
                  onClick={() => setShowCam(true)}
                  style={{ width: "100%" }}
                >
                  Take picture
                </button>
              ) : (
                <CustomWebcam
                  lat={marker.position[0]}
                  lng={marker.position[1]}
                  onUploaded={async () => {
                    setShowCam(false);
                    setMarker(null);
                    await fetchPins();
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
