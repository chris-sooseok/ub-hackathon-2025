import Webcam from "react-webcam";
import { useCallback,useRef,useState } from "react"; // import useRef

const CustomWebcam = ({id}) => {
  const webcamRef = useRef(null); // create a webcam reference
  const [imgSrc, setImgSrc] = useState(null);
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const capture = useCallback(async() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
     formData.append('image', blob, 'image.jpg')
    
      await fetch(`${import.meta.env.VITE_API_URL || ''}/map/send/`+id, {
      method: 'POST',
      body: formData
}).then(await delay(1000)).then(window.location.reload());
    

  }, [webcamRef]);


    
  

  return (
    <div className="container">
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam height={600} width={600} ref={webcamRef} />
      )}
      <div className="btn-container">
        <button onClick={capture}>Capture photo</button>
      </div>
    </div>
  );
};

export default CustomWebcam;

