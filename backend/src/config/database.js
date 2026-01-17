const { Sequelize } = require('sequelize');
const path = require('path');

function ensureSqliteInstalled() {
  try {
    require('sqlite3');
  } catch (err) {
    console.error('\n❌ sqlite3 is not installed.');
    console.error('Run: npm install sqlite3\n');
    process.exit(1);
  }
}

ensureSqliteInstalled();

const useMemory = process.env.USE_MEMORY_DB === 'true';

const storage = useMemory
  ? ':memory:'
  : path.resolve(process.env.DB_STORAGE || './dev.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false
});

module.exports = sequelize;
