"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          <h2 className="text-3xl font-bold text-center mb-12">
            Style for every vibe
          </h2>
          
          <Tabs defaultValue="minimalist" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
              <TabsTrigger value="minimalist">Minimal</TabsTrigger>
              <TabsTrigger value="futuristic">Future</TabsTrigger>
              <TabsTrigger value="elegant">Elegant</TabsTrigger>
              <TabsTrigger value="rounded">Rounded</TabsTrigger>
              <TabsTrigger value="brutalist">Brutal</TabsTrigger>
              <TabsTrigger value="meme">Meme</TabsTrigger>
            </TabsList>
            
            <TabsContent value="minimalist" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["Acme", "Stark", "Void"].map((name) => (
                  <Card key={name} className="p-8 text-center">
                    <div className="text-2xl font-light tracking-wide">{name}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="futuristic" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["NEXUS", "FLUX", "QUANTUM"].map((name) => (
                  <Card key={name} className="p-8 text-center bg-black text-white">
                    <div className="text-2xl font-bold tracking-wider">{name}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="elegant" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["Luxe", "Maison", "Atelier"].map((name) => (
                  <Card key={name} className="p-8 text-center">
                    <div className="text-2xl font-serif">{name}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="rounded" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["bubble", "happy", "friend"].map((name) => (
                  <Card key={name} className="p-8 text-center">
                    <div className="text-2xl font-bold rounded-full bg-primary text-primary-foreground px-4 py-2 inline-block">
                      {name}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="brutalist" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["BRICK", "STEEL", "CONCRETE"].map((name) => (
                  <Card key={name} className="p-8 text-center border-4 border-black">
                    <div className="text-2xl font-black">{name}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="meme" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: "HODL", tagline: "Diamond hands 💎" },
                  { name: "moon", tagline: "To the moon 🚀" },
                  { name: "WAGMI", tagline: "We're all gonna make it ✨" }
                ].map((item) => (
                  <Card key={item.name} className="p-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <div className="text-2xl font-black">{item.name}</div>
                    <div className="text-sm mt-2">{item.tagline}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
