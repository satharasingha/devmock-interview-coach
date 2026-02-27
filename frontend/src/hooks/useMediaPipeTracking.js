import { useEffect, useRef, useState } from 'react';
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

export const useMediaPipeTracking = (videoRef, canvasRef, isActive) => {
  const [eyeContact, setEyeContact] = useState(100);
  const [posture, setPosture] = useState(100);
  const [eyeContactHistory, setEyeContactHistory] = useState([]);
  const [postureHistory, setPostureHistory] = useState([]);
  const [eyeContactWarning, setEyeContactWarning] = useState(false);
  const [postureWarning, setPostureWarning] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  
  const cameraRef = useRef(null);
  const lastEyeContactUpdate = useRef(Date.now());
  const lastPostureUpdate = useRef(Date.now());

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !isActive) return;

    const faceDetection = new FaceDetection({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
      }
    });

    faceDetection.setOptions({
      selfieMode: true,
      model: 'short',
      minDetectionConfidence: 0.5
    });

    faceDetection.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceDetection.send({ image: videoRef.current });
      },
      width: 640,
      height: 480
    });

    camera.start();
    cameraRef.current = camera;

    return () => {
      camera.stop();
      faceDetection.close();
    };
  }, [isActive]);

  const onResults = (results) => {
    const canvasCtx = canvasRef.current?.getContext('2d');
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.detections.length > 0) {
      setFaceDetected(true);
      
      // Draw face detection
      for (const detection of results.detections) {
        drawConnectors(canvasCtx, detection.landmarks, [
          [0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,8], [8,9], [9,10],
          [10,11], [11,12], [12,13], [13,14], [14,15], [15,16], [16,17], [17,18],
          [18,19], [19,20], [20,21], [21,22], [22,23], [23,24]
        ], { color: '#00ff00', lineWidth: 2 });
        
        drawLandmarks(canvasCtx, detection.landmarks, { color: '#ff0000', radius: 2 });
      }

      // Calculate eye contact based on face orientation
      calculateEyeContact(results.detections[0]);
      
      // Calculate posture based on face position
      calculatePosture(results.detections[0]);
    } else {
      setFaceDetected(false);
      // Gradually decrease scores when no face detected
      setEyeContact(prev => Math.max(0, prev - 2));
      setPosture(prev => Math.max(0, prev - 2));
    }

    canvasCtx.restore();
  };

  const calculateEyeContact = (detection) => {
    const now = Date.now();
    if (now - lastEyeContactUpdate.current < 100) return; // Update every 100ms
    
    const landmarks = detection.landmarks;
    
    // Get eye positions (approximate indices based on MediaPipe face detection)
    const leftEye = landmarks[0]; // Left eye region
    const rightEye = landmarks[1]; // Right eye region
    const nose = landmarks[2]; // Nose tip
    
    // Calculate face orientation based on eye and nose positions
    const eyeLevel = (leftEye.y + rightEye.y) / 2;
    const noseOffset = Math.abs(nose.x - 0.5); // How centered the face is
    
    // Eye contact score based on face centering and level
    let score = 100;
    
    // Reduce score if face is not centered
    if (noseOffset > 0.1) {
      score -= (noseOffset - 0.1) * 200;
    }
    
    // Reduce score if head is tilted
    const eyeTilt = Math.abs(leftEye.y - rightEye.y);
    if (eyeTilt > 0.05) {
      score -= eyeTilt * 300;
    }
    
    score = Math.min(100, Math.max(0, Math.round(score)));
    
    setEyeContact(score);
    setEyeContactHistory(prev => {
      const newHistory = [...prev, score];
      if (newHistory.length > 30) newHistory.shift();
      return newHistory;
    });
    
    if (score < 60) {
      setEyeContactWarning(true);
      setTimeout(() => setEyeContactWarning(false), 1000);
    }
    
    lastEyeContactUpdate.current = now;
  };

  const calculatePosture = (detection) => {
    const now = Date.now();
    if (now - lastPostureUpdate.current < 100) return; // Update every 100ms
    
    const landmarks = detection.landmarks;
    
    // Get face position
    const faceTop = landmarks[3]; // Top of face
    const faceBottom = landmarks[4]; // Bottom of face
    const faceWidth = Math.abs(landmarks[0].x - landmarks[1].x);
    
    // Calculate face size (indicates distance from camera)
    const faceHeight = Math.abs(faceTop.y - faceBottom.y);
    
    // Good posture: face should be at a reasonable distance and centered
    let score = 100;
    
    // Reduce score if too close or too far
    if (faceHeight < 0.15 || faceHeight > 0.35) {
      score -= 20;
    }
    
    // Reduce score if face is too high or low in frame
    const faceCenterY = (faceTop.y + faceBottom.y) / 2;
    if (faceCenterY < 0.3 || faceCenterY > 0.7) {
      score -= 20;
    }
    
    score = Math.min(100, Math.max(0, Math.round(score)));
    
    setPosture(score);
    setPostureHistory(prev => {
      const newHistory = [...prev, score];
      if (newHistory.length > 30) newHistory.shift();
      return newHistory;
    });
    
    if (score < 60) {
      setPostureWarning(true);
      setTimeout(() => setPostureWarning(false), 1000);
    }
    
    lastPostureUpdate.current = now;
  };

  return {
    eyeContact,
    posture,
    eyeContactHistory,
    postureHistory,
    eyeContactWarning,
    postureWarning,
    faceDetected
  };
};