// lib/prompt-logic.ts

export function generateArtPrompt(feeling: string, intensity: number): string {
  let styleModifiers = "";
  const feelingLower = feeling.toLowerCase();

  // --- 1. SOMATIC TRANSLATION (The "Alexithymia" Layer) ---
  // This maps physical sensations to visual art textures
  // Source: Your Strategy Document (Dictionary of Affect)

  if (feelingLower.includes("spiky") || feelingLower.includes("sharp")) {
    styleModifiers += " jagged geometry, sharp angular lines, aggression, chaotic composition,";
  }
  if (feelingLower.includes("heavy") || feelingLower.includes("crushing")) {
    styleModifiers += " weighted composition, bottom-heavy, dense texture, claustrophobic, brutalism,";
  }
  if (feelingLower.includes("hollow") || feelingLower.includes("empty")) {
    styleModifiers += " vast negative space, minimalism, echoing void, transparent textures,";
  }
  if (feelingLower.includes("burning") || feelingLower.includes("electric")) {
    styleModifiers += " high contrast neon, vibrating colors, glitch art, distortion, glowing edges,";
  }
  if (feelingLower.includes("cloudy") || feelingLower.includes("foggy")) {
    styleModifiers += " volumetric fog, gaussian blur, soft edges, ethereal, dreamcore,";
  }
  if (feelingLower.includes("shattered") || feelingLower.includes("broken")) {
    styleModifiers += " fractured cubism, fragmented reality, shards of glass, mosaic, destructive,";
  }
  if (feelingLower.includes("blooming") || feelingLower.includes("growing")) {
    styleModifiers += " organic fractals, art nouveau curves, bioluminescence, flowing intricate lines,";
  }

  // --- 2. INTENSITY LOGIC ---
  if (intensity > 85) {
    styleModifiers += " hyper-intense, dramatic chiaroscuro lighting, 8k resolution, masterpiece,";
  } else if (intensity > 60) {
    styleModifiers += " vivid, highly detailed, sharp focus,";
  } else {
    styleModifiers += " soft, muted colors, pastel palette, diffuse lighting, low contrast,";
  }

  // --- 3. CORE EMOTION MAPPING ---
  if (feelingLower.includes("anx") || feelingLower.includes("panic")) {
    styleModifiers += " abstract expressionism, jackson pollock style, visual noise, glitch";
  } 
  else if (feelingLower.includes("sad") || feelingLower.includes("lonely") || feelingLower.includes("depress")) {
    styleModifiers += " blue period picasso, edward hopper style, cold color palette, solitude";
  } 
  else if (feelingLower.includes("ang") || feelingLower.includes("rag") || feelingLower.includes("mad")) {
    styleModifiers += " francis bacon style, distorted forms, crimson and obsidian palette";
  } 
  else if (feelingLower.includes("joy") || feelingLower.includes("hope")) {
    styleModifiers += " claude monet style, warm golden hour lighting, harmonious composition";
  } 
  else if (feelingLower.includes("fear")) {
    styleModifiers += " german expressionism, edvard munch style, distorted shadows, dark moody atmosphere";
  }
  else {
    styleModifiers += " surrealism, salvador dali style, symbolic, conceptual art, evocative";
  }

  return `A conceptual artistic representation of "${feeling}". Art style: ${styleModifiers}. High quality, trending on artstation.`;
}