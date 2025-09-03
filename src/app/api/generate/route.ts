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
  const letterSpacing = getVibeSpacing(vibe);
  
  let displayName = brandName;
  if (textTransform === "uppercase") displayName = brandName.toUpperCase();
  if (textTransform === "lowercase") displayName = brandName.toLowerCase();
  
  const color = variant === 'accent' ? palette.accent : palette.primary;
  const accentColor = palette.accent;
  
  // Generate design elements based on vibe
  const designElements = generateDesignElements(vibe, palette, variant);
  
  if (variant === 'stacked' && tagline) {
    return `<svg width="320" height="140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${designElements.defs}
      </defs>
      ${designElements.background}
      ${generateLogoShape(displayName, vibe, color, 160, 45, 'center')}
      <line x1="80" y1="65" x2="240" y2="65" stroke="${accentColor}" stroke-width="2" opacity="0.6"/>
      <text x="160" y="85" text-anchor="middle" font-family="${fontFamily}" font-size="12" fill="${accentColor}" letter-spacing="1px">
        ${tagline.toUpperCase()}
      </text>
      ${designElements.decorations}
    </svg>`;
  }
  
  if (variant === 'accent') {
    return `<svg width="450" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${designElements.defs}
      </defs>
      ${designElements.background}
      ${generateAccentTreatment(displayName, vibe, color, accentColor)}
      ${designElements.decorations}
    </svg>`;
  }
  
  // Horizontal variant
  return `<svg width="420" height="90" xmlns="http://www.w3.org/2000/svg">
    <defs>
      ${designElements.defs}
    </defs>
    ${designElements.background}
    ${generateLogoShape(displayName, vibe, color, 30, 55, 'start')}
    ${designElements.decorations}
  </svg>`;
};

const generateLogoShape = (text: string, vibe: string, color: string, x: number, y: number, anchor: 'start' | 'middle' | 'center' = 'start'): string => {
  const fontFamily = getVibeFont(vibe);
  const fontWeight = getVibeWeight(vibe);
  const letterSpacing = getVibeSpacing(vibe);
  const textAnchor = anchor === 'center' ? 'middle' : anchor;
  
  switch (vibe) {
    case 'minimalist':
      return `<text x="${x}" y="${y}" text-anchor="${textAnchor}" font-family="${fontFamily}" font-size="42" font-weight="${fontWeight}" fill="${color}" letter-spacing="${letterSpacing}">
        ${text}
      </text>`;
      
    case 'futuristic':
      return `<g>
        <text x="${x}" y="${y}" text-anchor="${textAnchor}" font-family="${fontFamily}" font-size="38" font-weight="${fontWeight}" fill="url(#futuristicGradient)" letter-spacing="${letterSpacing}" transform="skewX(-5)">
          ${text}
        </text>
        <text x="${x+2}" y="${y+2}" text-anchor="${textAnchor}" font-family="${fontFamily}" font-size="38" font-weight="${fontWeight}" fill="${color}" opacity="0.3" letter-spacing="${letterSpacing}" transform="skewX(-5)">
          ${text}
        </text>
      </g>`;
      
    case 'elegant':
      return `<g>
        <text x="${x}" y="${y-5}" text-anchor="${textAnchor}" font-family="${fontFamily}" font-size="48" font-weight="${fontWeight}" fill="${color}" letter-spacing="${letterSpacing}">
          ${text}
        </text>
        <line x1="${x-20}" y1="${y+10}" x2="${x + text.length * 25}" y2="${y+10}" stroke="${color}" stroke-width="1" opacity="0.4"/>
      </g>`;
      
    case 'rounded':
      return `<g>
        <rect x="${x-15}" y="${y-35}" width="${text.length * 28 + 30}" height="55" rx="27" fill="${color}" opacity="0.1"/>
        <text x="${x}" y="${y}" text-anchor="${textAnchor}" font-family="${fontFamily}" font-size="36" font-weight="${fontWeight}" fill="${color}" letter-spacing="${letterSpacing}">
          ${text}
        </text>
      </g>`;
      
    case 'brutalist':
      return `<g>
        <rect x="${x-10}" y="${y-35}" width="${text.length * 32 + 20}" height="50" fill="${color}" transform="rotate(-1)"/>
        <text x="${x}" y="${y-3}" text-anchor="${textAnchor}" font-family="${fontFamily}" font-size="36" font-weight="${fontWeight}" fill="white" letter-spacing="${letterSpacing}">
          ${text}
        </text>
      </g>`;
      
    case 'monospace':
      const chars = text.split('');
      return `<g>
        ${chars.map((char, i) => `
          <rect x="${x + i * 25 - 2}" y="${y-30}" width="22" height="40" fill="${color}" opacity="${0.1 + (i % 3) * 0.1}"/>
          <text x="${x + i * 25 + 9}" y="${y}" text-anchor="middle" font-family="${fontFamily}" font-size="28" font-weight="${fontWeight}" fill="${color}">
            ${char}
          </text>
        `).join('')}
      </g>`;
      
    default:
      return `<text x="${x}" y="${y}" text-anchor="${textAnchor}" font-family="${fontFamily}" font-size="40" font-weight="${fontWeight}" fill="${color}" letter-spacing="${letterSpacing}">
        ${text}
      </text>`;
  }
};

