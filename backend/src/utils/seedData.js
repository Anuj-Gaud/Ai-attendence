const { User } = require('../models');
const logger = require('./logger');

const defaultUsers = [
  {
    studentId: 'STU001',
    email: 'student@test.com',
    password: 'password123',
    name: 'John Student',
    department: 'Computer Science',
    role: 'student'
  },
  {
    studentId: 'FAC001',
    email: 'faculty@test.com',
    password: 'password123',
    name: 'Jane Faculty',
    department: 'Computer Science',
    role: 'faculty'
  },
  {
    studentId: 'ADM001',
    email: 'admin@test.com',
    password: 'password123',
    name: 'Admin User',
    department: 'Administration',
    role: 'admin'
  }
];

const seedDatabase = async () => {
  try {
    // Check if users already exist
    const userCount = await User.count();
    
    if (userCount === 0) {
      logger.info('🌱 Seeding database with default users...');
      
      for (const userData of defaultUsers) {
        await User.create(userData);
        logger.info(`✓ Created ${userData.role}: ${userData.email}`);
      }
      
      logger.info('✓ Database seeding completed!');
      logger.info('\n╔════════════════════════════════════════════════════════╗');
      logger.info('║           Default Login Credentials                   ║');
      logger.info('╠════════════════════════════════════════════════════════╣');
      logger.info('║  Student:                                              ║');
      logger.info('║    Email: student@test.com                             ║');
      logger.info('║    Password: password123                               ║');
      logger.info('║                                                        ║');
      logger.info('║  Faculty:                                              ║');
      logger.info('║    Email: faculty@test.com                             ║');
      logger.info('║    Password: password123                               ║');
      logger.info('║                                                        ║');
      logger.info('║  Admin:                                                ║');
      logger.info('║    Email: admin@test.com                               ║');
      logger.info('║    Password: password123                               ║');
      logger.info('╚════════════════════════════════════════════════════════╝\n');
    } else {
      logger.info(`✓ Database already has ${userCount} user(s)`);
    }
  } catch (error) {
    logger.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
