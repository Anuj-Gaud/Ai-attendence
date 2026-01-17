import { useState, useRef, useEffect } from 'react';

const SimpleCameraTest = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  useEffect(() => {
    // Check permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'camera' }).then(result => {
        setPermissionStatus(result.state);
        console.log('Camera permission:', result.state);
      });
    }
  }, []);

  const startSimpleCamera = async () => {
    console.log('=== Starting Simple Camera Test ===');
    setError('');
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      console.log('1. Requesting camera access...');
      
      // Use the simplest possible constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      console.log('2. Camera stream obtained:', stream);
      console.log('3. Video tracks:', stream.getVideoTracks());
      
      if (videoRef.current) {
        console.log('4. Setting video source...');
        videoRef.current.srcObject = stream;
        
        // Simple play without waiting for events
        try {
          await videoRef.current.play();
          console.log('5. Video playing successfully!');
          setIsStreaming(true);
        } catch (playError) {
          console.error('Play error:', playError);
          setError(`Play error: ${playError.message}`);
        }
      }
      
    } catch (err) {
      console.error('Camera error:', err);
      setError(`Camera error: ${err.name} - ${err.message}`);
      
      // Try to get more specific error info
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please click the camera icon in your browser address bar and allow camera access.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is busy. Please close other applications using the camera (like Zoom, Teams, etc.) and try again.');
      }
    }
  };

  const stopCamera = () => {
    console.log('=== Stopping Camera ===');
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => {
        console.log('Stopping track:', track.label);
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  const checkCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available video devices:', videoDevices);
      alert(`Found ${videoDevices.length} camera device(s):\n${videoDevices.map(d => d.label || 'Unknown Camera').join('\n')}`);
    } catch (err) {
      console.error('Error enumerating devices:', err);
      alert('Error checking camera devices: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Simple Camera Test</h1>
      
      {/* Status Info */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>System Status:</h3>
        <p><strong>Permission Status:</strong> {permissionStatus}</p>
        <p><strong>getUserMedia Support:</strong> {navigator.mediaDevices ? 'Yes' : 'No'}</p>
        <p><strong>Browser:</strong> {navigator.userAgent.split(' ')[0]}</p>
        <p><strong>Protocol:</strong> {window.location.protocol}</p>
        <p><strong>Streaming:</strong> {isStreaming ? 'Yes' : 'No'}</p>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#ffebee', 
          border: '1px solid #f44336',
          borderRadius: '8px',
          color: '#d32f2f'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Video Display */}
      <div style={{ 
        marginBottom: '20px', 
        backgroundColor: '#000', 
        borderRadius: '8px', 
        overflow: 'hidden',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            maxWidth: '640px',
            height: 'auto',
            backgroundColor: '#000'
          }}
        />
        {!isStreaming && (
          <div style={{ color: 'white', textAlign: 'center' }}>
            <p>📷 Camera Preview</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>Click "Start Camera" to begin</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={startSimpleCamera}
          disabled={isStreaming}
          style={{
            padding: '12px 24px',
            backgroundColor: isStreaming ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isStreaming ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isStreaming ? 'Camera Running' : 'Start Camera'}
        </button>
        
        <button
          onClick={stopCamera}
          disabled={!isStreaming}
          style={{
            padding: '12px 24px',
            backgroundColor: !isStreaming ? '#ccc' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: !isStreaming ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          Stop Camera
        </button>
        
        <button
          onClick={checkCameraDevices}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Check Devices
        </button>
      </div>

      {/* Instructions */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e3f2fd', 
        border: '1px solid #2196F3',
        borderRadius: '8px'
      }}>
        <h3 style={{ color: '#1976d2', marginTop: 0 }}>Instructions:</h3>
        <ol style={{ color: '#1565c0' }}>
          <li>Click "Check Devices" to see available cameras</li>
          <li>Click "Start Camera" and allow permissions when prompted</li>
          <li>You should see yourself in the video preview</li>
          <li>Check the browser console (F12) for detailed logs</li>
          <li>If it doesn't work, try a different browser or check camera settings</li>
        </ol>
      </div>
    </div>
  );
};

export default SimpleCameraTest;