"use client";

import { Sparkles, Wand2, Eraser, History, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  feeling: string;
  setFeeling: (val: string) => void;
  intensity: number;
  setIntensity: (val: number) => void;
  loading: boolean;
  image: string | null;
  onGenerate: () => void;
  onClear: () => void;
};

export default function ControlPanel({ 
  feeling, setFeeling, intensity, setIntensity, loading, image, onGenerate, onClear 
}: Props) {
  
  const addWord = (word: string) => {
    setFeeling(feeling ? `${feeling}, ${word}` : word);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-neutral-400 text-lg max-w-md leading-relaxed">Translate your intangible emotions into tangible visual art.<br />Describe the sensations, not the emotion.</p>
      </div>

      {/* Controls Container */}
      <div className="space-y-8 bg-neutral-900/30 backdrop-blur-sm p-6 rounded-3xl border border-white/5">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-neutral-300 ml-1" htmlFor="feelingInput">SOMATIC INPUT</label>
          
          {/* Somatic Chips */}
          <div className="flex flex-wrap gap-2 mb-2" role="group" aria-label="Somatic sensation shortcuts">
            {["Heavy", "Spiky", "Hollow", "Burning", "Cloudy", "Shattered", "Blooming", "Racing"].map((word) => (
              <button
                key={word}
                onClick={() => addWord(word)}
                className="px-3 py-1 rounded-full bg-neutral-800/50 border border-neutral-700 text-xs text-neutral-400 hover:bg-purple-500/20 hover:border-purple-500 hover:text-purple-200 transition-all focus:ring-2 focus:ring-purple-500 outline-none"
                aria-label={`Add ${word} sensation`}
              >
                + {word}
              </button>
            ))}
          </div>

          <div className="relative group">
            <textarea
              id="feelingInput"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              placeholder="Use physical or sensory descriptors (e.g. heavy, sharp, hollow)."
              className="w-full bg-neutral-950/50 border border-neutral-800 rounded-2xl p-4 text-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none h-32 leading-relaxed"
            />
            <Wand2 className="absolute bottom-4 right-4 text-neutral-600 group-focus-within:text-purple-500 transition-colors w-5 h-5" />
          </div>
        </div>

        {/* Intensity Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <label className="font-semibold text-neutral-300 ml-1" htmlFor="intensitySlider">AROUSAL LEVEL</label>
            <span className="text-purple-400 font-mono" aria-hidden="true">{intensity}%</span>
          </div>
          <div className="relative h-6 flex items-center">
            <input
              id="intensitySlider"
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-purple-500 z-20 relative focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full"
              aria-label={`Intensity level ${intensity} percent`}
            />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 pointer-events-none z-10" style={{ width: `${intensity}%` }} />
          </div>
          <div className="flex justify-between text-xs text-neutral-500 px-1" aria-hidden="true">
            <span>Subtle</span>
            <span>Overwhelming</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-2">
          <button 
            onClick={onGenerate}
            disabled={loading || !feeling}
            className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] focus:ring-4 focus:ring-purple-500/50 outline-none"
            aria-label="Generate Art"
          >
            {loading ? <><span className="animate-spin text-xl">✺</span>Mapping sensation to visual representation…</> : <><Sparkles className="w-4 h-4" />Visualize Internal State</>}
          </button>
          
          {image && (
            <button 
              onClick={onClear}
              className="px-4 py-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white transition-colors focus:ring-2 focus:ring-white/50 outline-none"
              title="Clear Canvas"
              aria-label="Clear Canvas"
            >
              <Eraser className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div>
        <Link href="/gallery" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group focus:outline-none focus:text-white">
          <History className="w-4 h-4" />
          <span className="group-hover:underline decoration-neutral-700 underline-offset-4">View past journals</span>
          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>
      </div>
    </div>
  );
}