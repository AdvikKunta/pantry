// camera.js

import { useRef, useState } from "react";
import { Button } from "@mui/material";
import { PlayArrow, Stop } from "@mui/icons-material";

export const startCamera = (videoRef) => {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    })
    .catch((error) => console.error("Error accessing media devices:", error));
};

export const takePicture = (videoRef, canvasRef, setImage) => {
  if (videoRef.current && canvasRef.current) {
    const context = canvasRef.current.getContext("2d");
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageData = canvasRef.current.toDataURL("image/jpeg");
      setImage(imageData);
    }
  }
};

export const stopCamera = (videoRef) => {
  if (videoRef.current && videoRef.current.srcObject) {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  }
};

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  return (
    <div>
      <div>
        <video ref={videoRef} width={400} height={300} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <Button
          variant="outlined"
          sx={{ borderRadius: "30px" }}
          onClick={() => startCamera(videoRef)}
        >
          Start Camera
        </Button>
        <Button
          variant="outlined"
          onClick={() => takePicture(videoRef, canvasRef, setImage)}
        >
          Take Picture
        </Button>
        <Button variant="outlined" onClick={() => stopCamera(videoRef)}>
          Stop Camera
        </Button>
      </div>

      {image && (
        <div>
          <img src={image} alt="Captured" width={400} height={300} />
        </div>
      )}
    </div>
  );
};

export default Camera;
