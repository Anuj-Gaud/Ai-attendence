## FIXED DATABASE.JS - Complete Code

```javascript
const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Configuration constants
const isDevelopment = process.env.NODE_ENV === 'development';
const useMemory = isDevelopment && process.env.USE_MEMORY_DB === 'true';
const useSQLite = isDevelopment && process.env.USE_SQLITE_DB === 'true';
const dbPath = path.join(__dirname, '../../attendance.db');

// Database driver availability check
let dialectModule = null;
let selectedDialect = 'unknown';

const getDialectModule = () => {
  if (useMemory || useSQLite) {
    // Try better-sqlite3 first
    try {
      dialectModule = require('better-sqlite3');
      selectedDialect = 'better-sqlite3';
      return dialectModule;
    } catch (error) {
      console.error('✗ better-sqlite3 not found. Install with: npm install better-sqlite3');
      throw new Error(
        `Database driver missing: better-sqlite3\n` +
        `Install it with: npm install better-sqlite3\n` +
        `On Windows Node 22+, ensure you have:\n` +
        `  - Node-gyp: npm install -g node-gyp\n` +
        `  - Python 3.x in PATH\n` +
        `  - C++ build tools (Visual Studio Build Tools)`
      );
    }
  }
  return null;
};

// Initialize Sequelize based on configuration
let sequelize;

try {
  if (useMemory) {
    dialectModule = getDialectModule();
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
      dialectModule: dialectModule,
      storage: ':memory:',
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    });
    console.log('✓ Initialized: In-memory SQLite database');
  } else if (useSQLite) {
    dialectModule = getDialectModule();
    sequelize = new Sequelize(`sqlite:${dbPath}`, {
      logging: false,
      dialectModule: dialectModule,
      storage: dbPath,
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    });
    console.log(`✓ Initialized: File-based SQLite database at ${dbPath}`);
  } else {
    // PostgreSQL configuration
    sequelize = new Sequelize(
      process.env.DB_NAME || 'attendance_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: isDevelopment ? console.log : false,
        pool: {
          max: parseInt(process.env.DB_POOL_MAX) || 20,
          min: parseInt(process.env.DB_POOL_MIN) || 5,
          acquire: 30000,
          idle: 10000
        },
        dialectOptions: {
          supportBigNumbers: true,
          bigNumberStrings: true
        },
        define: {
          timestamps: true,
          underscored: true,
          freezeTableName: true
        }
      }
    );
    console.log('✓ Initialized: PostgreSQL database');
  }
} catch (error) {
  console.error('✗ Failed to initialize database:', error.message);
  process.exit(1);
}

// Test connection with proper error handling
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    if (useMemory) {
      console.log('✓ Database connection verified (SQLite in-memory).');
    } else if (useSQLite) {
      console.log(`✓ Database connection verified (SQLite file: ${dbPath}).`);
    } else {
      console.log('✓ Database connection verified (PostgreSQL).');
    }
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    
    // In development, attempt fallback to SQLite memory
    if (isDevelopment && !useMemory && !useSQLite) {
      console.warn('\n⚠ PostgreSQL unavailable. Attempting fallback to SQLite...\n');
      try {
        dialectModule = require('better-sqlite3');
        sequelize = new Sequelize('sqlite::memory:', {
          logging: false,
          dialectModule: dialectModule,
          define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
          }
        });
        await sequelize.authenticate();
        console.log('✓ Fallback to in-memory SQLite successful');
        return true;
      } catch (fallbackError) {
        console.error('✗ Fallback failed:', fallbackError.message);
        process.exit(1);
      }
    } else {
      // Production or SQLite already configured - fail hard
      console.error('\n✗ Cannot establish database connection. Exiting.\n');
      process.exit(1);
    }
  }
};

// Sync models (use migrations in production)
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force, alter: !force });
    console.log('✓ Database models synchronized successfully.');
    return true;
  } catch (error) {
    console.error('✗ Database sync failed:', error.message);
    if (!isDevelopment) {
      throw error;
    }
    return false;
  }
};

// Export configuration
module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  isDevelopment,
  dbDialect: useMemory ? 'sqlite-memory' : useSQLite ? 'sqlite-file' : 'postgresql'
};
```

---

## FIXED PACKAGE.JSON - Scripts Section

