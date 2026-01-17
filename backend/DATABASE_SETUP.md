## Database Configuration Guide

### Current Setup

Your project is configured to use **better-sqlite3** for development and **PostgreSQL** for production.

**Current .env settings:**
```
USE_MEMORY_DB=true        # In-memory SQLite (no data persistence)
USE_SQLITE_DB=false       # File-based SQLite (data persists)
```

---

## Installation Instructions

### Option 1: In-Memory SQLite (Fastest - Recommended for Development)

**Already configured!** Just run:
```bash
npm run dev
```

✓ No external services needed
✓ Fastest startup
✓ Data cleared on restart
✓ Perfect for testing

---

### Option 2: File-Based SQLite (Persists Data)

Update `.env`:
```dotenv
USE_MEMORY_DB=false
USE_SQLITE_DB=true
```

Then run:
```bash
npm run dev:sqlite-file
```

✓ Data persists in `attendance.db`
✓ Still no external services
✓ Suitable for development

---

### Option 3: PostgreSQL (Production)

Install PostgreSQL locally or use Docker:
```bash
# Using Docker
docker run --name attendance-db \
  -e POSTGRES_DB=attendance_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

Update `.env`:
```dotenv
USE_MEMORY_DB=false
USE_SQLITE_DB=false
DB_HOST=localhost
DB_PORT=5432
DB_NAME=attendance_db
DB_USER=postgres
DB_PASSWORD=password
```

Then run:
```bash
npm run dev:postgres
```

---

## Troubleshooting: better-sqlite3 Installation Issues

### Issue: "error MSB3073" on Windows with Node 22+

**Root Cause:** better-sqlite3 needs to build native modules on Windows.

**Solution:**

1. **Install prerequisites:**
   ```bash
   npm install -g node-gyp
   npm install -g windows-build-tools
   ```

2. **Or manually ensure you have:**
   - Python 3.x (in PATH)
   - Visual Studio C++ Build Tools (Community edition is free)

3. **Reinstall:**
   ```bash
   npm install better-sqlite3 --build-from-source
   ```

4. **If that fails, try:**
   ```bash
   npm remove better-sqlite3
   npm install better-sqlite3@12.6.0
   ```

### Issue: "Error: Please install sqlite3 package manually"

Run:
```bash
npm install better-sqlite3
```

If it still fails, check:
```bash
npm run check-db
```

---

## Available npm Scripts

```bash
npm run dev              # Start with auto-detected DB (default: SQLite in-memory)
npm run dev:sqlite-memory  # Explicit in-memory SQLite
npm run dev:sqlite-file    # File-based SQLite
npm run dev:postgres       # PostgreSQL
npm run check-db        # Verify better-sqlite3 is installed
npm start               # Production start (no reload)
npm test                # Run tests
```

---

## Environment Variables Reference

```dotenv
# Database Mode (choose one combination)
USE_MEMORY_DB=true          # Use in-memory SQLite
USE_SQLITE_DB=false         # Use file-based SQLite

# PostgreSQL (only if both above are false)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=attendance_db
DB_USER=postgres
DB_PASSWORD=your_password

# Server
NODE_ENV=development
PORT=5000

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## Verification Checklist

- [ ] `npm install` completed without errors
- [ ] `npm run check-db` shows `✓ better-sqlite3 is installed`
- [ ] `.env` file exists with proper DB settings
- [ ] `npm run dev` starts without crashes
- [ ] Server logs show `✓ Database connection verified`
- [ ] `http://localhost:5000/health` returns `200 OK`

---

## What's Included

✓ Automatic database driver validation at startup
✓ Clear error messages if dependencies are missing
✓ Fallback support (PostgreSQL → SQLite)
✓ Multiple npm scripts for different configurations
✓ Startup check script that logs all information

Run `npm run dev` and it will automatically:
1. Check if better-sqlite3 is installed
2. Validate environment configuration
3. Test database connection
4. Sync database models
5. Start the server with live reload

