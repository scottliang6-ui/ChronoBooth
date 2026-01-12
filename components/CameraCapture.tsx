import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, SwitchCamera } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = useCallback(async () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1080 } // Square aspect preference
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please ensure permissions are granted.");
      setIsStreaming(false);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Create a square crop
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;
        
        // Calculate center crop
        const xOffset = (video.videoWidth - size) / 2;
        const yOffset = (video.videoHeight - size) / 2;

        // Draw flipped if user facing
        if (facingMode === 'user') {
            context.translate(size, 0);
            context.scale(-1, 1);
        }

        context.drawImage(video, xOffset, yOffset, size, size, 0, 0, size, size);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {error ? (
        <div className="text-red-400 p-6 text-center">
          <p className="mb-4">{error}</p>
          <button 
            onClick={startCamera}
            className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            playsInline 
            muted 
            autoPlay 
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center">
             <div className="w-12"></div> {/* Spacer for centering */}
             
             <button 
              onClick={takePhoto}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all duration-200 flex items-center justify-center group shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              aria-label="Take photo"
            >
              <div className="w-16 h-16 bg-white rounded-full group-hover:scale-90 transition-transform" />
            </button>

            <button 
              onClick={toggleCamera}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800/50 text-white backdrop-blur-md hover:bg-slate-700/50 transition"
            >
              <SwitchCamera size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
