import React from 'react';
import { Download, RefreshCw, Camera } from 'lucide-react';
import { GenerationResult } from '../types';

interface ResultViewProps {
  result: GenerationResult;
  onReset: () => void;
  onTryAnotherEra: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset, onTryAnotherEra }) => {
  
  const handleDownload = () => {
    if (result.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `chronobooth-${result.era.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Arrival: {result.era}
        </h2>
      </div>

      <div className="flex-1 relative group flex flex-col items-center justify-center">
        <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-slate-700 bg-black max-h-[60vh]">
           {/* Comparison Effect - Could be complex, keeping simple for now: show Result */}
           <img 
             src={result.imageUrl || ''} 
             alt="Generated Time Travel" 
             className="max-w-full max-h-[60vh] object-contain"
           />
        </div>
        
        <p className="mt-4 text-slate-400 text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
          Time jump successful
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 transition border border-slate-700"
        >
          <Camera size={20} />
          New Photo
        </button>
        
        <button
          onClick={onTryAnotherEra}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 transition border border-slate-700"
        >
          <RefreshCw size={20} />
          Try New Era
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition shadow-lg shadow-blue-900/30"
        >
          <Download size={20} />
          Save Image
        </button>
      </div>
    </div>
  );
};
