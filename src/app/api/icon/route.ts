import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface IconRequest {
  brandName: string;
  vibe: string;
  industry?: string;
  memeMode: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: IconRequest = await request.json();
    const { brandName, vibe, memeMode } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    if (!brandName?.trim()) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    // Generate icon description based on vibe and brand
    const getIconPrompt = (vibe: string, memeMode: boolean): string => {
      const basePrompt = "Minimal, flat, geometric icon. No letters or text, no gradients, simple silhouette, centered, white background, vector-like style.";
      
      if (memeMode) {
        return `${basePrompt} Crypto/meme culture inspired. Abstract, playful, slightly chaotic but clean.`;
      }

      const vibePrompts = {
        minimalist: `${basePrompt} Ultra clean, simple geometric shapes, maximum whitespace.`,
        futuristic: `${basePrompt} Angular, tech-inspired, circuit-like patterns, sleek.`,
        elegant: `${basePrompt} Sophisticated, classic shapes, refined proportions.`,
        rounded: `${basePrompt} Soft curves, friendly shapes, organic forms.`,
        brutalist: `${basePrompt} Bold geometric shapes, strong angles, powerful forms.`,
        monospace: `${basePrompt} Grid-based, pixel-inspired, technical precision.`
      };

      return vibePrompts[vibe as keyof typeof vibePrompts] || basePrompt;
    };

    const prompt = getIconPrompt(vibe, memeMode);

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural",
      });

      const imageUrl = response.data?.[0]?.url;
      
      if (!imageUrl) {
        throw new Error("No image generated");
      }

      return NextResponse.json({
        iconUrl: imageUrl,
        prompt: prompt,
        brandName,
        vibe
      });

    } catch (dalleError: unknown) {
      console.error("DALL-E generation failed:", dalleError);
      
      // Return a fallback response with a simple SVG icon
      const fallbackSVG = generateFallbackIcon(vibe, memeMode);
      
      return NextResponse.json({
        iconUrl: null,
        fallbackSVG,
        prompt,
        brandName,
        vibe,
        error: "AI icon generation failed, using fallback"
      });
    }

  } catch (error) {
    console.error("Icon API error:", error);
    return NextResponse.json(
      { error: "Failed to generate icon" },
      { status: 500 }
    );
  }
}

// Generate a simple fallback SVG icon based on vibe
function generateFallbackIcon(vibe: string, memeMode: boolean): string {
  if (memeMode) {
    return `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="20" fill="none" stroke="#000" stroke-width="3"/>
      <path d="M20 32 L32 20 L44 32 L32 44 Z" fill="#000"/>
    </svg>`;
  }

  const fallbackIcons = {
    minimalist: `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="24" fill="none" stroke="#000" stroke-width="2"/>
    </svg>`,
    futuristic: `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <polygon points="32,8 56,32 32,56 8,32" fill="none" stroke="#000" stroke-width="2"/>
    </svg>`,
    elegant: `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="32" rx="20" ry="28" fill="none" stroke="#000" stroke-width="2"/>
    </svg>`,
    rounded: `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="12" width="40" height="40" rx="20" fill="none" stroke="#000" stroke-width="2"/>
    </svg>`,
    brutalist: `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="12" width="40" height="40" fill="#000"/>
    </svg>`,
    monospace: `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="16" width="8" height="8" fill="#000"/>
      <rect x="40" y="16" width="8" height="8" fill="#000"/>
      <rect x="16" y="40" width="8" height="8" fill="#000"/>
      <rect x="40" y="40" width="8" height="8" fill="#000"/>
      <rect x="28" y="28" width="8" height="8" fill="#000"/>
    </svg>`
  };

  return fallbackIcons[vibe as keyof typeof fallbackIcons] || fallbackIcons.minimalist;
} 