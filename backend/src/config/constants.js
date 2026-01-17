module.exports = {
  // User roles
  ROLES: {
    STUDENT: 'student',
    FACULTY: 'faculty',
    ADMIN: 'admin'
  },

  // Session status
  SESSION_STATUS: {
    SCHEDULED: 'scheduled',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  // Attendance status
  ATTENDANCE_STATUS: {
    PRESENT: 'present',
    ABSENT: 'absent',
    LATE: 'late',
    PARTIAL: 'partial',
    PENDING_REVIEW: 'pending_review'
  },

  // Verification methods
  VERIFICATION_METHODS: {
    FACE: 'face',
    LIVENESS: 'liveness',
    QR: 'qr',
    LOCATION: 'location',
    WIFI: 'wifi',
    BEACON: 'beacon'
  },

  // Verification scores
  VERIFICATION_SCORES: {
    QR: 25,
    FACE: 30,
    LIVENESS: 15,
    LOCATION: 20,
    WIFI: 5,
    BEACON: 5
  },

  // Thresholds
  THRESHOLDS: {
    VERIFICATION_PASS: 75,
    FACE_RECOGNITION: 0.85,
    LIVENESS: 0.75,
    GPS_ACCURACY: 20,
    CLASSROOM_RADIUS: 20,
    RISK_SCORE_HIGH: 60,
    ANOMALY_DETECTION: 40
  },

  // QR Code settings
  QR_CODE: {
    VALIDITY_SECONDS: 300,
    ROTATION_INTERVAL: 300000
  },

  // Random checks
  RANDOM_CHECKS: {
    COUNT: 3,
    TIMEOUT: 120000,
    REQUIRED_PASSES: 2
  },

  // Anomaly flags
  ANOMALY_FLAGS: {
    EDGE_MARKING: 'EDGE_MARKING',
    SHORT_DURATION: 'SHORT_DURATION',
    FAILED_RANDOM_CHECKS: 'FAILED_RANDOM_CHECKS',
    DEVICE_HOPPING: 'DEVICE_HOPPING',
    CONSISTENT_TIMING: 'CONSISTENT_TIMING',
    BATCH_MARKING: 'BATCH_MARKING',
    REMOTE_MARKING: 'REMOTE_MARKING'
  },

  // Action types for audit logs
  ACTION_TYPES: {
    AUTH: 'auth',
    ATTENDANCE: 'attendance',
    SESSION: 'session',
    USER_MANAGEMENT: 'user_management',
    SYSTEM: 'system'
  },

  // HTTP status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },

  // File upload
  FILE_UPLOAD: {
    MAX_SIZE: 10485760, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf']
  },

  // Cache TTL (seconds)
  CACHE_TTL: {
    FACE_EMBEDDING: 86400, // 24 hours
    QR_CODE: 300, // 5 minutes
    SESSION: 3600, // 1 hour
    USER_PROFILE: 1800 // 30 minutes
  },

  // Error messages
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access denied',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation failed',
    SERVER_ERROR: 'Internal server error',
    TOKEN_EXPIRED: 'Token has expired',
    QR_EXPIRED: 'QR code has expired',
    ATTENDANCE_WINDOW_CLOSED: 'Attendance window is closed',
    ALREADY_MARKED: 'Attendance already marked',
    VERIFICATION_FAILED: 'Verification failed',
    FACE_NOT_DETECTED: 'Face not detected',
    LOCATION_VERIFICATION_FAILED: 'Location verification failed',
    LIVENESS_CHECK_FAILED: 'Liveness check failed'
  },

  // Success messages
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'Registration successful',
    ATTENDANCE_MARKED: 'Attendance marked successfully',
    SESSION_CREATED: 'Session created successfully',
    SESSION_STARTED: 'Session started successfully',
    SESSION_ENDED: 'Session ended successfully',
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_CHANGED: 'Password changed successfully'
  }
};