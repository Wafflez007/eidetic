"use client";

export default function DynamicBackground({ intensity }: { intensity: number }) {
  return (
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
  );
}