"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Eye, Sparkles } from "lucide-react";

export default function MissionSection() {
  return (
    <section className="w-full max-w-4xl mx-auto mt-20 mb-12 px-6">
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-sm">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-neutral-800 pb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Why Eidetic Exists
            </h2>
            <p className="text-neutral-400">
              Bridging the gap between feeling and speaking.
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono uppercase tracking-wider">
            Clinical Focus: Alexithymia
          </div>
        </div>

        {/* The 3 Pillars */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Pillar 1: The Problem */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-white">The Silent Struggle</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Millions suffer from <strong className="text-white">Alexithymia</strong>—the clinical inability to identify and describe emotions. For them, "How do you feel?" is an impossible question to answer.
            </p>
          </div>

          {/* Pillar 2: The Mechanism */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-white">Visual Externalization</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Eidetic acts as a <strong className="text-white">prosthetic imagination</strong>. We bypass language barriers by translating somatic sensations (like "heavy" or "spiky") directly into visual reality.
            </p>
          </div>

          {/* Pillar 3: The Solution */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-white">Generative Insight</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              By seeing your emotion as an object outside yourself, you reduce amygdala reactivity. This transforms vague distress into analyzable art, enabling true self-reflection.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}