const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
    field: 'student_id'
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'faculty', 'admin'),
    defaultValue: 'student',
    allowNull: false
  },
  department: {
    type: DataTypes.STRING(100)
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
  phoneNumber: {
    type: DataTypes.STRING(15),
    field: 'phone_number'
  },
  profilePhoto: {
    type: DataTypes.TEXT,
    field: 'profile_photo'
  },
  idCardNumber: {
    type: DataTypes.STRING(50),
    unique: true,
    field: 'id_card_number'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_email_verified'
  },
  lastLogin: {
    type: DataTypes.DATE,
    field: 'last_login'
  },
  deviceFingerprints: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'device_fingerprints'
  },
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

User.prototype.addDeviceFingerprint = async function(fingerprint) {
  const fingerprints = this.deviceFingerprints || [];
  
  // Keep only last 5 devices
  if (!fingerprints.includes(fingerprint)) {
    fingerprints.push(fingerprint);
    if (fingerprints.length > 5) {
      fingerprints.shift();
    }
    this.deviceFingerprints = fingerprints;
    await this.save();
  }
};

module.exports = User;