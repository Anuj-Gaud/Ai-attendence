import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Shield, CheckCircle, Fingerprint, 
  CreditCard, Zap, RefreshCw, XCircle 
} from 'lucide-react';
import Header from '../common/Header';
import api from '../../services/api';

const SecureAttendance = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [hwStatus, setHwStatus] = useState('idle'); // idle, scanning, success, error
  const [user, setUser] = useState(null);

  // Get user data on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // CLEANUP: Always kill camera when leaving component
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // --- STEP 1 & 2: CAMERA LOGIC ---
  const startCamera = async () => {
    try {
      stopCamera(); // Reset
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // The Fix: Explicitly wait for metadata and play
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current.play();
            setCameraActive(true);
          } catch (e) {
            console.error("Autoplay blocked:", e);
          }
        };
      }
    } catch (err) {
      alert("Camera Error: Please allow permissions in browser settings.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Mirror the capture to match what user sees
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    
    const base64Image = canvas.toDataURL('image/jpeg');
    verifyFace(base64Image);
  };

  const verifyFace = async (img) => {
    setIsProcessing(true);
    try {
      // In production, send 'img' to your Python/AI backend
      await new Promise(r => setTimeout(r, 1500)); 
      stopCamera();
      setCurrentStep(3); // Move to Fingerprint/Hardware
    } catch (err) {
      alert("Face verification failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- STEP 3: HARDWARE LOGIC ---
  // This function tells your Express backend to "start listening" for the ESP32
  const initHardwareScan = async () => {
    setIsProcessing(true);
    setHwStatus('scanning');
    
    try {
      // For now, simulate hardware scan since backend endpoint doesn't exist yet
      // TODO: Implement actual hardware communication
      await new Promise(r => setTimeout(r, 3000));
      
      // When you implement the backend endpoint, uncomment this:
      // const response = await api.post('/hardware/trigger-scan', { type: 'fingerprint' });
      // if (response.data.success) {
        setHwStatus('success');
        setTimeout(() => setCurrentStep(4), 1000);
      // }
    } catch (err) {
      setHwStatus('error');
      console.error("Hardware communication error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    // Navigate based on user role
    const role = user?.role || 'student';
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-4 max-w-md mx-auto pt-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          
          {/* Progress Bar */}
          <div className="flex p-6 bg-slate-50 border-b border-gray-100">
             {[1, 2, 3, 4].map(num => (
               <div key={num} className="flex-1 flex items-center">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                   {num}
                 </div>
                 {num < 4 && <div className={`flex-1 h-1 ${currentStep > num ? 'bg-blue-600' : 'bg-gray-200'}`} />}
               </div>
             ))}
          </div>

          <div className="p-8">
            {/* FACE SCAN STEP */}
            {currentStep <= 2 && (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Face Enrollment</h2>
                <div className="relative bg-black rounded-xl aspect-square overflow-hidden shadow-inner border-4 border-gray-100">
                  <video ref={videoRef} playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {!cameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900/80">
                      <Camera className="w-12 h-12 mb-4 opacity-50" />
                      <button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-bold transition">
                        Enable Camera
                      </button>
                    </div>
                  )}

                  {cameraActive && (
                    <div className="absolute inset-0 border-[40px] border-black/20 pointer-events-none">
                      <div className="w-full h-full border-2 border-white/50 rounded-[40%]" />
                    </div>
                  )}
                </div>

                <button 
                  onClick={capturePhoto} 
                  disabled={!cameraActive || isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  {isProcessing ? <RefreshCw className="animate-spin" /> : <Zap />}
                  Capture & Verify
                </button>
              </div>
            )}

            {/* FINGERPRINT / HARDWARE STEP */}
            {currentStep === 3 && (
              <div className="text-center space-y-8 py-4">
                <div className="relative inline-block">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${hwStatus === 'scanning' ? 'border-blue-500 animate-pulse' : hwStatus === 'success' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100'}`}>
                    <Fingerprint className={`w-16 h-16 ${hwStatus === 'scanning' ? 'text-blue-500' : hwStatus === 'success' ? 'text-emerald-500' : 'text-gray-300'}`} />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Hardware Enrollment</h2>
                  <p className="text-gray-500 mt-2">
                    {hwStatus === 'scanning' ? "Please place finger on scanner..." : "Initialize hardware connection to begin"}
                  </p>
                </div>

                <button 
                  onClick={initHardwareScan}
                  disabled={isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  {isProcessing ? <RefreshCw className="animate-spin" /> : <Fingerprint />}
                  Start Hardware Scan
                </button>
              </div>
            )}

            {/* SUCCESS STEP */}
            {currentStep === 4 && (
              <div className="text-center space-y-6 py-10">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">All Set!</h2>
                <p className="text-gray-500">Your multi-factor profile is now registered.</p>
                <button 
                  onClick={handleComplete} 
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureAttendance;