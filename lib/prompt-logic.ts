// lib/prompt-logic.ts

// 1. DATA DICTIONARIES (Scalable Configuration)
const SOMATIC_MAP: Record<string, string> = {
  spiky: "jagged geometry, sharp angular lines, aggression, chaotic composition",
  sharp: "cutting edges, precisionism, high contrast, dangerous shapes",
  heavy: "weighted composition, bottom-heavy, dense texture, claustrophobic, brutalism",
  crushing: "oppressive atmosphere, dark masses, gravitational pull",
  hollow: "vast negative space, minimalism, echoing void, transparent textures",
  empty: "liminal space, isolation, bleak coloring, sparse details",
  burning: "high contrast neon, vibrating colors, glitch art, distortion, glowing edges",
  electric: "lightning bolts, energy fields, dynamic movement, hyper-saturation",
  cloudy: "volumetric fog, gaussian blur, soft edges, ethereal, dreamcore",
  foggy: "misty atmosphere, faded colors, low contrast, mystery",
  shattered: "fractured cubism, fragmented reality, shards of glass, mosaic, destructive",
  broken: "ruins, decay, glitch art, disjointed perspective",
  blooming: "organic fractals, art nouveau curves, bioluminescence, flowing intricate lines",
  racing: "motion blur, speed lines, futurism, kinetic energy"
};

const EMOTION_MAP: Record<string, string> = {
  anx: "abstract expressionism, jackson pollock style, visual noise, glitch",
  panic: "chaotic composition, screaming colors, francis bacon style",
  sad: "blue period picasso, edward hopper style, cold color palette, solitude",
  lonely: "minimalist, vast empty space, single figure, melancholic",
  ang: "francis bacon style, distorted forms, crimson and obsidian palette",
  mad: "aggressive brushstrokes, intense turbulence, red and black",
  joy: "claude monet style, warm golden hour lighting, harmonious composition",
  hope: "sunrise palette, ethereal light, upward movement, soft textures",
  fear: "german expressionism, edvard munch style, distorted shadows, dark moody atmosphere"
};

/**
 * Translates feelings into art styles using a dictionary lookup pattern.
 */
export function generateArtPrompt(feeling: string, intensity: number): string {
  const feelingLower = feeling.toLowerCase();
  const styleModifiers: string[] = [];

  // 1. SOMATIC SCANNING (Iterate through dictionary keys)
  Object.keys(SOMATIC_MAP).forEach((key) => {
    if (feelingLower.includes(key)) {
      styleModifiers.push(SOMATIC_MAP[key]);
    }
  });

  // 2. EMOTION SCANNING
  Object.keys(EMOTION_MAP).forEach((key) => {
    if (feelingLower.includes(key)) {
      styleModifiers.push(EMOTION_MAP[key]);
    }
  });

  // Default fallback if no matches
  if (styleModifiers.length === 0) {
    styleModifiers.push("surrealism, salvador dali style, symbolic, conceptual art, evocative");
  }

  // 3. INTENSITY LOGIC
  let intensityMod = "";
  if (intensity > 85) {
    intensityMod = "hyper-intense, dramatic chiaroscuro lighting, 8k resolution, masterpiece";
  } else if (intensity > 60) {
    intensityMod = "vivid, highly detailed, sharp focus";
  } else {
    intensityMod = "soft, muted colors, pastel palette, diffuse lighting, low contrast";
  }

  return `A conceptual artistic representation of "${feeling}". Art style: ${styleModifiers.join(", ")}, ${intensityMod}. High quality, trending on artstation.`;
}