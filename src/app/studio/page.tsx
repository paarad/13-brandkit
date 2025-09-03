"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Palette, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Image as ImageIcon,
  Copy,
  Check
} from "lucide-react";
import Link from "next/link";

const VIBES = [
  { value: "minimalist", label: "Minimalist", description: "Clean, simple, modern" },
  { value: "futuristic", label: "Futuristic", description: "Bold, tech, cutting-edge" },
  { value: "elegant", label: "Elegant Serif", description: "Sophisticated, premium" },
  { value: "rounded", label: "Rounded Tech", description: "Friendly, approachable" },
  { value: "brutalist", label: "Brutalist", description: "Raw, powerful, statement" },
  { value: "monospace", label: "Monospace", description: "Technical, developer-focused" }
];

const COLOR_PALETTES = [
  { name: "Monochrome", primary: "#000000", accent: "#666666" },
  { name: "Ocean", primary: "#0ea5e9", accent: "#06b6d4" },
  { name: "Forest", primary: "#059669", accent: "#10b981" },
  { name: "Sunset", primary: "#f59e0b", accent: "#f97316" },
  { name: "Royal", primary: "#7c3aed", accent: "#a855f7" },
  { name: "Rose", primary: "#e11d48", accent: "#f43f5e" }
];

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

function StudioContent() {
  const searchParams = useSearchParams();
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("minimalist");
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PALETTES[0]);
  const [memeMode, setMemeMode] = useState(false);
  const [wantIcon, setWantIcon] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [textVariants, setTextVariants] = useState<LogoVariant[]>([]);
  const [aiVariants, setAiVariants] = useState<LogoVariant[]>([]);
  const [logoVariants, setLogoVariants] = useState<LogoVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<LogoVariant | null>(null);
  const [logoType, setLogoType] = useState<"text" | "ai">("text");
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null);

  useEffect(() => {
    const nameParam = searchParams.get("name");
    if (nameParam) {
      setBrandName(nameParam);
    }
  }, [searchParams]);

  const generateLogos = async () => {
    if (!brandName.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: brandName,
          tagline,
          vibe: selectedVibe,
          palette: selectedPalette,
          memeMode,
          wantIcon
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate logos');
      }

             const data = await response.json();
       setTextVariants(data.textVariants || []);
       setAiVariants(data.aiVariants || []);
       setLogoVariants(data.textVariants || []); // Default to text variants
       setSelectedVariant((data.textVariants || [])[0]);
       
       // Handle suggested taglines
       if (data.suggestedTaglines && data.suggestedTaglines.length > 0 && !tagline) {
         // Could show tagline suggestions here
         console.log('Suggested taglines:', data.suggestedTaglines);
       }
      
    } catch (error) {
      console.error('Failed to generate logos:', error);
      // Could show error message to user
    } finally {
      setIsGenerating(false);
    }
  };



  const copyToClipboard = async (text: string, variantId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedVariant(variantId);
      setTimeout(() => setCopiedVariant(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span className="font-semibold">BrandKit Studio</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Kit
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Inputs */}
        <div className="w-80 border-r border-border p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Brand Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Brand Name</label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter brand name..."
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Tagline (Optional)</label>
                  <Textarea
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Your brand's tagline..."
                    className="w-full h-20 resize-none"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Style & Vibe</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Vibe</label>
                  <Select value={selectedVibe} onValueChange={setSelectedVibe}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VIBES.map((vibe) => (
                        <SelectItem key={vibe.value} value={vibe.value}>
                          <div>
                            <div className="font-medium">{vibe.label}</div>
                            <div className="text-xs text-muted-foreground">{vibe.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Color Palette</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_PALETTES.map((palette) => (
                      <div
                        key={palette.name}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedPalette.name === palette.name
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedPalette(palette)}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: palette.primary }}
                          />
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: palette.accent }}
                          />
                        </div>
                        <div className="text-xs font-medium">{palette.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Advanced Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Meme Mode</div>
                    <div className="text-xs text-muted-foreground">Satirical vibes & wild palettes</div>
                  </div>
                  <Button
                    variant={memeMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMemeMode(!memeMode)}
                  >
                    {memeMode ? "ON" : "OFF"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Add Icon (Beta)</div>
                    <div className="text-xs text-muted-foreground">AI-generated simple icon</div>
                  </div>
                  <Button
                    variant={wantIcon ? "default" : "outline"}
                    size="sm"
                    onClick={() => setWantIcon(!wantIcon)}
                  >
                    {wantIcon ? "ON" : "OFF"}
                  </Button>
                </div>
              </div>
            </div>

            {memeMode && (
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  Meme Mode activated! Outputs will include satirical elements and disclaimers.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              className="w-full" 
              size="lg"
              onClick={generateLogos}
              disabled={!brandName.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Logos
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Center Canvas - Previews */}
        <div className="flex-1 p-6">
          {logoVariants.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <Palette className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to create your logo?</h3>
                <p className="text-muted-foreground mb-6">
                  Enter your brand details and hit generate to see 3 unique logo variants.
                </p>
                {brandName && (
                  <Button onClick={generateLogos}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate &quot;{brandName}&quot; Logos
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Logo Variants</h2>
                <p className="text-muted-foreground mb-4">
                  Choose between text-based logos or AI-generated designs
                </p>
                
                {/* Logo Type Tabs */}
                <Tabs value={logoType} onValueChange={(value) => {
                  const logoTypeValue = value as "text" | "ai";
                  setLogoType(logoTypeValue);
                  const variants = logoTypeValue === "text" ? textVariants : aiVariants;
                  setLogoVariants(variants);
                  setSelectedVariant(variants[0] || null);
                }} className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Text Logos</TabsTrigger>
                    <TabsTrigger value="ai">AI Generated</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

                            {/* Logo Grid Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {logoVariants.map((variant) => (
                  <Card 
                    key={variant.id} 
                    className={`cursor-pointer transition-all ${
                      selectedVariant?.id === variant.id 
                        ? 'ring-2 ring-primary shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        {variant.name.replace(/^(AI |Text )?/, '')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Logo Preview */}
                      <div className={`bg-white p-2 rounded border flex items-center justify-center ${logoType === "ai" ? "min-h-[220px]" : "min-h-[140px] mb-3"}`}>
                        <div 
                          dangerouslySetInnerHTML={{ __html: variant.svg }}
                          className="w-full flex justify-center"
                          style={{ width: '200px', height: '200px', maxWidth: '200px', maxHeight: '200px' }}
                        />
                      </div>
                      
                      {/* Dark Background Preview - Only show for text logos */}
                      {logoType === "text" && (
                        <div className="bg-black p-2 rounded border flex items-center justify-center min-h-[140px]">
                          <div 
                            dangerouslySetInnerHTML={{ 
                              __html: variant.svg
                                .replace(/fill="#[^"]*"/g, 'fill="white"')
                                .replace(/stroke="#[^"]*"/g, 'stroke="white"')
                                .replace(/fill="#1a1a1a"/g, 'fill="white"')
                                .replace(/fill="#666"/g, 'fill="#ccc"')
                            }}
                            className="w-full flex justify-center"
                            style={{ width: '200px', height: '200px', maxWidth: '200px', maxHeight: '200px' }}
                          />
                        </div>
                      )}
                      
                      {/* AI Logo Note */}
                      {logoType === "ai" && (
                        <div className="text-center text-xs text-muted-foreground mt-2">
                          AI-generated logo with original colors
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Options */}
        {selectedVariant && (
          <div className="w-80 border-l border-border p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download SVG
                  </Button>
                  <Button className="w-full" variant="outline">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Brand Kit
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Logo Code</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">SVG Code</label>
                    <div className="relative">
                      <Textarea
                        value={selectedVariant.svg}
                        readOnly
                        className="font-mono text-xs h-32 resize-none"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(selectedVariant.svg, selectedVariant.id)}
                      >
                        {copiedVariant === selectedVariant.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Style Properties</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Font Family:</span>
                    <span className="font-mono">{selectedVariant.style.fontFamily}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Font Weight:</span>
                    <span className="font-mono">{selectedVariant.style.fontWeight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Letter Spacing:</span>
                    <span className="font-mono">{selectedVariant.style.letterSpacing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Text Transform:</span>
                    <span className="font-mono">{selectedVariant.style.textTransform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Primary Color:</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: selectedPalette.primary }}
                      />
                      <span className="font-mono">{selectedPalette.primary}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Studio() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading Studio...</p>
        </div>
      </div>
    }>
      <StudioContent />
    </Suspense>
  );
} 