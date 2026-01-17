/**
 * Startup Check Script
 * Verifies all critical dependencies are installed before server starts
 */

const fs = require('fs');
const path = require('path');

const checks = {
  'express': () => require('express'),
  'sequelize': () => require('sequelize'),
  'dotenv': () => require('dotenv'),
  'sqlite3': () => require('sqlite3'),
  'bcryptjs': () => require('bcryptjs'),
  'jsonwebtoken': () => require('jsonwebtoken'),
  'cors': () => require('cors'),
  'helmet': () => require('helmet'),
  'morgan': () => require('morgan'),
  'winston': () => require('winston'),
  'ioredis': () => require('ioredis'),
};

const optionalChecks = {
  'nodemon': () => require('nodemon'),
  'jest': () => require('jest'),
};

function performStartupChecks() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║         Smart Attendance System - Startup Check       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  let allChecksPassed = true;

  // Check critical dependencies
  console.log('🔍 Checking critical dependencies...\n');
  for (const [pkg, checker] of Object.entries(checks)) {
    try {
      checker();
      console.log(`  ✓ ${pkg}`);
    } catch (error) {
      console.error(`  ✗ ${pkg} - NOT INSTALLED`);
      allChecksPassed = false;
    }
  }

  // Check optional dependencies (warn only, don't block startup)
  console.log('\n🔍 Checking optional dependencies...\n');
  for (const [pkg, checker] of Object.entries(optionalChecks)) {
    try {
      checker();
      console.log(`  ✓ ${pkg}`);
    } catch (error) {
      console.log(`  ⚠ ${pkg} (optional, dev only)`);
    }
  }

  // Check environment file
  console.log('\n🔍 Checking configuration files...\n');
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    console.log('  ✓ .env file found');
  } else {
    console.log('  ⚠ .env file not found (will use defaults)');
  }

  // Check database configuration
  console.log('\n🔍 Checking database configuration...\n');
  const useMemory = process.env.USE_MEMORY_DB === 'true';
  const useSQLite = process.env.USE_SQLITE_DB === 'true';
  const isProd = process.env.NODE_ENV === 'production';

  if (useMemory) {
    console.log('  ✓ Database: In-memory SQLite (development)');
  } else if (useSQLite) {
    console.log('  ✓ Database: File-based SQLite (development)');
  } else if (isProd) {
    console.log('  ✓ Database: PostgreSQL (production)');
  } else {
    console.log('  ✓ Database: In-memory SQLite (default development)');
  }

  // Final status
  console.log('\n╔════════════════════════════════════════════════════════╗');
  if (allChecksPassed) {
    console.log('║  ✓ All critical dependencies are installed!           ║');
    console.log('║  Ready to start the server...                         ║');
  } else {
    console.log('║  ✗ Some critical dependencies are missing!            ║');
    console.log('║  Run: npm install                                     ║');
  }
  console.log('╚════════════════════════════════════════════════════════╝\n');

  if (!allChecksPassed) {
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  performStartupChecks();
}

module.exports = { performStartupChecks };