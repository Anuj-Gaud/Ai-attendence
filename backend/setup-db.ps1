# Smart Attendance System - Database Setup Script (Windows)
# Run this to ensure everything is installed correctly

Write-Host "🚀 Smart Attendance System - Windows Setup Script" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

# Step 1: Install npm dependencies
Write-Host "📦 Step 1: Installing npm dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}

# Step 2: Verify better-sqlite3
Write-Host ""
Write-Host "🔍 Step 2: Verifying better-sqlite3..." -ForegroundColor Cyan
npm run check-db

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  better-sqlite3 installation failed" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "This is common on Windows with Node.js 22+. To fix:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option A - Automatic (requires admin):" -ForegroundColor White
    Write-Host "  npm install -g windows-build-tools" -ForegroundColor Gray
    Write-Host "  npm install better-sqlite3 --build-from-source" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option B - Manual steps:" -ForegroundColor White
    Write-Host "  1. Download Python 3.x from https://www.python.org" -ForegroundColor Gray
    Write-Host "  2. Install Visual Studio C++ Build Tools (free, Community edition)" -ForegroundColor Gray
    Write-Host "     https://visualstudio.microsoft.com/downloads/" -ForegroundColor Gray
    Write-Host "  3. Then run: npm install better-sqlite3" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option C - Use in-memory SQLite (fastest, no persistence):" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor Gray
    exit 1
}

Write-Host "✓ better-sqlite3 verified successfully" -ForegroundColor Green

# Step 3: Verify .env exists
Write-Host ""
Write-Host "🔍 Step 3: Checking environment file..." -ForegroundColor Cyan
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✓ .env created from .env.example" -ForegroundColor Green
        Write-Host "  Please review .env and update settings as needed" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  .env.example not found. Creating default .env..." -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ .env file found" -ForegroundColor Green
}

# Step 4: Summary
Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now run:" -ForegroundColor Cyan
Write-Host "  npm run dev              # In-memory SQLite (default, fastest)" -ForegroundColor Gray
Write-Host "  npm run dev:sqlite-file  # File-based SQLite (persistent)" -ForegroundColor Gray
Write-Host "  npm run dev:postgres     # PostgreSQL (requires local DB)" -ForegroundColor Gray
Write-Host ""
Write-Host "For more details, see DATABASE_SETUP.md" -ForegroundColor Cyan
