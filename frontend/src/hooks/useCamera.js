import { useState, useCallback, useRef } from 'react';
import { cameraService } from '../services/camera';

export const useCamera = () => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await cameraService.requestPermission();
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      cameraService.stopStream(stream);
      setStream(null);
    }
  }, [stream]);

  const captureFrame = useCallback(async () => {
    if (videoRef.current) {
      return await cameraService.captureFrame(videoRef.current);
    }
    return null;
  }, []);

  return { stream, error, videoRef, startCamera, stopCamera, captureFrame };
};

export default useCamera;
