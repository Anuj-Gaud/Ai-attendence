const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fingerprint = sequelize.define('Fingerprint', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  template: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'JSON string of fingerprint template data'
  },
  quality: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  fingerIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Which finger (1-10)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'fingerprints',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = Fingerprint;