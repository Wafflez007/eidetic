// lib/prompt-logic.ts

/**
 * Translates a user's feeling and intensity into a specific art style prompt.
 */
export function generateArtPrompt(feeling: string, intensity: number): string {
  let styleModifiers = "";
  const feelingLower = feeling.toLowerCase();

  // 1. INTENSITY LOGIC
  // High intensity = Dramatic, Detailed. Low intensity = Soft, Muted.
  if (intensity > 85) {
    styleModifiers += " hyper-intense, explosive, dramatic lighting, 8k resolution, intricate detail,";
  } else if (intensity > 60) {
    styleModifiers += " vivid, highly detailed, sharp focus,";
  } else {
    styleModifiers += " soft, muted colors, ethereal, dreamlike, diffuse lighting,";
  }

  // 2. EMOTION LOGIC (The "Psychological Mapping")
  if (feelingLower.includes("anx") || feelingLower.includes("panic") || feelingLower.includes("stress")) {
    styleModifiers += " abstract expressionism, jackson pollock style, chaotic jagged lines, high contrast, visual noise, glitch art aesthetics";
  } 
  else if (feelingLower.includes("sad") || feelingLower.includes("depress") || feelingLower.includes("lonely")) {
    styleModifiers += " minimalist, blue period picasso, edward hopper style, vast empty negative space, cold color palette, solitude, melancholic atmosphere";
  } 
  else if (feelingLower.includes("ang") || feelingLower.includes("rag") || feelingLower.includes("mad")) {
    styleModifiers += " francis bacon style, distorted forms, crimson and obsidian palette, sharp aggressive brushstrokes, intense turbulence";
  } 
  else if (feelingLower.includes("happy") || feelingLower.includes("joy") || feelingLower.includes("hope")) {
    styleModifiers += " impressionist, claude monet style, blooming organic shapes, warm golden hour lighting, pastel colors, harmonious composition";
  } 
  else if (feelingLower.includes("fear") || feelingLower.includes("scared")) {
    styleModifiers += " german expressionism, edvard munch style, distorted shadows, dark moody atmosphere, unease, surrealism";
  }
  else {
    // Default fallback for unknown emotions
    styleModifiers += " surrealism, salvador dali style, symbolic, conceptual art, deep meaning, evocative";
  }

  // 3. CONSTRUCT FINAL PROMPT
  return `A conceptual artistic representation of the emotion "${feeling}". Art style: ${styleModifiers}. High quality, masterpiece, trending on artstation.`;
}