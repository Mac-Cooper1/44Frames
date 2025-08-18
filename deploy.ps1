# Deploy script for 44 Frames Real Estate Demo
# This script prepares the project for Vercel deployment

Write-Host "🚀 Preparing 44 Frames Real Estate Demo for deployment..." -ForegroundColor Green

# Check if vercel CLI is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Blue
vercel --prod

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "Your demo is now live on Vercel!" -ForegroundColor Cyan
