import { NextResponse } from 'next/server';
import { generateArtPrompt } from '@/lib/prompt-logic';

// We don't need maxDuration anymore because this is instant!

export async function POST(req: Request) {
  try {
    const { feeling, intensity } = await req.json();

    // 1. Generate the Prompt
    const finalPrompt = generateArtPrompt(feeling, intensity);
    console.log("🎨 Pollinations Prompt:", finalPrompt);

    // 2. Build the Pollinations URL
    // We add a random seed so the image is consistent (caching works)
    const seed = Math.floor(Math.random() * 100000);
    const encodedPrompt = encodeURIComponent(finalPrompt);
    
    // We construct the direct URL. 
    // We use "flux" model which is great for artistic renders.
    // "nologo=true" removes the Pollinations watermark if possible.
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`;

    // 3. Return the URL directly (Instant!)
    // No fetching, no conversion, no timeouts.
    return NextResponse.json({ success: true, image: imageUrl });

  } catch (error: any) {
    console.error("❌ Generation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate art" },
      { status: 500 }
    );
  }
}