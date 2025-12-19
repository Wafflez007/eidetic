import { NextResponse } from 'next/server';
import { generateArtPrompt } from '@/lib/prompt-logic';

export const maxDuration = 60; // Bria might take a few seconds

export async function POST(req: Request) {
  try {
    const { feeling, intensity } = await req.json();

    // 1. Generate the Prompt using your existing logic
    const finalPrompt = generateArtPrompt(feeling, intensity);

    if (process.env.NODE_ENV === 'development') {
      console.log("🎨 Bria Generative Prompt:", finalPrompt);
    }

    // 2. Call Bria AI (Text-to-Image)
    // We use Model 2.3 which is high quality and fast
    const response = await fetch(
      "https://engine.prod.bria-api.com/v1/text-to-image/base/2.3", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api_token": process.env.BRIA_API_KEY || "", // Use your Bria Key
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          num_results: 1,
          aspect_ratio: "1:1",
          sync: true // Important: This keeps the connection open until image is ready
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Bria API Rejected the request");
    }

    const data = await response.json();
    
    // 3. Extract Image URL
    // Bria returns: { result: [{ url: "..." }] }
    const imageUrl = data.result?.[0]?.urls?.[0];
    
    if (!imageUrl) {
      throw new Error("No image URL returned from Bria");
    }

    // 4. Convert URL to Base64 (The Bridge)
    // Your frontend expects a Base64 string to display and upload to Supabase immediately.
    // We fetch the image from Bria's URL and convert it here on the server.
    const imageBufferResponse = await fetch(imageUrl);
    const arrayBuffer = await imageBufferResponse.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    const finalImage = `data:image/png;base64,${base64String}`;

    return NextResponse.json({ success: true, image: finalImage });

  } catch (error: any) {
    console.error("❌ Bria Generation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate art" },
      { status: 500 }
    );
  }
}