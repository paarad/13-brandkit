import { NextRequest, NextResponse } from "next/server";

interface ExportRequest {
  brandName: string;
  variants: Array<{
    id: string;
    name: string;
    svg: string;
    style: any;
  }>;
  palette: {
    name: string;
    primary: string;
    accent: string;
  };
  vibe: string;
  tagline?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json();
    const { brandName, variants, palette, vibe, tagline } = body;

    if (!brandName?.trim() || !variants?.length) {
      return NextResponse.json(
        { error: "Brand name and variants are required" },
        { status: 400 }
      );
    }

    // Generate brand kit data
    const brandKit = {
      brandName,
      tagline,
      vibe,
      generatedAt: new Date().toISOString(),
      colors: {
        primary: {
          hex: palette.primary,
          rgb: hexToRgb(palette.primary),
          hsl: hexToHsl(palette.primary)
        },
        accent: {
          hex: palette.accent,
          rgb: hexToRgb(palette.accent),
          hsl: hexToHsl(palette.accent)
        }
      },
      typography: {
        primary: getVibeFont(vibe),
        weights: getVibeWeights(vibe),
        spacing: getVibeSpacing(vibe),
        case: getVibeCase(vibe)
      },
      logos: variants.map(variant => ({
        name: variant.name,
        svg: variant.svg,
        style: variant.style,
        downloadUrls: {
          svg: `/api/download/svg?variant=${variant.id}&brand=${encodeURIComponent(brandName)}`,
          png: `/api/download/png?variant=${variant.id}&brand=${encodeURIComponent(brandName)}`,
          pngHiRes: `/api/download/png?variant=${variant.id}&brand=${encodeURIComponent(brandName)}&resolution=2x`
        }
      })),
      assets: {
        favicon: generateFavicon(brandName, palette.primary, vibe),
        socialCard: generateSocialCard(brandName, tagline, palette, vibe)
      },
      guidelines: {
        spacing: "Maintain consistent spacing around the logo",
        colors: "Use primary color for main logo, accent for highlights",
        backgrounds: "Logo works on both light and dark backgrounds",
        minSize: "Minimum size: 24px height for digital, 0.5 inch for print"
      }
    };

    return NextResponse.json(brandKit);

  } catch (error) {
    console.error("Export API error:", error);
    return NextResponse.json(
      { error: "Failed to export brand kit" },
      { status: 500 }
    );
  }
}

// Helper functions
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "rgb(0, 0, 0)";
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "hsl(0, 0%, 0%)";
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function getVibeFont(vibe: string): string {
  const fonts = {
    minimalist: "Inter, sans-serif",
    futuristic: "Space Grotesk, sans-serif", 
    elegant: "Playfair Display, serif",
    rounded: "Nunito, sans-serif",
    brutalist: "Arial Black, sans-serif",
    monospace: "JetBrains Mono, monospace"
  };
  return fonts[vibe as keyof typeof fonts] || fonts.minimalist;
}

function getVibeWeights(vibe: string): string[] {
  const weights = {
    minimalist: ["300", "400", "500"],
    futuristic: ["500", "700", "900"],
    elegant: ["300", "400", "600"], 
    rounded: ["400", "600", "700"],
    brutalist: ["700", "800", "900"],
    monospace: ["400", "500", "600"]
  };
  return weights[vibe as keyof typeof weights] || weights.minimalist;
}

function getVibeSpacing(vibe: string): string {
  const spacing = {
    minimalist: "0.05em",
    futuristic: "0.1em",
    elegant: "0.02em",
    rounded: "0.03em", 
    brutalist: "0.08em",
    monospace: "0.05em"
  };
  return spacing[vibe as keyof typeof spacing] || "normal";
}

function getVibeCase(vibe: string): string {
  const casing = {
    minimalist: "lowercase",
    futuristic: "uppercase", 
    elegant: "capitalize",
    rounded: "lowercase",
    brutalist: "uppercase",
    monospace: "lowercase"
  };
  return casing[vibe as keyof typeof casing] || "none";
}

function generateFavicon(brandName: string, color: string, vibe: string): string {
  const initial = brandName.charAt(0).toUpperCase();
  const weight = vibe === "brutalist" ? "900" : vibe === "elegant" ? "400" : "600";
  
  return `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="${color}"/>
    <text x="16" y="22" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="${weight}" fill="white">
      ${initial}
    </text>
  </svg>`;
}

function generateSocialCard(brandName: string, tagline: string | undefined, palette: any, vibe: string): string {
  const weight = vibe === "brutalist" ? "900" : vibe === "elegant" ? "400" : "600";
  const textTransform = vibe === "futuristic" || vibe === "brutalist" ? "uppercase" : "none";
  
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="white"/>
    <text x="600" y="300" text-anchor="middle" font-family="system-ui" font-size="72" font-weight="${weight}" fill="${palette.primary}" text-transform="${textTransform}">
      ${brandName}
    </text>
    ${tagline ? `<text x="600" y="360" text-anchor="middle" font-family="system-ui" font-size="24" fill="${palette.accent}">${tagline}</text>` : ''}
    <text x="600" y="580" text-anchor="middle" font-family="system-ui" font-size="16" fill="#666">
      Generated with BrandKit
    </text>
  </svg>`;
} 