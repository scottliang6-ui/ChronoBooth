import React, { useState } from 'react';
import { EraOption } from '../types';
import { Sparkles, ArrowRight, History, Edit2 } from 'lucide-react';

const ERAS: EraOption[] = [
  {
    id: '1920s',
    label: 'Roaring 20s',
    description: 'Flapper dresses, tuxedos, jazz age glam.',
    promptSuffix: '1920s Roaring Twenties, Art Deco style, flapper fashion or Gatsby tuxedo, black and white vintage photography style',
    color: 'from-yellow-500 to-amber-700'
  },
  {
    id: 'medieval',
    label: 'Medieval Knight',
    description: 'Plate armor, castles, epic fantasy feel.',
    promptSuffix: 'Medieval Europe, wearing intricate shiny plate armor, castle in background, dramatic lighting, oil painting style',
    color: 'from-slate-500 to-slate-800'
  },
  {
    id: 'cyberpunk',
    label: 'Year 2099',
    description: 'Neon lights, cybernetics, futuristic city.',
    promptSuffix: 'Cyberpunk future 2099, neon lights, cybernetic implants, high tech clothing, rainy futuristic city background, cinematic',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'egypt',
    label: 'Ancient Egypt',
    description: 'Pharaohs, gold jewelry, pyramids.',
    promptSuffix: 'Ancient Egypt, wearing royal golden pharaoh attire, pyramids in background, warm desert lighting',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'vikings',
    label: 'Viking Era',
    description: 'Fur cloaks, leather armor, snowy fjords.',
    promptSuffix: 'Viking warrior, fur cloak, leather armor, war paint, snowy fjord background, intense atmosphere',
    color: 'from-teal-700 to-blue-900'
  },
  {
    id: 'victorian',
    label: 'Victorian',
    description: 'Top hats, corsets, steam trains.',
    promptSuffix: 'Victorian Era London, steampunk aesthetics, top hat or corset dress, industrial revolution background',
    color: 'from-red-800 to-amber-900'
  }
];

interface EraSelectorProps {
  imageSrc: string;
  onSelect: (prompt: string, eraLabel: string) => void;
  onRetake: () => void;
}

export const EraSelector: React.FC<EraSelectorProps> = ({ imageSrc, onSelect, onRetake }) => {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handleGenerate = () => {
    if (isCustom && customPrompt.trim()) {
        onSelect(customPrompt, "Custom Time Travel");
    } else if (selectedEra) {
      const era = ERAS.find(e => e.id === selectedEra);
      if (era) {
        onSelect(era.promptSuffix, era.label);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full max-h-[800px] w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {/* Preview Side */}
      <div className="w-full md:w-1/2 relative bg-black flex items-center justify-center p-4">
        <img 
          src={imageSrc} 
          alt="Source" 
          className="max-h-full max-w-full rounded-lg shadow-lg border-2 border-slate-700/50"
        />
        <button 
          onClick={onRetake}
          className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-sm rounded-full hover:bg-black/70 transition"
        >
          ← Retake Photo
        </button>
      </div>

      {/* Controls Side */}
      <div className="w-full md:w-1/2 p-6 flex flex-col bg-slate-900 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="text-blue-400" />
            Select Destination
          </h2>
          <p className="text-slate-400 text-sm mt-1">Where (or when) do you want to go?</p>
        </div>

        <div className="flex gap-2 mb-4 p-1 bg-slate-800 rounded-lg w-fit">
            <button 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!isCustom ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setIsCustom(false)}
            >
                Presets
            </button>
            <button 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${isCustom ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setIsCustom(true)}
            >
                Custom
            </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-6 custom-scrollbar">
            {!isCustom ? (
                ERAS.map((era) => (
                    <button
                    key={era.id}
                    onClick={() => setSelectedEra(era.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2 relative overflow-hidden group ${
                        selectedEra === era.id 
                        ? 'border-blue-500 bg-slate-800' 
                        : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/60'
                    }`}
                    >
                    <div className={`absolute inset-0 bg-gradient-to-r ${era.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative z-10">
                        <div className="font-bold text-white text-lg">{era.label}</div>
                        <div className="text-slate-400 text-xs mt-1">{era.description}</div>
                    </div>
                    {selectedEra === era.id && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                        <Sparkles size={20} className="animate-pulse" />
                        </div>
                    )}
                    </button>
                ))
            ) : (
                <div className="space-y-4">
                    <label className="block text-sm text-slate-400">Describe your era or scenario:</label>
                    <textarea
                        className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                        placeholder="e.g., A space marine on Mars fighting aliens..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                    />
                    <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-xl flex gap-3 items-start">
                        <Edit2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-200">
                            Use generic descriptions of the scene. Gemini will use your photo to seamlessly integrate your face into the description you provide.
                        </p>
                    </div>
                </div>
            )}
        </div>

        <button
          disabled={!isCustom && !selectedEra || (isCustom && !customPrompt.trim())}
          onClick={handleGenerate}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
        >
          <span>Activate Time Machine</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
