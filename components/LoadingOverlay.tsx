import React from 'react';

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-32 h-32 border-4 border-blue-500/30 rounded-full animate-[spin_3s_linear_infinite]" />
        {/* Middle Ring */}
        <div className="absolute inset-0 w-24 h-24 m-auto border-4 border-purple-500/50 border-t-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]" />
        {/* Inner Ring */}
        <div className="absolute inset-0 w-16 h-16 m-auto border-4 border-white/80 border-b-transparent rounded-full animate-[spin_1s_linear_infinite]" />
      </div>
      
      <h3 className="mt-8 text-2xl font-bold text-white animate-pulse">
        Warping Time...
      </h3>
      <p className="text-slate-400 mt-2 text-sm">Constructing temporal reality field</p>
    </div>
  );
};
