export const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin'
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  PENDING_REVIEW: 'pending_review'
};

export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  
  // Student
  MARK_ATTENDANCE: '/student/attendance',
  ATTENDANCE_HISTORY: '/student/attendance/history',
  UPCOMING_SESSIONS: '/student/sessions/upcoming',
  
  // Faculty
  CREATE_SESSION: '/faculty/sessions',
  MY_SESSIONS: '/faculty/sessions',
  GENERATE_QR: '/faculty/sessions/:id/qr/generate',
  SESSION_REPORT: '/faculty/sessions/:id/report',
  
  // Admin
  USERS: '/admin/users',
  DASHBOARD_STATS: '/admin/dashboard/stats',
  ANOMALIES: '/admin/anomalies',
  AUDIT_LOGS: '/admin/audit-logs'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STUDENT_DASHBOARD: '/student',
  STUDENT_ATTENDANCE: '/student/attendance/:id',
  FACULTY_DASHBOARD: '/faculty',
  ADMIN_DASHBOARD: '/admin'
};

export const VERIFICATION_METHODS = {
  FACE: 'Face Recognition',
  LIVENESS: 'Liveness Detection',
  QR: 'QR Code',
  LOCATION: 'GPS Location',
  WIFI: 'WiFi',
  BEACON: 'Bluetooth Beacon'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.'
};

export const SUCCESS_MESSAGES = {
  ATTENDANCE_MARKED: 'Attendance marked successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
};

export const COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#6366F1'
};

export default {
  ROLES,
  ATTENDANCE_STATUS,
  SESSION_STATUS,
  API_ENDPOINTS,
  ROUTES,
  VERIFICATION_METHODS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  COLORS
};