const generateAccentTreatment = (text: string, vibe: string, primaryColor: string, accentColor: string): string => {
  const x = 30;
  const y = 55;
  
  switch (vibe) {
    case 'minimalist':
      return `<g>
        <circle cx="15" cy="${y-15}" r="8" fill="${accentColor}"/>
        ${generateLogoShape(text, vibe, primaryColor, x, y)}
      </g>`;
      
    case 'futuristic':
      return `<g>
        <polygon points="5,${y-25} 25,${y-25} 20,${y-5} 0,${y-5}" fill="${accentColor}"/>
        ${generateLogoShape(text, vibe, primaryColor, x, y)}
      </g>`;
      
    case 'elegant':
      return `<g>
        <text x="15" y="${y-10}" font-family="serif" font-size="24" fill="${accentColor}">✦</text>
        ${generateLogoShape(text, vibe, primaryColor, x, y)}
      </g>`;
      
    case 'rounded':
      return `<g>
        <circle cx="15" cy="${y-15}" r="12" fill="${accentColor}" opacity="0.8"/>
        <circle cx="15" cy="${y-15}" r="6" fill="white"/>
        ${generateLogoShape(text, vibe, primaryColor, x, y)}
      </g>`;
      
    case 'brutalist':
      return `<g>
        <rect x="0" y="${y-30}" width="20" height="20" fill="${accentColor}" transform="rotate(45 10 ${y-20})"/>
        ${generateLogoShape(text, vibe, primaryColor, x, y)}
      </g>`;
      
    case 'monospace':
      return `<g>
        <rect x="5" y="${y-25}" width="15" height="15" fill="${accentColor}"/>
        <rect x="8" y="${y-22}" width="9" height="9" fill="white"/>
        <rect x="11" y="${y-19}" width="3" height="3" fill="${accentColor}"/>
        ${generateLogoShape(text, vibe, primaryColor, x, y)}
      </g>`;
      
    default:
      return generateLogoShape(text, vibe, primaryColor, x, y);
  }
};

const generateDesignElements = (vibe: string, palette: BrandSpec['palette'], variant: string) => {
  const elements = {
    defs: '',
    background: '',
    decorations: ''
  };
  
  switch (vibe) {
    case 'futuristic':
      elements.defs = `
        <linearGradient id="futuristicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${palette.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${palette.accent};stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>`;
      break;
      
    case 'elegant':
      elements.decorations = `
        <g opacity="0.2">
          <path d="M10,10 Q50,5 90,10" stroke="${palette.accent}" stroke-width="1" fill="none"/>
          <circle cx="15" cy="10" r="2" fill="${palette.accent}"/>
          <circle cx="85" cy="10" r="2" fill="${palette.accent}"/>
        </g>`;
      break;
      
    case 'minimalist':
      if (variant === 'horizontal') {
        elements.decorations = `<line x1="30" y1="75" x2="120" y2="75" stroke="${palette.accent}" stroke-width="1" opacity="0.3"/>`;
      }
      break;
  }
  
  return elements;
};

