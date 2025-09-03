"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Zap, Download, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [brandName, setBrandName] = useState("");

  const handleTryIt = () => {
    if (brandName.trim()) {
      window.location.href = `/studio?name=${encodeURIComponent(brandName)}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-6 w-6" />
            <span className="font-bold text-xl">BrandKit</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#examples" className="text-muted-foreground hover:text-foreground">
              Examples
            </Link>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Spin up a clean logo and a lightweight brand kit in{" "}
            <span className="text-primary">minutes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            For real startups and spicy memes. AI-assisted, text-first logo generation 
            with optional icons. Export SVG, PNG, and complete brand kits instantly.
          </p>
          
          {/* Try It Form */}
          <div className="max-w-md mx-auto mb-12">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your brand name..."
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTryIt()}
                className="text-lg"
              />
              <Button 
                onClick={handleTryIt}
                disabled={!brandName.trim()}
                size="lg"
                className="px-8"
              >
                Try It
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Free • No signup required • 30 seconds to logo
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="bg-muted rounded-full px-4 py-2 text-sm font-medium">
              ⚡ Text-first logos
            </div>
            <div className="bg-muted rounded-full px-4 py-2 text-sm font-medium">
              🎨 AI-generated icons
            </div>
            <div className="bg-muted rounded-full px-4 py-2 text-sm font-medium">
              📦 Complete brand kits
            </div>
            <div className="bg-muted rounded-full px-4 py-2 text-sm font-medium">
              😂 Meme mode
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need for your brand
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  From brand name to exported logo in under 30 seconds. 
                  No complex design tools needed.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Palette className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Smart Generation</CardTitle>
                <CardDescription>
                  AI-powered typography with optional DALL-E icons. 
                  Multiple variants, perfect for any vibe.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Download className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Production Ready</CardTitle>
                <CardDescription>
                  Export SVG, PNG, favicons, and social cards. 
                  Everything you need to launch.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Gallery */}
      <section id="examples" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Professional logos in every style
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            From Fortune 500 minimalism to viral meme brands. Our AI adapts to your vibe.
          </p>

          {/* Clean grid showcase */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {/* Minimal */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                <div className="text-xl font-light tracking-wide text-gray-900">Acme</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Minimal</div>
                <div className="text-xs text-muted-foreground">Clean & simple</div>
              </div>
            </div>

            {/* Futuristic */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-black rounded-lg p-6 flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                <div className="text-xl font-bold tracking-wider text-white">NEXUS</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Futuristic</div>
                <div className="text-xs text-muted-foreground">Tech & bold</div>
              </div>
            </div>

            {/* Elegant */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-6 flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                <div className="text-xl font-serif text-amber-900">Luxe</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Elegant</div>
                <div className="text-xs text-muted-foreground">Luxury & refined</div>
              </div>
            </div>

            {/* Playful */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200 rounded-lg p-6 flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                <div className="text-lg font-bold text-purple-600 bg-purple-100 rounded-full px-3 py-1">bubble</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Playful</div>
                <div className="text-xs text-muted-foreground">Fun & friendly</div>
              </div>
            </div>

            {/* Brutalist */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gray-100 border-4 border-black rounded-lg p-6 flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                <div className="text-xl font-black">BRICK</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Brutalist</div>
                <div className="text-xs text-muted-foreground">Bold & edgy</div>
              </div>
            </div>

            {/* Meme */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-6 flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                <div className="text-center text-white">
                  <div className="text-lg font-black">HODL</div>
                  <div className="text-xs">💎🙌</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Meme</div>
                <div className="text-xs text-muted-foreground">Viral & spicy</div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              + dozens more styles. Our AI understands your brand personality.
            </p>
            <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Try Your Brand Now
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to build your brand?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of founders who shipped their logo in minutes, not weeks.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="px-8"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Get Started Free
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Palette className="h-5 w-5" />
              <span className="font-semibold">BrandKit</span>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Support
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 text-muted-foreground">
            <p>© 2024 BrandKit. Made for real startups and spicy memes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
