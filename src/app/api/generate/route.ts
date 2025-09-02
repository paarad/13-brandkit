import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface BrandSpec {
  name: string;
  tagline?: string;
  vibe: string;
  palette: {
    name: string;
    primary: string;
    accent: string;
  };
  memeMode: boolean;
  wantIcon: boolean;
}

interface LogoVariant {
  id: string;
  name: string;
  svg: string;
  style: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    letterSpacing: string;
    textTransform: string;
    color: string;
  };
}

const getVibeFont = (vibe: string): string => {
  const fonts = {
    minimalist: "Inter, sans-serif",
    futuristic: "Space Grotesk, sans-serif", 
    elegant: "Playfair Display, serif",
    rounded: "Nunito, sans-serif",
    brutalist: "Arial Black, sans-serif",
    monospace: "JetBrains Mono, monospace"
  };
  return fonts[vibe as keyof typeof fonts] || fonts.minimalist;
};

const getVibeWeight = (vibe: string): string => {
  const weights = {
    minimalist: "300",
    futuristic: "700",
    elegant: "400", 
    rounded: "600",
    brutalist: "900",
    monospace: "500"
  };
  return weights[vibe as keyof typeof weights] || "400";
};

const getVibeSpacing = (vibe: string): string => {
  const spacing = {
    minimalist: "0.05em",
    futuristic: "0.1em",
    elegant: "0.02em",
    rounded: "0.03em", 
    brutalist: "0.08em",
    monospace: "0.05em"
  };
  return spacing[vibe as keyof typeof spacing] || "normal";
};

const getVibeCase = (vibe: string): string => {
  const casing = {
    minimalist: "lowercase",
    futuristic: "uppercase", 
    elegant: "capitalize",
    rounded: "lowercase",
    brutalist: "uppercase",
    monospace: "lowercase"
  };
  return casing[vibe as keyof typeof casing] || "none";
};

const generateSVGLogo = (brandName: string, tagline: string | undefined, vibe: string, palette: BrandSpec['palette'], variant: 'horizontal' | 'stacked' | 'accent'): string => {
  const fontFamily = getVibeFont(vibe);
  const fontWeight = getVibeWeight(vibe);
  const textTransform = getVibeCase(vibe);
  
  let displayName = brandName;
  if (textTransform === "uppercase") displayName = brandName.toUpperCase();
  if (textTransform === "lowercase") displayName = brandName.toLowerCase();
  
  const color = variant === 'accent' ? palette.accent : palette.primary;
  
  if (variant === 'stacked' && tagline) {
    return `<svg width="300" height="120" xmlns="http://www.w3.org/2000/svg">
      <text x="150" y="60" text-anchor="middle" font-family="${fontFamily}" font-size="36" font-weight="${fontWeight}" fill="${color}">
        ${displayName}
      </text>
      <text x="150" y="90" text-anchor="middle" font-family="${fontFamily}" font-size="14" fill="${palette.accent}">
        ${tagline}
      </text>
    </svg>`;
  }
  
  return `<svg width="400" height="80" xmlns="http://www.w3.org/2000/svg">
    <text x="20" y="50" font-family="${fontFamily}" font-size="40" font-weight="${fontWeight}" fill="${color}">
      ${displayName}
    </text>
  </svg>`;
};

export async function POST(request: NextRequest) {
  try {
    const body: BrandSpec = await request.json();
    const { name, tagline, vibe, palette, memeMode } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    // Generate tagline suggestions if none provided
    let suggestedTaglines: string[] = [];
    if (!tagline && process.env.OPENAI_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a creative brand copywriter. Generate short, punchy taglines for brands."
            },
            {
              role: "user",
              content: `Create 5 short, original taglines (max 6 words) for a ${vibe} brand named '${name}'. ${memeMode ? 'Make them satirical and crypto/startup culture aware.' : 'Avoid clichés and trademarks. Keep them professional.'} Return only the taglines, one per line.`
            }
          ],
          max_tokens: 200,
          temperature: 0.8,
        });

        const taglineText = completion.choices[0]?.message?.content || "";
        suggestedTaglines = taglineText
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/^\d+\.\s*/, '').replace(/^["']|["']$/g, '').trim())
          .slice(0, 5);
      } catch (error) {
        console.error("OpenAI tagline generation failed:", error);
        // Fallback taglines
        suggestedTaglines = memeMode ? 
          ["To the moon 🚀", "Diamond hands 💎", "WAGMI ✨", "Wen lambo?", "This is the way"] :
          ["Innovation simplified", "Build different", "Future forward", "Made simple", "Think ahead"];
      }
    }

    // Generate logo variants
    const variants: LogoVariant[] = [
      {
        id: "1",
        name: "Horizontal",
        svg: generateSVGLogo(name, tagline, vibe, palette, 'horizontal'),
        style: {
          fontFamily: getVibeFont(vibe),
          fontSize: "40px",
          fontWeight: getVibeWeight(vibe),
          letterSpacing: getVibeSpacing(vibe),
          textTransform: getVibeCase(vibe),
          color: palette.primary
        }
      },
      {
        id: "2", 
        name: "Stacked",
        svg: generateSVGLogo(name, tagline, vibe, palette, 'stacked'),
        style: {
          fontFamily: getVibeFont(vibe),
          fontSize: "36px", 
          fontWeight: getVibeWeight(vibe),
          letterSpacing: getVibeSpacing(vibe),
          textTransform: getVibeCase(vibe),
          color: palette.primary
        }
      },
      {
        id: "3",
        name: "Accent",
        svg: generateSVGLogo(name, tagline, vibe, palette, 'accent'),
        style: {
          fontFamily: getVibeFont(vibe),
          fontSize: "40px",
          fontWeight: getVibeWeight(vibe), 
          letterSpacing: getVibeSpacing(vibe),
          textTransform: getVibeCase(vibe),
          color: palette.accent
        }
      }
    ];

    return NextResponse.json({
      variants,
      suggestedTaglines,
      brandSpec: body
    });

  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "Failed to generate logos" },
      { status: 500 }
    );
  }
} 