```json
  "scripts": {
    "check-db": "node -e \"try { require('better-sqlite3'); console.log('✓ better-sqlite3 is installed'); } catch(e) { console.error('✗ better-sqlite3 not found'); process.exit(1); }\"",
    "start": "cross-env NODE_ENV=production node src/server.js",
    "dev": "npm run check-db && cross-env NODE_ENV=development USE_MEMORY_DB=true nodemon src/server.js",
    "dev:sqlite-file": "npm run check-db && cross-env NODE_ENV=development USE_MEMORY_DB=false USE_SQLITE_DB=true nodemon src/server.js",
    "dev:sqlite-memory": "npm run check-db && cross-env NODE_ENV=development USE_MEMORY_DB=true nodemon src/server.js",
    "dev:postgres": "npm run check-db && cross-env NODE_ENV=development USE_MEMORY_DB=false USE_SQLITE_DB=false nodemon src/server.js",
    "test": "jest --coverage",
    "migrate": "node scripts/migrate.js",
    "seed": "node scripts/seed.js"
  },
  "dependencies": {
    "@tensorflow/tfjs-node": "^4.15.0",
    "axios": "^1.6.2",
    "bcryptjs": "^2.4.3",
    "better-sqlite3": "^12.6.0",
    "cors": "^2.8.5",
    "crypto-js": "^4.2.0",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "face-api.js": "^0.22.2",
    "geolib": "^3.3.4",
    "helmet": "^7.1.0",
    "ioredis": "^5.3.2",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "node-cache": "^5.1.2",
    "pg": "^8.11.3",
    "pg-hstore": "^2.3.4",
    "qrcode": "^1.5.3",
    "redis": "^4.6.11",
    "sequelize": "^6.35.2",
    "sharp": "^0.33.1",
    "socket.io": "^4.6.2",
    "uuid": "^9.0.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "cross-env": "^7.0.3",
    "eslint": "^8.55.0",
    "jest": "^29.7.0",
    "nodemon": "^3.0.2",
    "prettier": "^3.1.1",
    "supertest": "^6.3.3"
  },
```

---

## Exact Installation Commands to Run

```powershell
# In PowerShell, navigate to backend
Set-Location "d:\hackathon\backend"

# Install all dependencies
npm install

# Verify installation
npm run check-db

# Start development
npm run dev
```

---

## Environment Variables (.env)

Your `.env` file should have:

```dotenv
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1
FRONTEND_URL=http://localhost:3000

# Database Configuration - Use SQLite for development
# Set USE_MEMORY_DB=true for in-memory database (faster, data lost on restart)
# Set USE_SQLITE_DB=true for file-based database (persists data)
# Leave both false to use PostgreSQL
USE_MEMORY_DB=true
USE_SQLITE_DB=false

# PostgreSQL (only needed if USE_MEMORY_DB=false and USE_SQLITE_DB=false)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=attendance_db
DB_USER=postgres
DB_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_change_this_in_production_12345
JWT_REFRESH_EXPIRES_IN=30d

# Encryption
ENCRYPTION_KEY=your_32_character_encryption_key_here_1234567
```

---

## Expected Output When Running `npm run dev`

```
> smart-attendance-backend@1.0.0 dev
> npm run check-db && cross-env NODE_ENV=development USE_MEMORY_DB=true nodemon src/server.js

> smart-attendance-backend@1.0.0 check-db
> node -e "try { require('better-sqlite3'); console.log('✓ better-sqlite3 is installed'); } catch(e) { console.error('✗ better-sqlite3 not found'); process.exit(1); }"

✓ better-sqlite3 is installed

[nodemon] 3.1.11
[nodemon] watching path(s): *.*
[nodemon] starting `node src/server.js`

╔════════════════════════════════════════════════════════╗
║         Smart Attendance System - Startup Check       ║
╚════════════════════════════════════════════════════════╝

🔍 Checking critical dependencies...

  ✓ express
  ✓ sequelize
  ✓ dotenv
  ✓ better-sqlite3
  ✓ bcryptjs
  ✓ jsonwebtoken
  ✓ cors
  ✓ helmet
  ✓ morgan
  ✓ winston
  ✓ ioredis

🔍 Checking database configuration...

  ✓ Database: In-memory SQLite (development)

╔════════════════════════════════════════════════════════╗
║  ✓ All critical dependencies are installed!           ║
║  Ready to start the server...                         ║
╚════════════════════════════════════════════════════════╝

✓ Initialized: In-memory SQLite database
info: Server running on port 5000
```

If you see this, you're good to go!

