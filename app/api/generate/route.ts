// app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { generateArtPrompt } from '@/lib/prompt-logic'; 

export async function POST(req: Request) {
  try {
    const { feeling, intensity } = await req.json();

    // 1. Use the helper function to get the prompt
    // This keeps your API code clean and readable
    const finalPrompt = generateArtPrompt(feeling, intensity);

    console.log("Generating with prompt:", finalPrompt); 

    // 2. Call Stability AI (Standard Code)
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
    const imageBase64 = result.artifacts[0].base64;

    return NextResponse.json({ success: true, image: `data:image/png;base64,${imageBase64}` });

  } catch (error: any) {
    console.error("Error generating art:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}