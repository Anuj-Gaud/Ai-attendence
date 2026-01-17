const router = require('express').Router();
const facultyController = require('../controllers/facultyController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication and faculty role
router.use(authenticate);
router.use(authorize('faculty', 'admin'));

// Session management
router.post('/sessions', facultyController.createSession);
router.get('/sessions', facultyController.getMySessions);
router.post('/sessions/:sessionId/start', facultyController.startSession);
router.post('/sessions/:sessionId/end', facultyController.endSession);

// QR code generation
router.post('/sessions/:sessionId/qr/generate', facultyController.generateQR);

// Reports and reviews
router.get('/sessions/:sessionId/report', facultyController.getSessionReport);
router.get('/reviews/pending', facultyController.getPendingReviews);
router.put('/attendance/:attendanceId/review', facultyController.reviewAttendance);

module.exports = router;