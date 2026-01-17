class CameraService {
  async requestCameraAccess() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        }
      });
      
      return stream;
    } catch (error) {
      throw new Error(this.getCameraErrorMessage(error));
    }
  }

  getCameraErrorMessage(error) {
    if (error.name === 'NotAllowedError') {
      return 'Camera permission denied. Please allow camera access.';
    } else if (error.name === 'NotFoundError') {
      return 'No camera found on this device.';
    } else if (error.name === 'NotReadableError') {
      return 'Camera is already in use by another application.';
    } else {
      return 'Unable to access camera.';
    }
  }

  async checkCameraPermission() {
    if (!navigator.permissions) {
      return 'unknown';
    }

    try {
      const result = await navigator.permissions.query({ name: 'camera' });
      return result.state;
    } catch (error) {
      return 'unknown';
    }
  }

  stopStream(stream) {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  captureFrame(videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  async captureMultipleFrames(videoElement, count = 10, interval = 300) {
    const frames = [];
    
    for (let i = 0; i < count; i++) {
      const frame = this.captureFrame(videoElement);
      frames.push(frame);
      
      if (i < count - 1) {
        await this.sleep(interval);
      }
    }
    
    return frames;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async enumerateCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Error enumerating cameras:', error);
      return [];
    }
  }

  async switchCamera(deviceId) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      return stream;
    } catch (error) {
      throw new Error('Failed to switch camera');
    }
  }
}

export default new CameraService();