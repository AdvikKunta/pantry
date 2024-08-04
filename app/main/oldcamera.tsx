// "use client";

// import React, { useEffect, useRef } from "react";

// interface CameraFeedProps {
//   onClose: () => void;
// }

// export function CameraFeed({ onClose }: CameraFeedProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);

//   const constraints: MediaStreamConstraints = {
//     audio: false,
//     video: true,
//   };

//   useEffect(() => {
//     const getVideoStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia(constraints);
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           streamRef.current = stream;
//         }
//       } catch (err) {
//         console.error("Error accessing webcam:", err);
//       }
//     };

//     getVideoStream();

//     return () => {
//       // Cleanup on component unmount
//       stopStream();
//     };
//   }, []);

//   const stopStream = () => {
//     if (streamRef.current) {
//       const tracks = streamRef.current.getTracks();
//       tracks.forEach((track) => track.stop());
//       streamRef.current = null;
//       if (videoRef.current) {
//         videoRef.current.srcObject = null; // Clear the video source
//       }
//     }
//   };

//   const handleCloseCamera = () => {
//     stopStream(); // Stop the stream
//     onClose(); // Notify parent that camera has been closed
//   };

//   return (
//     <div>
//       <video ref={videoRef} autoPlay className="w-full h-auto" />
//       <button onClick={handleCloseCamera}>Close Camera</button>
//     </div>
//   );
// }
