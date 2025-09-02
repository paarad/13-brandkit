# BrandKit 🎨

**Tagline:** "Spin up a clean logo and a lightweight brand kit in minutes — for real startups and spicy memes."

BrandKit is an AI-assisted, text-first logo and brand kit generator built with Next.js 14, featuring typographic logos with optional AI-generated icons via DALL·E.

## Features ✨

- **Lightning Fast**: From brand name to exported logo in under 30 seconds
- **Text-First Logos**: Reliable, accessible, production-ready typographic designs
- **6 Distinct Vibes**: Minimalist, Futuristic, Elegant, Rounded, Brutalist, Monospace
- **AI-Powered**: OpenAI integration for tagline suggestions and DALL·E icons
- **Meme Mode**: Satirical vibes with crypto/startup culture awareness
- **Complete Exports**: SVG, PNG, favicons, social cards, and brand guidelines
- **Dark/Light Ready**: All logos work on both backgrounds

## Tech Stack 🛠️

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (neutral theme)
- **AI**: OpenAI (GPT-4 + DALL·E 3)
- **TypeScript**: Full type safety
- **Deployment**: Vercel-ready

## Quick Start 🚀

1. **Clone and install:**
   ```bash
   git clone <your-repo>
   cd 13-brandkit
   npm install
   ```

2. **Environment setup:**
   Create `.env.local`:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Visit http://localhost:3000**

## Usage Flow 🎯

### Quick Logo Generation
1. **Landing** → Enter brand name → Choose vibe → **Generate**
2. **Preview** → 3 variants (Horizontal, Stacked, Accent)
3. **Export** → SVG/PNG downloads + complete brand kit

### Studio Mode
- Full customization with sidebar controls
- Real-time preview on light/dark backgrounds
- Style property inspector
- SVG code copying
- Brand kit export with guidelines

### Meme Mode 🚀
- Toggle for satirical outputs
- Crypto/startup culture taglines
- Wild color palettes
- Disclaimer banners on exports

## API Endpoints 📡

- `POST /api/generate` - Generate logo variants with OpenAI taglines
- `POST /api/icon` - DALL·E icon generation with fallbacks
- `POST /api/export` - Complete brand kit assembly

## Brand Vibes 🎭

| Vibe | Font | Weight | Case | Spacing |
|------|------|--------|------|---------|
| **Minimalist** | Inter | 300 | lowercase | 0.05em |
| **Futuristic** | Space Grotesk | 700 | UPPERCASE | 0.1em |
| **Elegant** | Playfair Display | 400 | Capitalize | 0.02em |
| **Rounded** | Nunito | 600 | lowercase | 0.03em |
| **Brutalist** | Arial Black | 900 | UPPERCASE | 0.08em |
| **Monospace** | JetBrains Mono | 500 | lowercase | 0.05em |

## Export Package 📦

Each brand kit includes:
- **Logos**: Primary/secondary variants (SVG + PNG)
- **Colors**: HEX/RGB/HSL values
- **Typography**: Font recommendations and weights
- **Assets**: Favicon + social card templates
- **Guidelines**: Usage rules and best practices

## AI Safety & IP 🛡️

- Clear disclaimers on all outputs
- Blocklist for real brand names
- Meme Mode satire banners
- OpenAI content policy compliance
- User responsibility for trademark checks

## Deployment 🌐

**Vercel (Recommended):**
1. Connect GitHub repo
2. Add `OPENAI_API_KEY` environment variable
3. Deploy automatically

**Manual:**
```bash
npm run build
npm start
```

## Development 👩‍💻

**Project Structure:**
```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── studio/page.tsx       # Logo generator
│   └── api/
│       ├── generate/route.ts # Logo generation
│       ├── icon/route.ts     # DALL·E icons
│       └── export/route.ts   # Brand kit export
├── components/ui/            # shadcn/ui components
└── lib/utils.ts             # Utility functions
```

**Key Commands:**
```bash
npm run dev          # Development server
npm run build        # Production build  
npm run lint         # ESLint check
npx shadcn add       # Add UI components
```

## Contributing 🤝

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License 📄

MIT License - see LICENSE file for details.

---

**Made for real startups and spicy memes.** 🚀💎

*BrandKit helps founders ship their logo in minutes, not weeks.*
