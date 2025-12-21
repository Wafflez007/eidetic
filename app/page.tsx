"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Brain } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Components
import NotificationToast, { NotificationType } from "@/components/NotificationToast";
import DynamicBackground from "@/components/DynamicBackground";
import ControlPanel from "@/components/ControlPanel";
import ArtDisplay from "@/components/ArtDisplay";
import MissionSection from "@/components/MissionSection";

// --- UTILS ---
/* eslint-disable @typescript-eslint/no-explicit-any */
const safeLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(message, ...args);
  }
};

// 🔑 CORS-SAFE IMAGE FETCH (NEW – ONLY ADDITION)
async function fetchImageViaProxy(imageUrl: string): Promise<Blob> {
  const res = await fetch("/api/fetch-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: imageUrl }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch image via proxy");
  }

  return await res.blob();
}

export default function EideticStudio() {
  // --- STATE ---
  const [feeling, setFeeling] = useState("");
  const [intensity, setIntensity] = useState(50);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [insight, setInsight] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(null);

  // --- NOTIFICATIONS ---
  const showToast = (message: string, type: NotificationType["type"]) => {
    setNotification({ message, type });
    if (type !== "crisis") {
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // --- SOUND ---
  const playSound = (type: "success" | "error") => {
    if (isMuted) return;
    const src =
      type === "success"
        ? "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3"
        : "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.mp3";

    const audio = new Audio(src);
    audio.volume = 0.4;
    audio.play().catch(() => safeLog("Audio blocked by browser"));
  };

  // --- 🧠 INSIGHT GENERATOR (UNCHANGED) ---
  const generateInsight = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("heavy") || t.includes("crushing") || t.includes("weight"))
      return "You are carrying a lot. Remember, you don’t have to carry it all at once.";
    if (t.includes("spiky") || t.includes("sharp") || t.includes("anger"))
      return "Anger is often a bodyguard for sadness. It’s okay to lower the shield.";
    if (t.includes("empty") || t.includes("hollow") || t.includes("void"))
      return "Even a hollow space is waiting to be filled. Give yourself time.";
    if (t.includes("burning") || t.includes("racing") || t.includes("fire"))
      return "This energy is intense, but like fire, it will eventually settle.";
    if (t.includes("foggy") || t.includes("cloudy") || t.includes("blur"))
      return "Clarity will return. For now, it is safe to rest in the unknown.";
    if (t.includes("shattered") || t.includes("broken") || t.includes("crack"))
      return "What is broken can be remade into a mosaic. You are still whole.";
    if (t.includes("blooming") || t.includes("growing") || t.includes("green"))
      return "Growth is often uncomfortable before it is beautiful.";
    return "Your feelings are valid. Visualizing them is the first step to understanding them.";
  };

  // --- GENERATE ART (UNCHANGED) ---
  const generateArt = async () => {
    if (!feeling) return;

    const crisisKeywords = [
      "die",
      "kill",
      "suicide",
      "hurt myself",
      "end it",
      "death",
      "overdose",
      "cutting",
      "give up",
    ];

    if (crisisKeywords.some((word) => feeling.toLowerCase().includes(word))) {
      showToast(
        "You are not alone. Immediate help is available. Dial 988 or contact local emergency services.",
        "crisis"
      );
      return;
    }

    setLoading(true);
    setSaved(false);
    setImage(null);
    setInsight("");
    setNotification(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeling, intensity }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (data.success) {
        setImage(data.image);
        setInsight(generateInsight(feeling));
        playSound("success");
      } else {
        showToast(data.error || "Something went wrong.", "error");
        playSound("error");
      }
    } catch (error: any) {
      if (error.name === "AbortError") showToast("Connection timed out.", "error");
      else showToast("Connection failed.", "error");
      playSound("error");
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  // --- SAVE TO GALLERY (FIXED, NOTHING REMOVED) ---
  const saveToGallery = async () => {
    if (!image || !feeling) return;
    setSaving(true);

    try {
      let blob: Blob;

      if (image.startsWith("http")) {
        blob = await fetchImageViaProxy(image); // ✅ FIX
      } else {
        const base64Data = image.split(",")[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
        blob = new Blob([new Uint8Array(byteNumbers)], { type: "image/png" });
      }

      const cleanFeeling = feeling.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 30);
      const filename = `${Date.now()}-${cleanFeeling}.png`;

      const { error: uploadError } = await supabase.storage
        .from("artworks")
        .upload(filename, blob, { contentType: "image/png" });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("artworks").getPublicUrl(filename);

      const { error: dbError } = await supabase.from("gallery").insert([
        { feeling, intensity, image_url: data.publicUrl },
      ]);
      if (dbError) throw dbError;

      setSaved(true);
      showToast("Saved to your personal journal.", "success");
      playSound("success");
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      safeLog("Save error:", error);
      showToast("Could not save to gallery. Try again.", "error");
      playSound("error");
    } finally {
      setSaving(false);
    }
  };

  // --- SHARE (FIXED, NOTHING REMOVED) ---
  const handleShare = async () => {
    if (!image) return;

    try {
      const blob = image.startsWith("http")
        ? await fetchImageViaProxy(image) // ✅ FIX
        : await fetchImageViaProxy(image);

      const file = new File([blob], `eidetic-${feeling}.png`, {
        type: "image/png",
      });

      if (navigator.share) {
        await navigator.share({
          title: "My Eidetic Journal",
          text: `I visualized my feeling of "${feeling}" using Eidetic.`,
          files: [file],
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!", "success");
      } else {
        showToast("Sharing not supported on this device.", "info");
      }
    } catch (error) {
      safeLog("Share error:", error);
      showToast("Could not share image.", "error");
    }
  };

  // --- CLEAR (UNCHANGED) ---
  const clearCanvas = () => {
    setImage(null);
    setFeeling("");
    setIntensity(50);
    setSaved(false);
    setInsight("");
    setNotification(null);
  };

  // --- UI (UNCHANGED) ---
  return (
    <main className="min-h-screen bg-neutral-950 text-white relative overflow-x-hidden overflow-y-auto font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <DynamicBackground intensity={intensity} />
      </div>

      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* HEADER */}
      <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)]">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              EIDETIC
            </h1>
            <p className="text-[10px] text-purple-300 uppercase tracking-[0.2em] font-medium leading-none">
              Alexithymia Translator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/gallery"
            className="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:block"
          >
            Journal
          </a>
          <div className="h-4 w-[1px] bg-neutral-800 hidden sm:block"></div>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-neutral-900/80 border border-neutral-800 hover:bg-neutral-800 transition-all text-neutral-400 hover:text-white"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pb-12 flex flex-col items-center">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[75vh] items-center">
          <div className="lg:col-span-4">
            <ControlPanel
              feeling={feeling}
              setFeeling={setFeeling}
              intensity={intensity}
              setIntensity={setIntensity}
              loading={loading}
              image={image}
              onGenerate={generateArt}
              onClear={clearCanvas}
            />
          </div>

          <div className="lg:col-span-8">
            <ArtDisplay
              loading={loading}
              image={image}
              insight={insight}
              saving={saving}
              saved={saved}
              onSave={saveToGallery}
              onShare={handleShare}
            />
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent my-16 opacity-50"></div>

        <MissionSection />

        <footer className="w-full text-center py-8 text-neutral-600 text-xs">
          <p>PeerBridge Mental Health Hacks 2025 • Built with Pollinations.ai</p>
        </footer>
      </div>
    </main>
  );
}