const generateMemeLogoVariant = (brandName: string, tagline: string | undefined, palette: BrandSpec['palette'], variant: 'diamond' | 'moon' | 'hodl'): string => {
  const displayName = brandName.toUpperCase();
  
  switch (variant) {
    case 'diamond':
      return `<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
            <stop offset="50%" style="stop-color:${palette.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FF69B4;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="120" fill="url(#diamondGrad)" opacity="0.1"/>
        <polygon points="50,20 80,50 50,80 20,50" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
        <text x="100" y="55" font-family="Impact, sans-serif" font-size="36" font-weight="900" fill="url(#diamondGrad)" letter-spacing="2px">
          ${displayName}
        </text>
        <text x="100" y="80" font-family="Arial" font-size="12" fill="#FFD700" letter-spacing="1px">
          💎 DIAMOND HANDS 💎
        </text>
      </svg>`;
      
    case 'moon':
      return `<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="moonGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#4169E1;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0000FF;stop-opacity:1" />
          </radialGradient>
        </defs>
        <rect width="400" height="120" fill="url(#moonGrad)" opacity="0.2"/>
        <circle cx="40" cy="40" r="18" fill="#FFFF00" stroke="#FFA500" stroke-width="2"/>
        <path d="M35,35 Q45,25 55,35 Q45,45 35,35" fill="#0000FF" opacity="0.3"/>
        <text x="80" y="55" font-family="Arial Black, sans-serif" font-size="32" font-weight="900" fill="#FFFF00" letter-spacing="3px" transform="rotate(-5)">
          ${displayName}
        </text>
        <text x="80" y="80" font-family="Arial" font-size="14" fill="#00FFFF" letter-spacing="2px">
          🚀 TO THE MOON 🌙
        </text>
      </svg>`;
      
    case 'hodl':
      return `<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hodlPattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="${palette.primary}"/>
            <circle cx="10" cy="10" r="3" fill="${palette.accent}"/>
          </pattern>
        </defs>
        <rect width="400" height="120" fill="url(#hodlPattern)" opacity="0.1"/>
        <rect x="15" y="25" width="60" height="40" fill="${palette.primary}" transform="rotate(10)" opacity="0.8"/>
        <text x="90" y="50" font-family="Courier New, monospace" font-size="28" font-weight="700" fill="${palette.primary}" letter-spacing="4px">
          ${displayName}
        </text>
        <text x="90" y="75" font-family="Arial" font-size="12" fill="${palette.accent}" letter-spacing="1px">
          ✋ HODL STRONG ✋
        </text>
        <text x="300" y="30" font-family="Arial" font-size="20" fill="#00FF00">📈</text>
        <text x="320" y="50" font-family="Arial" font-size="16" fill="#FF0000">📉</text>
        <text x="340" y="35" font-family="Arial" font-size="24" fill="#00FF00">📈</text>
      </svg>`;
      
    default:
      return generateSVGLogo(brandName, tagline, 'futuristic', palette, 'horizontal');
  }
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

    // Generate logo variants with meme mode enhancements
    const variants: LogoVariant[] = [
      {
        id: "1",
        name: memeMode ? "Diamond" : "Horizontal",
        svg: memeMode ? generateMemeLogoVariant(name, tagline, palette, 'diamond') : generateSVGLogo(name, tagline, vibe, palette, 'horizontal'),
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
        name: memeMode ? "Moon" : "Stacked",
        svg: memeMode ? generateMemeLogoVariant(name, tagline, palette, 'moon') : generateSVGLogo(name, tagline, vibe, palette, 'stacked'),
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
        name: memeMode ? "HODL" : "Accent",
        svg: memeMode ? generateMemeLogoVariant(name, tagline, palette, 'hodl') : generateSVGLogo(name, tagline, vibe, palette, 'accent'),
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