"use client";

import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Components
import NotificationToast, { NotificationType } from "@/components/NotificationToast";
import DynamicBackground from "@/components/DynamicBackground";
import ControlPanel from "@/components/ControlPanel";
import ArtDisplay from "@/components/ArtDisplay";

// --- UTILS ---
/* eslint-disable @typescript-eslint/no-explicit-any */
const safeLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(message, ...args);
  }
};

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

  // --- INSIGHT GENERATOR ---
  const generateInsight = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("heavy") || t.includes("crushing"))
      return "You are carrying a lot. Remember, you don’t have to carry it all at once.";
    if (t.includes("spiky") || t.includes("sharp"))
      return "Anger is often a bodyguard for sadness. It’s okay to lower the shield.";
    if (t.includes("empty") || t.includes("hollow"))
      return "Even a hollow space is waiting to be filled. Give yourself time.";
    if (t.includes("burning") || t.includes("racing") || t.includes("electric"))
      return "This energy is intense, but like fire, it will eventually settle.";
    if (t.includes("foggy") || t.includes("cloudy"))
      return "Clarity will return. For now, it is safe to rest in the unknown.";
    if (t.includes("shattered") || t.includes("broken"))
      return "What is broken can be remade into a mosaic. You are still whole.";
    if (t.includes("blooming") || t.includes("growing"))
      return "Growth is often uncomfortable before it is beautiful.";
    return "Your feelings are valid. Visualizing them is the first step to understanding them.";
  };

  // --- GENERATE ART ---
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

    if (crisisKeywords.some(word => feeling.toLowerCase().includes(word))) {
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
      if (error.name === "AbortError") {
        showToast("Connection timed out.", "error");
      } else {
        showToast("Connection failed.", "error");
      }
      playSound("error");
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  // --- SAVE TO GALLERY ---
  const saveToGallery = async () => {
    if (!image || !feeling) return;

    setSaving(true);
    try {
      const base64Data = image.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: "image/png" });

      const cleanFeeling = feeling.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 30);
      const filename = `${Date.now()}-${cleanFeeling}.png`;

      const { error: uploadError } = await supabase.storage
        .from("artworks")
        .upload(filename, blob, { contentType: "image/png" });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("artworks").getPublicUrl(filename);

      const { error: dbError } = await supabase.from("gallery").insert([
        {
          feeling,
          intensity,
          image_url: data.publicUrl,
        },
      ]);

      if (dbError) throw dbError;

      setSaved(true);
      showToast("Saved to your personal journal.", "success");
      playSound("success");
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      safeLog("Save error:", error);
      showToast("Could not save to gallery.", "error");
      playSound("error");
    } finally {
      setSaving(false);
    }
  };

  // --- SHARE ---
  const handleShare = async () => {
    if (!image) return;

    try {
      const response = await fetch(image);
      const blob = await response.blob();
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
    }
  };

  // --- CLEAR ---
  const clearCanvas = () => {
    setImage(null);
    setFeeling("");
    setIntensity(50);
    setSaved(false);
    setInsight("");
    setNotification(null);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Sound Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 rounded-full bg-neutral-900/50 border border-neutral-800 hover:bg-neutral-800 transition-all text-neutral-400 hover:text-white"
          aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />

      <DynamicBackground intensity={intensity} />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 z-10 items-center">
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
    </main>
  );
}
