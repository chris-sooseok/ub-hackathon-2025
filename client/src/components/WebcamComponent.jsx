// src/WebcamComponent.jsx
import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
import styles from "./WebcamComponent.module.css"; // CSS Module for styles

const CustomWebcam = ({ lat, lng, onUploaded, onCancel }) => {
  const webcamRef = useRef(null);                 // holds the webcam instance
  const [imgSrc, setImgSrc] = useState(null);     // captured data URL (preview)
  const [busy, setBusy] = useState(false);        // upload in progress
  const [notice, setNotice] = useState(null); 
  
  const stop = (e) => e.stopPropagation();        // prevents map from handling clicks

  const capture = useCallback(() => {
    const dataUrl = webcamRef.current?.getScreenshot(); // data:image/webp;base64,...
    if (!dataUrl) return;
    setImgSrc(dataUrl);                                 // show preview + Upload button
  }, []);

  const upload = useCallback(async () => {
    if (!imgSrc || lat == null || lng == null) return;           // ✅ require lat/lng
    setBusy(true);
    setNotice(null);
    try {
      const blob = await (await fetch(imgSrc)).blob();
      const form = new FormData();
      form.append("image", blob);
      form.append("lat", String(lat));                            // ✅ send lat
      form.append("lng", String(lng));                            // ✅ send lng

      console.log(form);
      const r = await fetch(`${import.meta.env.VITE_API_URL || ""}/map/create-marker`, {
        method: "POST",
        body: form,
        credentials: "include",                                   // keep cookies
      });
      console.log(r);

      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }

      setNotice({ type: "success", text: "Upload successful." });
      onUploaded?.();
    } catch (err) {
      setNotice({ type: "error", text: err.message || "Upload failed." });
    } finally {
      setBusy(false);
    }
  }, [imgSrc, lat, lng]);

  const retake = () => setImgSrc(null);

  return (
    <div
      className={`no-map-click ${styles.wrap}`}         /* keep no-map-click for your map filter */
      onMouseDown={stop}
      onClick={stop}
      onTouchStart={stop}
    >
      {!imgSrc ? (
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/webp"                 /* ensure webp data URL */
          videoConstraints={{ facingMode: "environment" }} /* back camera on mobile */
          className={styles.frame}                      /* sized camera viewport */
        />
      ) : (
        <img src={imgSrc} alt="preview" className={styles.frame} />
      )}

      {!imgSrc ? (
        <div className={styles.row}>
          <button
            type="button"
            onMouseDown={stop}
            onClick={capture}                           /* capture only */
            onTouchStart={stop}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Capture
          </button>
          <button
            type="button"
            onMouseDown={stop}
            onClick={() => onCancel?.()}
            onTouchStart={stop}
            className={`${styles.btn} ${styles.btnGhost}`}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className={styles.row}>
          <button
            type="button"
            disabled={busy}
            onMouseDown={stop}
            onClick={upload}                            /* upload after preview */
            onTouchStart={stop}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            {busy ? "Uploading..." : "Upload"}
          </button>
          <button
            type="button"
            onMouseDown={stop}
            onClick={retake}                            /* discard preview and return to camera */
            onTouchStart={stop}
            className={`${styles.btn} ${styles.btnGhost}`}
          >
            Retake
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomWebcam;
