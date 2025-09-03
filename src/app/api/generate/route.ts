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

const generateLogoWithDALLE = async (brandName: string, tagline: string | undefined, vibe: string, memeMode: boolean, variant: 'horizontal' | 'stacked' | 'wordmark'): Promise<string> => {
  if (!process.env.OPENAI_API_KEY) {
    // Fallback to simple text logo
    return generateFallbackSVGLogo(brandName, tagline, vibe, variant);
  }

  try {
    const prompt = generateLogoPrompt(brandName, tagline, vibe, memeMode, variant);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural",
    });

    const imageUrl = response.data?.[0]?.url;
    
    if (!imageUrl) {
      throw new Error("No image generated");
    }

    // Return the DALL-E generated logo URL in a simple SVG wrapper for consistent display
    return `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <image href="${imageUrl}" x="0" y="0" width="400" height="200" preserveAspectRatio="xMidYMid meet"/>
    </svg>`;

  } catch (error) {
    console.error("DALL-E logo generation failed:", error);
    return generateFallbackSVGLogo(brandName, tagline, vibe, variant);
  }
};

const generateLogoPrompt = (brandName: string, tagline: string | undefined, vibe: string, memeMode: boolean, variant: string): string => {
  const basePrompt = `Professional logo design. Company name is "${brandName}" - spell this EXACTLY as written. ${tagline ? `Tagline is "${tagline}". ` : ''}CRITICAL: The text "${brandName}" must be spelled correctly letter by letter. `;
  
  if (memeMode) {
    return basePrompt + `Crypto/meme culture inspired, playful but still professional. Bold typography, crypto aesthetics, modern and clean. No emojis, no clipart. Vector-style logo design. White background. IMPORTANT: Text must be "${brandName}" spelled exactly.`;
  }

  const vibePrompts = {
    minimalist: `Ultra clean minimalist design. Simple typography, lots of white space, geometric precision. Think Apple, Airbnb. Modern sans-serif font. Monochromatic or very limited color palette.`,
    futuristic: `Futuristic tech company aesthetic. Angular, sleek, modern. Think Tesla, SpaceX. Bold sans-serif, possibly with subtle geometric elements. High-tech feeling.`,
    elegant: `Sophisticated, premium, luxury brand aesthetic. Think Chanel, Tiffany. Elegant serif or refined sans-serif typography. Classic, timeless design.`,
    rounded: `Friendly, approachable, rounded design. Think Google, Spotify. Soft corners, organic shapes, friendly typography. Warm and welcoming.`,
    brutalist: `Bold, raw, architectural aesthetic. Think Balenciaga, architectural firms. Heavy typography, strong geometric shapes, bold contrast.`,
    monospace: `Technical, developer-focused aesthetic. Think GitHub, coding tools. Monospace typography, grid-based, precise, technical feeling.`
  };

  const variantInstructions = {
    horizontal: 'Horizontal layout, company name in single line.',
    stacked: 'Stacked layout, company name stacked vertically or with tagline below.',
    wordmark: 'Pure wordmark, focus entirely on typography treatment.'
  };

  return basePrompt + 
    (vibePrompts[vibe as keyof typeof vibePrompts] || vibePrompts.minimalist) + 
    ` ${variantInstructions[variant as keyof typeof variantInstructions] || variantInstructions.horizontal}` +
    ` Professional logo design, vector-style, clean, scalable. White background. No clipart, no stock imagery. REMEMBER: The company name "${brandName}" must be spelled exactly as provided.`;
};

const generateFallbackSVGLogo = (brandName: string, tagline: string | undefined, vibe: string, variant: string): string => {
  const fontFamily = getVibeFont(vibe);
  const fontWeight = getVibeWeight(vibe);
  const textTransform = getVibeCase(vibe);
  
  let displayName = brandName;
  if (textTransform === "uppercase") displayName = brandName.toUpperCase();
  if (textTransform === "lowercase") displayName = brandName.toLowerCase();
  
  // Clean, professional fallback - just good typography
  if (variant === 'stacked' && tagline) {
    return `<svg width="300" height="120" xmlns="http://www.w3.org/2000/svg">
      <text x="150" y="60" text-anchor="middle" font-family="${fontFamily}" font-size="36" font-weight="${fontWeight}" fill="#1a1a1a" letter-spacing="0.05em">
        ${displayName}
      </text>
      <text x="150" y="85" text-anchor="middle" font-family="${fontFamily}" font-size="14" fill="#666" letter-spacing="0.1em">
        ${tagline.toUpperCase()}
      </text>
    </svg>`;
  }
  
  return `<svg width="350" height="80" xmlns="http://www.w3.org/2000/svg">
    <text x="20" y="50" font-family="${fontFamily}" font-size="42" font-weight="${fontWeight}" fill="#1a1a1a" letter-spacing="0.05em">
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

    // Generate text-only variants (fast and reliable)
    const textVariants: LogoVariant[] = [
      {
        id: "text-1",
        name: "Horizontal",
        svg: generateFallbackSVGLogo(name, tagline, vibe, 'horizontal'),
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
        id: "text-2", 
        name: "Stacked",
        svg: generateFallbackSVGLogo(name, tagline, vibe, 'stacked'),
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
        id: "text-3",
        name: "Wordmark",
        svg: generateFallbackSVGLogo(name, tagline, vibe, 'wordmark'),
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

    // Generate AI logo variants using DALL-E (slower but more creative)
    const [aiVariant1Svg, aiVariant2Svg, aiVariant3Svg] = await Promise.all([
      generateLogoWithDALLE(name, tagline, vibe, memeMode, 'horizontal'),
      generateLogoWithDALLE(name, tagline, vibe, memeMode, 'stacked'),
      generateLogoWithDALLE(name, tagline, vibe, memeMode, 'wordmark')
    ]);

    const aiVariants: LogoVariant[] = [
      {
        id: "ai-1",
        name: "AI Horizontal",
        svg: aiVariant1Svg,
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
        id: "ai-2", 
        name: "AI Stacked",
        svg: aiVariant2Svg,
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
        id: "ai-3",
        name: "AI Wordmark",
        svg: aiVariant3Svg,
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

    const variants = textVariants; // Default to text variants for backward compatibility

    return NextResponse.json({
      textVariants,
      aiVariants, 
      variants: textVariants, // For backward compatibility
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