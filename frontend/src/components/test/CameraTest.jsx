import { useState, useRef, useEffect } from 'react';
import { Camera, StopCircle, AlertCircle, CheckCircle, RefreshCw, Monitor } from 'lucide-react';

const CameraTest = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState('');
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    // Get available video devices
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0 && !selectedDevice) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      })
      .catch(err => console.error('Error enumerating devices:', err));

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      console.log('Starting camera with device:', selectedDevice);
      
      const constraints = {
        video: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          width: { min: 320, ideal: 640, max: 1280 },
          height: { min: 240, ideal: 480, max: 720 },
          facingMode: selectedDevice ? undefined : 'user'
        },
        audio: false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        
        videoRef.current.onloadedmetadata = () => {
          const video = videoRef.current;
          setVideoInfo({
            width: video.videoWidth,
            height: video.videoHeight,
            aspectRatio: (video.videoWidth / video.videoHeight).toFixed(2)
          });
          console.log('Video loaded:', video.videoWidth, 'x', video.videoHeight);
        };
        
        videoRef.current.oncanplay = () => {
          videoRef.current.play().then(() => {
            setCameraActive(true);
            console.log('Camera started successfully');
          }).catch(err => {
            console.error('Error playing video:', err);
            setError('Error starting camera playback');
          });
        };

        videoRef.current.onerror = (err) => {
          console.error('Video error:', err);
          setError('Video playback error');
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMessage = `Camera error: ${err.name} - ${err.message}`;
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is being used by another application.';
      }
      
      setError(errorMessage);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.label);
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setVideoInfo(null);
  };

  const testCameraAccess = async () => {
    try {
      console.log('Testing basic camera access...');
      const testStream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera test successful:', testStream);
      testStream.getTracks().forEach(track => track.stop());
      alert('Camera access test successful! Camera is working.');
    } catch (error) {
      console.error('Camera test failed:', error);
      alert(`Camera test failed: ${error.name} - ${error.message}`);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && cameraActive) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current frame (unmirrored)
      context.save();
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0);
      context.restore();
      
      // Convert to blob and download
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `camera-test-${Date.now()}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.8);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Camera className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Camera Test & Debug</h1>
          </div>

          {/* Device Selection */}
          {devices.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Camera Device:
              </label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {devices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error:</span>
              </div>
              <p className="text-red-600 mt-1 text-sm">{error}</p>
            </div>
          )}

          {/* Video Info */}
          {videoInfo && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Camera Active</span>
              </div>
              <div className="text-sm text-green-600 space-y-1">
                <div>Resolution: {videoInfo.width} × {videoInfo.height}</div>
                <div>Aspect Ratio: {videoInfo.aspectRatio}</div>
              </div>
            </div>
          )}

          {/* Video Display */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6" style={{ minHeight: '360px' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                transform: 'scaleX(-1)', // Mirror for better UX
                backgroundColor: '#1f2937',
                minHeight: '360px'
              }}
              onLoadedData={() => console.log('Video data loaded')}
              onPlay={() => console.log('Video started playing')}
              onError={(e) => console.error('Video error:', e)}
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center text-white">
                  <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Camera Preview</p>
                  <p className="text-sm opacity-75 mt-2">Click "Start Camera" to begin</p>
                  <button
                    onClick={testCameraAccess}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Test Camera Access
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-6">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                <Camera className="w-5 h-5" />
                Start Camera
              </button>
            ) : (
              <>
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Camera className="w-5 h-5" />
                  Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <StopCircle className="w-5 h-5" />
                  Stop Camera
                </button>
              </>
            )}
          </div>

          {/* Debug Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Debug Information:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Available Devices: {devices.length}</div>
              <div>Selected Device: {selectedDevice ? selectedDevice.slice(0, 20) + '...' : 'None'}</div>
              <div>Stream Active: {stream ? 'Yes' : 'No'}</div>
              <div>Video Playing: {cameraActive ? 'Yes' : 'No'}</div>
              <div>Browser: {navigator.userAgent.split(' ')[0]}</div>
              <div>HTTPS: {location.protocol === 'https:' ? 'Yes' : 'No'}</div>
              <div>MediaDevices Support: {navigator.mediaDevices ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Troubleshooting Tips:</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Make sure you allow camera permissions when prompted</li>
              <li>• Close other applications that might be using the camera</li>
              <li>• Try refreshing the page if camera doesn't start</li>
              <li>• Check if your browser supports camera access (Chrome, Firefox, Safari)</li>
              <li>• For HTTPS sites, camera access is more reliable</li>
              <li>• If you see a black screen, try selecting a different camera device</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraTest;