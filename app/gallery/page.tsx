"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Re-connected Supabase
import Link from "next/link";
import { 
  X, 
  Search, 
  Calendar, 
  Activity, 
  Download, 
  Maximize2, 
  ArrowLeft,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
type ArtItem = {
  id: number;
  feeling: string;
  intensity: number;
  image_url: string;
  created_at: string;
};

export default function Gallery() {
  const [artworks, setArtworks] = useState<ArtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArt, setSelectedArt] = useState<ArtItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- REAL DATA FETCHING ---
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setArtworks(data || []);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        // Keep a small fake delay so users can see your beautiful skeleton loader
        setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchGallery();
  }, []);

  // Filter Logic
  const filteredArtworks = artworks.filter((art) =>
    art.feeling.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30">
      
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 mb-2">
              Emotional Journey
            </h1>
            <p className="text-neutral-400">A visual archive of your inner landscape.</p>
          </div>
          
          <div className="flex items-center gap-4">
             {/* This is now a real Link back to home */}
             <Link href="/" className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700 transition-all text-sm font-medium">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Studio
            </Link>
          </div>
        </header>

        {/* --- CONTROLS --- */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 sticky top-4 z-30">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input 
              type="text"
              placeholder="Search by emotion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-neutral-900/80 backdrop-blur-md border border-neutral-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-neutral-600"
            />
          </div>
        </div>

        {/* --- GALLERY GRID --- */}
        {loading ? (
          <GallerySkeleton />
        ) : filteredArtworks.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredArtworks.map((art) => (
                <ArtCard 
                  key={art.id} 
                  art={art} 
                  onClick={() => setSelectedArt(art)} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {selectedArt && (
          <Lightbox art={selectedArt} onClose={() => setSelectedArt(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ArtCard({ art, onClick }: { art: ArtItem; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-900/10 cursor-pointer transition-all duration-300"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="aspect-[4/5] relative overflow-hidden bg-neutral-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={art.image_url} 
          alt={art.feeling} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="bg-black/50 backdrop-blur-md p-2 rounded-full text-white border border-white/10 hover:bg-purple-600 hover:border-purple-500 transition-colors">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-xl font-bold text-white mb-2 capitalize tracking-wide">{art.feeling}</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <Activity className="w-3 h-3 text-purple-400" />
            <div className="flex-1 h-1 bg-neutral-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${art.intensity}%` }}
                transition={{ delay: 0.2, duration: 1 }}
                className={`h-full rounded-full ${
                  art.intensity > 80 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 
                  art.intensity > 50 ? 'bg-purple-500' : 'bg-indigo-400'
                }`}
              />
            </div>
            <span className="font-mono">{art.intensity}%</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Calendar className="w-3 h-3" />
            {new Date(art.created_at).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric' 
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Lightbox({ art, onClose }: { art: ArtItem; onClose: () => void }) {
  
  // Logic to actually download the image
  const handleDownload = async () => {
    try {
      const response = await fetch(art.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `eidetic-${art.feeling}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-neutral-950/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-5xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={art.image_url} 
            alt={art.feeling} 
            className="w-full h-full object-contain max-h-[60vh] md:max-h-full"
          />
        </div>

        <div className="w-full md:w-96 p-8 flex flex-col bg-neutral-900 border-l border-neutral-800">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-white capitalize">{art.feeling}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Intensity Level</label>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-light text-purple-400">{art.intensity}</span>
                <span className="text-neutral-500 mb-1">/ 100</span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden mt-2">
                 <div 
                   className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                   style={{ width: `${art.intensity}%` }}
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Created On</label>
              <p className="text-neutral-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-500" />
                {new Date(art.created_at).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-800 flex gap-3">
             <button 
                onClick={handleDownload}
                className="flex-1 bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-neutral-200 transition flex items-center justify-center gap-2"
             >
               <Download className="w-4 h-4" />
               Download
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-neutral-900 rounded-2xl h-[400px] border border-neutral-800 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ searchTerm }: { searchTerm: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-neutral-700" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No emotions found</h3>
      <p className="text-neutral-500 max-w-sm mb-6">
        {searchTerm 
          ? `We couldn't find any artworks matching "${searchTerm}".`
          : "Your gallery is empty. Start your journey by creating your first emotion."}
      </p>
      {searchTerm ? (
        <button 
          onClick={() => window.location.reload()} 
          className="text-purple-400 hover:text-purple-300 font-medium"
        >
          Clear filters
        </button>
      ) : (
        <Link href="/" className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-all">
          Create Artwork
        </Link>
      )}
    </div>
  );
}