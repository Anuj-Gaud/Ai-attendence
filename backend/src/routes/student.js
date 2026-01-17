const router = require('express').Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication and student role
router.use(authenticate);
router.use(authorize('student'));

// Attendance marking
router.post('/attendance/mark', studentController.markAttendance);
router.post('/attendance/face', studentController.markAttendanceWithFace);
router.post('/attendance/qr', studentController.markAttendanceWithQR);

// Attendance history
router.get('/attendance/history', studentController.getAttendanceHistory);
router.get('/attendance/:attendanceId', studentController.getAttendanceDetails);

// Profile management
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);

// Dashboard
router.get('/dashboard', studentController.getDashboard);

module.exports = router;
