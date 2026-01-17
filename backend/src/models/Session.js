const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sessionCode: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
    field: 'session_code'
  },
  facultyId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'faculty_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  courseName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'course_name'
  },
  courseCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'course_code'
  },
  classroom: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  department: {
    type: DataTypes.STRING(100)
  },
  semester: {
    type: DataTypes.INTEGER
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'start_time'
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'end_time'
  },
  sessionType: {
    type: DataTypes.ENUM('lecture', 'lab', 'tutorial', 'exam'),
    defaultValue: 'lecture',
    field: 'session_type'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'active', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  totalStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_students'
  },
  presentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'present_count'
  },
  absentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'absent_count'
  },
  attendanceWindowStart: {
    type: DataTypes.DATE,
    field: 'attendance_window_start'
  },
  attendanceWindowEnd: {
    type: DataTypes.DATE,
    field: 'attendance_window_end'
  },
  currentQRToken: {
    type: DataTypes.STRING(255),
    field: 'current_qr_token'
  },
  qrGeneratedAt: {
    type: DataTypes.DATE,
    field: 'qr_generated_at'
  },
  randomChecksScheduled: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'random_checks_scheduled'
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      requireQRScan: true,
      requireGeofencing: true,
      requireWiFi: false,
      requireBeacon: false,
      allowLateEntry: false,
      lateEntryMinutes: 10
    }
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
  tableName: 'sessions',
  timestamps: true,
  indexes: [
    { fields: ['faculty_id'] },
    { fields: ['date'] },
    { fields: ['classroom'] },
    { fields: ['status'] },
    { fields: ['course_code'] }
  ]
});

// Instance methods
Session.prototype.isActive = function() {
  return this.status === 'active';
};

Session.prototype.canMarkAttendance = function() {
  const now = new Date();
  return (
    this.status === 'active' &&
    this.attendanceWindowStart &&
    this.attendanceWindowEnd &&
    now >= this.attendanceWindowStart &&
    now <= this.attendanceWindowEnd
  );
};

Session.prototype.updateAttendanceCount = async function() {
  const Attendance = require('./Attendance');
  
  const stats = await Attendance.count({
    where: { sessionId: this.id },
    group: ['status']
  });
  
  this.presentCount = stats.present || 0;
  this.absentCount = stats.absent || 0;
  await this.save();
};

module.exports = Session;