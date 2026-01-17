#!/bin/bash
# Smart Attendance System - Database Setup Script
# Run this to ensure everything is installed correctly

echo "🚀 Smart Attendance System - Setup Script"
echo "=========================================="
echo ""

# Step 1: Install npm dependencies
echo "📦 Step 1: Installing npm dependencies..."
npm install

# Step 2: Verify better-sqlite3
echo ""
echo "🔍 Step 2: Verifying better-sqlite3..."
npm run check-db

if [ $? -ne 0 ]; then
  echo ""
  echo "⚠️  better-sqlite3 installation failed on Windows"
  echo ""
  echo "Fix it with:"
  echo "  1. npm install -g node-gyp"
  echo "  2. npm install -g windows-build-tools"
  echo "  3. npm install better-sqlite3 --build-from-source"
  exit 1
fi

# Step 3: Verify .env exists
echo ""
echo "🔍 Step 3: Checking environment file..."
if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "✓ .env created. Please update with your settings."
else
  echo "✓ .env file found"
fi

# Step 4: Summary
echo ""
echo "✅ Setup complete! You can now run:"
echo ""
echo "  npm run dev              # In-memory SQLite (default)"
echo "  npm run dev:sqlite-file  # File-based SQLite"
echo "  npm run dev:postgres     # PostgreSQL"
echo ""
echo "For more details, see DATABASE_SETUP.md"
