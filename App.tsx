import React, { useState } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { EraSelector } from './components/EraSelector';
import { ResultView } from './components/ResultView';
import { LoadingOverlay } from './components/LoadingOverlay';
import { generateTimeTravelImage } from './services/geminiService';
import { AppState, GenerationResult } from './types';
import { Clock } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.CAMERA);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = (imageData: string) => {
    setSourceImage(imageData);
    setAppState(AppState.PREVIEW);
  };

  const handleEraSelection = async (promptSuffix: string, eraLabel: string) => {
    if (!sourceImage) return;

    setAppState(AppState.PROCESSING);
    setError(null);

    try {
      const generatedImage = await generateTimeTravelImage(sourceImage, promptSuffix);
      
      setGenerationResult({
        originalUrl: sourceImage,
        imageUrl: generatedImage,
        era: eraLabel
      });
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError("The time machine malfunctioned (API Error). Please try again.");
      setAppState(AppState.PREVIEW);
    }
  };

  const resetApp = () => {
    setSourceImage(null);
    setGenerationResult(null);
    setAppState(AppState.CAMERA);
  };

  const returnToPreview = () => {
    setAppState(AppState.PREVIEW);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="py-4 px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            ChronoBooth
          </h1>
        </div>
        <div className="hidden sm:block text-xs text-slate-500 border border-slate-800 px-3 py-1 rounded-full">
            Powered by Gemini 2.5 Flash
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4 md:p-8">
        {appState === AppState.PROCESSING && <LoadingOverlay />}

        {/* Error Toast */}
        {error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-xl backdrop-blur-sm animate-bounce">
                {error}
            </div>
        )}

        {/* View Switching */}
        <div className="w-full h-full max-w-5xl flex flex-col items-center justify-center">
            
            {appState === AppState.CAMERA && (
                <div className="w-full max-w-md aspect-[3/4] md:aspect-square relative">
                    <CameraCapture onCapture={handleCapture} />
                    <p className="text-center mt-4 text-slate-400 text-sm">
                        Align your face in the center and snap a selfie.
                    </p>
                </div>
            )}

            {appState === AppState.PREVIEW && sourceImage && (
                <EraSelector 
                    imageSrc={sourceImage} 
                    onSelect={handleEraSelection} 
                    onRetake={resetApp} 
                />
            )}

            {appState === AppState.RESULT && generationResult && (
                <ResultView 
                    result={generationResult} 
                    onReset={resetApp}
                    onTryAnotherEra={returnToPreview}
                />
            )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-slate-600 text-xs shrink-0">
        &copy; {new Date().getFullYear()} ChronoBooth. Travel safely.
      </footer>
    </div>
  );
};

export default App;
