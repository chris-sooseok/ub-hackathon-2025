// src/WebcamComponent.jsx
import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
import styles from "./WebcamComponent.module.css";

const CustomWebcam = ({ lat, lng, onUploaded, onCancel }) => {
  const webcamRef = useRef(null);
  const labelRef = useRef(null);

  const [imgSrc, setImgSrc] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  // NEW: label + error state
  const [label, setLabel] = useState("");
  const [labelError, setLabelError] = useState(false);

  const stop = (e) => e.stopPropagation();

  const capture = useCallback(() => {
    const dataUrl = webcamRef.current?.getScreenshot();
    if (!dataUrl) return;
    setImgSrc(dataUrl);
  }, []);

  const upload = useCallback(async () => {
    // require label
    if (!label.trim()) {
      setLabelError(true);
      // optional: focus the field
      labelRef.current?.focus();
      return;
    }
    if (!imgSrc || lat == null || lng == null) return;

    setBusy(true);
    setNotice(null);
    try {
      const blob = await (await fetch(imgSrc)).blob();
      const form = new FormData();
      form.append("image", blob);
      form.append("lat", String(lat));
      form.append("lng", String(lng));
      form.append("label", label.trim()); // send the text

      const r = await fetch(`${import.meta.env.VITE_API_URL || ""}/map/create-marker`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

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
  }, [imgSrc, lat, lng, label, onUploaded]);

  const retake = () => setImgSrc(null);

  return (
    <div
      className={`no-map-click ${styles.wrap}`}
      onMouseDown={stop}
      onClick={stop}
      onTouchStart={stop}
    >
      {!imgSrc ? (
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/webp"
          videoConstraints={{ facingMode: "environment" }}
          className={styles.frame}
        />
      ) : (
        <img src={imgSrc} alt="preview" className={styles.frame} />
      )}

      {/* NEW: label input */}
      <textarea
        ref={labelRef}
        className={`${styles.input} ${labelError ? styles.inputError : ""}`}
        value={label}
        onChange={(e) => {
          setLabel(e.target.value);
          if (labelError && e.target.value.trim()) setLabelError(false);
        }}
        placeholder={
          labelError
            ? "A short description/location is required"
            : "Add a short description or location…"
        }
        aria-invalid={labelError || undefined}
        rows={2}
      />

      {!imgSrc ? (
        <div className={styles.row}>
          <button
            type="button"
            onMouseDown={stop}
            onClick={capture}
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
            onClick={upload}
            onTouchStart={stop}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            {busy ? "Uploading..." : "Upload"}
          </button>
          <button
            type="button"
            onMouseDown={stop}
            onClick={retake}
            onTouchStart={stop}
            className={`${styles.btn} ${styles.btnGhost}`}
          >
            Retake
          </button>
        </div>
      )}

      {notice && (
        <div
          className={
            notice.type === "success" ? styles.noticeSuccess : styles.noticeError
          }
          role="status"
        >
          {notice.text}
        </div>
      )}
    </div>
  );
};

export default CustomWebcam;
