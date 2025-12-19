// app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { generateArtPrompt } from '@/lib/prompt-logic';

export async function POST(req: Request) {
  try {
    const { feeling, intensity } = await req.json();

    // 1. Logic
    const finalPrompt = generateArtPrompt(feeling, intensity);

    // SECURITY: Only log prompts in dev mode to keep user data private in production logs
    if (process.env.NODE_ENV === 'development') {
        console.log("Generating with prompt:", finalPrompt);
    }

    // 2. Call Stability AI
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: finalPrompt, weight: 1 }],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const result = await response.json();
    
    // Safety check for response structure
    if (!result.artifacts || !result.artifacts[0]) {
        throw new Error("No image generated");
    }

    const imageBase64 = result.artifacts[0].base64;

    return NextResponse.json({ success: true, image: `data:image/png;base64,${imageBase64}` });

  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (process.env.NODE_ENV === 'development') console.error("Error generating art:", error);
    return NextResponse.json({ success: false, error: error.message || "Generation Failed" }, { status: 500 });
  }
}