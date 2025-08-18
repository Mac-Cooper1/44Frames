# 44 Frames - Real Estate Photo to Motion Demo

A Next.js demo application that simulates a self-serve tool for converting real estate listing photos into short motion clips using AI-powered cinematic effects.

## 🚀 Features

- **Intake**: Paste Zillow/Redfin URLs or upload photos
- **Gallery & Selection**: Multi-select photos with filtering and image details
- **Prompt Composer**: Choose presets and customize prompts with variations
- **Batch Generation**: Simulated job queue with concurrency and progress tracking
- **Review & Revisions**: A/B comparison modal for clip approval/editing
- **Export**: Download approved clips as ZIP and CSV manifest
- **Subscription Status**: Billing information display

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand with localStorage persistence
- **UI Components**: Radix UI primitives with custom styling
- **Build Tool**: Turbopack for development
- **Deployment**: Vercel-ready

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🎯 Demo Flow

1. **Landing Page**: Input URL or upload photos
2. **Gallery**: Select photos for processing
3. **Prompt**: Choose cinematic presets and customize
4. **Generate**: Watch jobs process in real-time
5. **Review**: Approve, revise, or delete clips
6. **Export**: Download final assets and manifest

## 🌐 Live Demo

[Deployed on Vercel](https://your-demo-url.vercel.app)

## 📝 License

This is a demo project for demonstration purposes.
