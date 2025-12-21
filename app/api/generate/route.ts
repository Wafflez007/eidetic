import { NextResponse } from 'next/server';
import { generateArtPrompt } from '@/lib/prompt-logic';

export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const { feeling, intensity } = await req.json();

    // 1. Generate the Prompt
    const finalPrompt = generateArtPrompt(feeling, intensity);
    console.log("🎨 Pollinations Prompt:", finalPrompt);

    // 2. Build the Pollinations URL
    // We add a random seed to ensure every image is unique
    const seed = Math.floor(Math.random() * 10000);
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux`;

    // 3. Fetch the image data directly
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error("Pollinations API failed to return an image");
    }

    // 4. Convert to Base64
    const arrayBuffer = await response.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    const finalImage = `data:image/jpeg;base64,${base64String}`;

    return NextResponse.json({ success: true, image: finalImage });

  } catch (error: any) {
    console.error("❌ Generation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate art" },
      { status: 500 }
    );
  }
}