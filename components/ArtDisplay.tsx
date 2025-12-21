"use client";

import { Save, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

type Props = {
  loading: boolean;
  image: string | null;
  insight: string;
  saving: boolean;
  saved: boolean;
  onSave: () => void;
  onShare: () => void;
};

export default function ArtDisplay({ loading, image, insight, saving, saved, onSave, onShare }: Props) {
  // New state to track if the specific image URL has finished downloading
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reset the loaded state whenever we get a BRAND NEW image URL
  useEffect(() => {
    if (image) {
      setImgLoaded(false);
    }
  }, [image]);

  // The simplified logic: We are "busy" if the API is loading OR if the image exists but hasn't finished downloading
  const showSpinner = loading || (image && !imgLoaded);

  // We only show the final results (Image + Buttons) when the API is done AND the image is loaded
  const showResult = image && !loading && imgLoaded;

  return (
    <div className="relative flex flex-col items-center justify-center lg:h-[80vh]">
      
      {/* Canvas Logic */}
      <div className="relative w-full aspect-square max-w-[600px] bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden group">
        
        {/* State 1: Canvas Empty (Waiting for user) */}
        {!image && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-700">
            <div className="w-full h-full absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }} />
            <p className="z-10 text-sm font-medium tracking-widest uppercase opacity-50">Awaiting input</p>
          </div>
        )}

        {/* State 2: Loading Spinner (Shows during API call AND Image Download) */}
        {showSpinner && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-2/3 h-2/3 rounded-full blur-[80px] bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600"
            />
            <div className="z-10 text-white/80 font-mono text-sm tracking-widest animate-pulse">INTERPRETING EMOTION...</div>
          </div>
        )}

        {/* State 3: The Image (Always rendered if exists, but hidden until loaded) */}
        {image && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: imgLoaded ? 1 : 0 }} 
            transition={{ duration: 0.8 }} 
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={image} 
              alt="Generated Art" 
              className="w-full h-full object-cover"
              // THIS IS THE SECRET SAUCE:
              onLoad={() => setImgLoaded(true)}
            />
            
            {/* Texture Overlay (Only visible when image is) */}
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          </motion.div>
        )}

        <div className="absolute inset-0 border-[1px] border-white/10 rounded-3xl pointer-events-none z-30" />
        <div className="absolute inset-0 border-[8px] border-black/20 rounded-3xl pointer-events-none z-30" />
      </div>

      {/* Insight Card (Only show when fully ready) */}
      <AnimatePresence>
        {showResult && insight && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl backdrop-blur-md max-w-md w-full text-center">
              <p className="text-purple-200 text-sm font-medium italic">&quot;{insight}&quot;</p>
            </motion.div>
        )}
      </AnimatePresence>
      
      {/* Actions (Only show when fully ready) */}
      <AnimatePresence>
        {showResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-6 flex justify-center gap-3">
            <button 
              onClick={onSave}
              disabled={saving || saved}
              className={`px-6 py-3 rounded-full font-medium shadow-xl backdrop-blur-md border transition-all flex items-center gap-2 ${saved ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-black/60 border-neutral-700 text-white hover:bg-black/80 hover:border-purple-500/50'}`}
              aria-label={saved ? "Saved" : "Save to Journal"}
            >
              {saving ? <span className="animate-pulse">Saving...</span> : saved ? <>✓ Saved to Gallery</> : <><Save className="w-4 h-4" />Add to Emotional Record</>}
            </button>
            {/* <button onClick={onShare} className="px-4 py-3 rounded-full bg-black/60 border border-neutral-700 text-white hover:bg-black/80 hover:border-purple-500/50 transition-all backdrop-blur-md" aria-label="Share artwork">
              <Share2 className="w-4 h-4" />
            </button> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}