"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Save, 
  History, 
  Wand2, 
  Eraser, 
  Share2,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase"; 
import Link from "next/link"; 

export default function EideticStudio() {
  // --- STATE ---
  const [feeling, setFeeling] = useState("");
  const [intensity, setIntensity] = useState(50);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // --- HELPER: SOUND EFFECT ---
  // ✅ FIX: Defined at the top so it can be used anywhere
  const playSuccessSound = () => {
    const audio = new Audio("https://cdn.freesound.org/previews/351/351877_5946114-lq.mp3");
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play failed (user interaction needed first)"));
  };

  // --- LOGIC: GENERATE (REAL AI) ---
  const generateArt = async () => {
    if (!feeling) return;
    setLoading(true);
    setSaved(false);
    setImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeling, intensity }),
      });

      const data = await res.json();
      
      if (data.success) {
        setImage(data.image);
        playSuccessSound(); // ✅ Works now!
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate art. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC: SAVE (REAL DATABASE) ---
  const saveToGallery = async () => {
    if (!image || !feeling) return;
    setSaving(true);

    try {
      // 1. Convert Base64 to Blob
      const base64Data = image.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'image/png' });

      // 2. Upload to Supabase Storage
      // Create a clean filename
      const cleanFeeling = feeling.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30);
      const filename = `${Date.now()}-${cleanFeeling}.png`;
      
      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filename, blob, { contentType: 'image/png' });

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(filename);

      // 4. Save metadata to Database
      const { error: dbError } = await supabase
        .from('gallery')
        .insert([{ feeling, intensity, image_url: publicUrl }]);

      if (dbError) throw dbError;

      // Success State
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

    } catch (error: any) {
      console.error("Save error:", error);
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const clearCanvas = () => {
    setImage(null);
    setFeeling("");
    setIntensity(50);
    setSaved(false);
  };

  // --- LOGIC: SHARE ---
const handleShare = async () => {
    if (!image) return;

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], `eidetic-${feeling}.png`, { type: "image/png" });

      // 1. Try Native Sharing (Mobile)
      // "navigator.share" works best on phones
      if (navigator.share) {
        await navigator.share({
          title: 'My Eidetic Journal',
          text: `I visualized my feeling of "${feeling}" using Eidetic.`,
          files: [file],
        });
        return;
      } 
      
      // 2. Try Clipboard API (Modern Desktop)
      // We explicitly check if 'navigator.clipboard' exists first!
      if (navigator.clipboard && navigator.clipboard.writeText) {
         await navigator.clipboard.writeText(window.location.href);
         alert("Link copied to clipboard!");
         return;
      }

      // 3. Ultimate Fallback (Old Browsers / Non-Secure Contexts)
      // If everything else fails, just tell the user the link.
      alert("Sharing is not available. Your link: " + window.location.href);

    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      
      {/* --- DYNAMIC BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[128px] transition-all duration-700"
          style={{ opacity: 0.3 + (intensity / 200), transform: `scale(${1 + intensity/100})` }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/30 rounded-full blur-[128px] transition-all duration-700"
          style={{ opacity: 0.3 + (intensity / 200), transform: `scale(${1 + intensity/100})` }}
        />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 z-10 items-center">
        
        {/* --- LEFT COLUMN: CONTROLS --- */}
        <div className="space-y-10">
          
          {/* Header */}
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/50 border border-neutral-800 text-xs font-medium text-purple-400 mb-2"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Art Generator</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500">
              EIDETIC
            </h1>
            <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
              Translate your intangible emotions into tangible visual art. 
              <br />What are you feeling right now?
            </p>
          </div>

        {/* Input Form */}
          <div className="space-y-8 bg-neutral-900/30 backdrop-blur-sm p-6 rounded-3xl border border-white/5">
            
            {/* 1. Feeling Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-neutral-300 ml-1">YOUR EMOTION</label>
              
              {/* SOMATIC CHIPS (NEW FEATURE) */}
              <div className="flex flex-wrap gap-2 mb-2">
                {["Heavy", "Spiky", "Hollow", "Burning", "Cloudy", "Shattered", "Blooming", "Racing"].map((word) => (
                  <button
                    key={word}
                    onClick={() => setFeeling(prev => prev ? `${prev}, ${word}` : word)}
                    className="px-3 py-1 rounded-full bg-neutral-800/50 border border-neutral-700 text-xs text-neutral-400 hover:bg-purple-500/20 hover:border-purple-500 hover:text-purple-200 transition-all"
                  >
                    + {word}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <textarea
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  placeholder="Describe it... or click the words above if you can't find the words."
                  className="w-full bg-neutral-950/50 border border-neutral-800 rounded-2xl p-4 text-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none h-32 leading-relaxed"
                />
                <Wand2 className="absolute bottom-4 right-4 text-neutral-600 group-focus-within:text-purple-500 transition-colors w-5 h-5" />
              </div>
            </div>

            {/* 2. Intensity Slider (Keep existing code) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-neutral-300 ml-1">INTENSITY</label>
                <span className="text-purple-400 font-mono">{intensity}%</span>
              </div>
              
              <div className="relative h-6 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-purple-500 z-20 relative"
                />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 pointer-events-none z-10"
                  style={{ width: `${intensity}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-neutral-500 px-1">
                <span>Subtle</span>
                <span>Overwhelming</span>
              </div>
            </div>

            {/* Action Buttons (Keep existing code) */}
            <div className="flex gap-4 pt-2">
              <button 
                onClick={generateArt}
                disabled={loading || !feeling}
                className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]"
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-xl">✺</span> Dreaming...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate Art
                  </>
                )}
              </button>
              
              {image && (
                <button 
                  onClick={clearCanvas}
                  className="px-4 py-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white transition-colors"
                  title="Clear Canvas"
                >
                  <Eraser className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Footer Link */}
          <div>
              <Link href="/gallery" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group">
                <History className="w-4 h-4" />
                <span className="group-hover:underline decoration-neutral-700 underline-offset-4">View past journals</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>
          </div>
        </div>

        {/* --- RIGHT COLUMN: CANVAS --- */}
        <div className="relative flex items-center justify-center lg:h-[80vh]">
          <ArtCanvas loading={loading} image={image} intensity={intensity} />
          
          {/* Save/Share Floating Actions */}
          <AnimatePresence>
            {image && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -bottom-6 lg:bottom-12 left-0 right-0 flex justify-center gap-3"
              >
                <button 
                  onClick={saveToGallery}
                  disabled={saving || saved}
                  className={`
                    px-6 py-3 rounded-full font-medium shadow-xl backdrop-blur-md border transition-all flex items-center gap-2
                    ${saved 
                      ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                      : 'bg-black/60 border-neutral-700 text-white hover:bg-black/80 hover:border-purple-500/50'
                    }
                  `}
                >
                  {saving ? (
                    <span className="animate-pulse">Saving...</span>
                  ) : saved ? (
                    <>✓ Saved to Gallery</>
                  ) : (
                    <><Save className="w-4 h-4" /> Save to Journal</>
                  )}
                </button>

                <button 
                  onClick={handleShare}
                  className="px-4 py-3 rounded-full bg-black/60 border border-neutral-700 text-white hover:bg-black/80 hover:border-purple-500/50 transition-all backdrop-blur-md"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}

// --- SUB-COMPONENT: ART CANVAS ---
function ArtCanvas({ loading, image, intensity }: { loading: boolean; image: string | null; intensity: number }) {
  return (
    <div className="relative w-full aspect-square max-w-[600px] bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden group">
      
      {/* 1. Empty State (The "Paper" Texture) */}
      {!image && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-700">
          <div className="w-full h-full absolute inset-0 opacity-10" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }} 
          />
          <p className="z-10 text-sm font-medium tracking-widest uppercase opacity-50">Canvas Ready</p>
        </div>
      )}

      {/* 2. Loading State (Generative Animation) */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 180],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-2/3 h-2/3 rounded-full blur-[80px] bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600"
          />
          <div className="z-10 text-white/80 font-mono text-sm tracking-widest animate-pulse">
            INTERPRETING EMOTION...
          </div>
        </div>
      )}

      {/* 3. Result Image */}
      <AnimatePresence>
        {image && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={image} 
              alt="Generated Art" 
              className="w-full h-full object-cover"
            />
            
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Frame Border Effect */}
      <div className="absolute inset-0 border-[1px] border-white/10 rounded-3xl pointer-events-none" />
      <div className="absolute inset-0 border-[8px] border-black/20 rounded-3xl pointer-events-none" />
    </div>
  );
}