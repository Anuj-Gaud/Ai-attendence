const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'session_id',
    references: {
      model: 'sessions',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'partial', 'pending_review'),
    defaultValue: 'pending_review'
  },
  markedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'marked_at'
  },
  
  // Verification Details
  verificationMethods: {
    type: DataTypes.JSONB,
    defaultValue: {},
    field: 'verification_methods',
    comment: 'Tracks which verification methods were used: face, qr, location, wifi, beacon'
  },
  verificationScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    field: 'verification_score',
    comment: 'Overall verification score out of 100'
  },
  confidenceScores: {
    type: DataTypes.JSONB,
    defaultValue: {},
    field: 'confidence_scores',
    comment: 'Individual confidence scores for each verification method'
  },
  
  // Location Data
  location: {
    type: DataTypes.JSONB,
    comment: 'GPS coordinates, accuracy, altitude'
  },
  distanceFromClassroom: {
    type: DataTypes.FLOAT,
    field: 'distance_from_classroom',
    comment: 'Distance in meters from classroom center'
  },
  
  // Device Information
  deviceInfo: {
    type: DataTypes.JSONB,
    field: 'device_info',
    comment: 'Device fingerprint, IP, user agent'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    field: 'ip_address'
  },
  
  // WiFi & Beacon Data
  wifiNetworks: {
    type: DataTypes.JSONB,
    field: 'wifi_networks',
    comment: 'Detected WiFi access points'
  },
  bluetoothBeacons: {
    type: DataTypes.JSONB,
    field: 'bluetooth_beacons',
    comment: 'Detected Bluetooth beacons'
  },
  
  // QR Code Data
  qrToken: {
    type: DataTypes.STRING(255),
    field: 'qr_token',
    comment: 'QR code token that was scanned'
  },
  qrScanTime: {
    type: DataTypes.DATE,
    field: 'qr_scan_time'
  },
  
  // Face Recognition Data
  faceMatchConfidence: {
    type: DataTypes.FLOAT,
    field: 'face_match_confidence'
  },
  livenessScore: {
    type: DataTypes.FLOAT,
    field: 'liveness_score'
  },
  faceImageUrl: {
    type: DataTypes.TEXT,
    field: 'face_image_url',
    comment: 'S3 URL or local path to captured face image'
  },
  
  // Random Presence Checks
  randomChecks: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'random_checks',
    comment: 'Array of random verification checks performed during class'
  },
  randomChecksPassed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'random_checks_passed'
  },
  randomChecksFailed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'random_checks_failed'
  },
  
  // Manual Review
  requiresManualReview: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'requires_manual_review'
  },
  manualReviewReason: {
    type: DataTypes.TEXT,
    field: 'manual_review_reason'
  },
  reviewedBy: {
    type: DataTypes.UUID,
    field: 'reviewed_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reviewedAt: {
    type: DataTypes.DATE,
    field: 'reviewed_at'
  },
  reviewNotes: {
    type: DataTypes.TEXT,
    field: 'review_notes'
  },
  
  // Anomaly Flags
  anomalyFlags: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'anomaly_flags',
    comment: 'Array of detected anomalies'
  },
  riskScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'risk_score',
    comment: 'Risk score for proxy detection (0-100)'
  },
  
  // Timestamps
  entryTime: {
    type: DataTypes.DATE,
    field: 'entry_time',
    comment: 'When student entered classroom'
  },
  exitTime: {
    type: DataTypes.DATE,
    field: 'exit_time',
    comment: 'When student left classroom'
  },
  
  metadata: {
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
  tableName: 'attendance',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['session_id'] },
    { fields: ['status'] },
    { fields: ['marked_at'] },
    { fields: ['requires_manual_review'] },
    { fields: ['risk_score'] },
    { unique: true, fields: ['user_id', 'session_id'] }
  ]
});

// Instance methods
Attendance.prototype.markAsPresent = async function() {
  this.status = 'present';
  this.entryTime = new Date();
  await this.save();
};

Attendance.prototype.addRandomCheck = async function(checkData) {
  const checks = this.randomChecks || [];
  checks.push({
    timestamp: new Date(),
    ...checkData
  });
  
  if (checkData.passed) {
    this.randomChecksPassed += 1;
  } else {
    this.randomChecksFailed += 1;
  }
  
  this.randomChecks = checks;
  await this.save();
};

Attendance.prototype.calculateDuration = function() {
  if (!this.entryTime || !this.exitTime) return null;
  return (this.exitTime - this.entryTime) / 1000 / 60; // minutes
};

module.exports = Attendance;