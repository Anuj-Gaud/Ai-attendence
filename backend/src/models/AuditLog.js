const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Action performed: login, logout, mark_attendance, etc.'
  },
  actionType: {
    type: DataTypes.ENUM('auth', 'attendance', 'session', 'user_management', 'system'),
    defaultValue: 'system',
    field: 'action_type'
  },
  resourceType: {
    type: DataTypes.STRING(50),
    field: 'resource_type',
    comment: 'Type of resource affected: user, session, attendance'
  },
  resourceId: {
    type: DataTypes.UUID,
    field: 'resource_id',
    comment: 'ID of the affected resource'
  },
  status: {
    type: DataTypes.ENUM('success', 'failure', 'warning'),
    defaultValue: 'success'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    field: 'ip_address'
  },
  userAgent: {
    type: DataTypes.TEXT,
    field: 'user_agent'
  },
  details: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional details about the action'
  },
  errorMessage: {
    type: DataTypes.TEXT,
    field: 'error_message'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'audit_logs',
  timestamps: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['action'] },
    { fields: ['action_type'] },
    { fields: ['created_at'] },
    { fields: ['status'] }
  ]
});

// Static method to log actions
AuditLog.logAction = async function(data) {
  try {
    await this.create(data);
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};

module.exports = AuditLog;