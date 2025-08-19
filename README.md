# 44 Frames - AI-Powered Video Creation Platform

A responsive React/Next.js web application demo for 44 Frames, an AI-powered video creation platform that turns still images into motion videos using pre-designed templates.

## Features

### 🎬 Template Library
- Browse and filter video templates by format and style
- Search functionality with real-time results
- Sort by: New, Most Used, Favorites, Highest Rated
- Responsive grid layout with template cards

### 📋 Template Details
- Right-side drawer panel with template information
- Template specifications (duration, shots, format, credits)
- Similar templates recommendations
- "Use This Template" and "Buy Credits" actions

### 🎥 Shot Setup
- Upload first and last frame images for each shot
- Select camera movement (pan, dolly, orbit, truck, zoom, static)
- Individual shot generation with AI simulation
- "Generate All" functionality for batch processing

### ✨ Clip Selection
- Review 4 generated clips per shot
- Single selection per shot with visual feedback
- Continue to video editor when all shots are selected

### 🎞️ Video Editor
- Three-panel layout: Selected Clips, Video Preview, Export Settings
- Customizable export settings (resolution, bitrate, codec, format, frame rate)
- Timeline view with ordered clips and music track
- Download functionality for final video

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **State Management**: Zustand
- **Responsive Design**: Mobile-first approach

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx          # Template Library (Figma1)
│   ├── generate/         # Shot Setup (Figma3)
│   ├── review/           # Clip Selection (Figma4)
│   └── export/           # Video Editor (Figma5)
├── components/            # Reusable UI components
│   └── TemplateDetailPanel.tsx
├── lib/                  # Utilities and data
│   ├── types.ts         # TypeScript type definitions
│   └── mockData.ts      # Sample template data
└── store/                # State management
    └── useAppStore.ts    # Zustand store
```

## Demo Flow

1. **Start**: Template Library page with filterable template grid
2. **Select**: Click template → opens detail panel → "Use This Template"
3. **Setup**: Shot Setup page for image uploads and camera movement selection
4. **Generate**: AI simulation creates 4 clips per shot
5. **Select**: Choose best clip for each shot
6. **Edit**: Video editor with export settings and timeline
7. **Download**: Final video export (placeholder MP4)

## Responsive Features

- Sidebar filters collapse to dropdown on mobile
- Template grid adapts to 1-2 columns on small screens
- Editor layout stacks vertically on mobile devices
- Touch-friendly interface elements

## Placeholder Content

- Sample images from `/public/sample-assets/images/`
- Mock video clips from `/public/sample-assets/clips/`
- AI generation simulation with loading states
- Download creates placeholder MP4 file

## Future Enhancements

- Real AI video generation integration
- User authentication and project management
- Advanced video editing tools
- Template marketplace
- Social sharing features
- Analytics and performance tracking

## License

This is a demo application for the 44 Frames platform.
