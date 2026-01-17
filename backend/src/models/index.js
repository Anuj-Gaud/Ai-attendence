// Load the actual Sequelize instance (default export, NOT named)
const sequelize = require('../config/database');

// Import models
const User = require('./User');
const Session = require('./Session');
const Attendance = require('./Attendance');
const FaceEmbedding = require('./FaceEmbedding');
const Fingerprint = require('./Fingerprint');

// ============================
// Define Relationships
// ============================

// Faculty → Sessions
User.hasMany(Session, {
  foreignKey: 'facultyId',
  as: 'sessions',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Session.belongsTo(User, {
  foreignKey: 'facultyId',
  as: 'faculty'
});

// Student → Attendance
User.hasMany(Attendance, {
  foreignKey: 'userId',
  as: 'attendances',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Attendance.belongsTo(User, {
  foreignKey: 'userId',
  as: 'student'
});

// Session → Attendance
Session.hasMany(Attendance, {
  foreignKey: 'sessionId',
  as: 'attendances',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Attendance.belongsTo(Session, {
  foreignKey: 'sessionId',
  as: 'session'
});

// User → FaceEmbedding (1:1)
User.hasOne(FaceEmbedding, {
  foreignKey: 'userId',
  as: 'faceEmbedding',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
FaceEmbedding.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// User → Fingerprint (1:many - can have multiple fingers)
User.hasMany(Fingerprint, {
  foreignKey: 'userId',
  as: 'fingerprints',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Fingerprint.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Attendance → Reviewer (Faculty/User)
Attendance.belongsTo(User, {
  foreignKey: 'reviewedBy',
  as: 'reviewer'
});

// ============================
// Export everything
// ============================
module.exports = {
  sequelize,
  User,
  Session,
  Attendance,
  FaceEmbedding,
  Fingerprint
};
