require('dotenv').config();
const { performStartupChecks } = require('./startup-check');

// Run startup checks before loading the app
performStartupChecks();

const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Error: ' + err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = server;
