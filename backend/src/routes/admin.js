const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/analytics', adminController.getAnalytics);

// User management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);

// Anomaly detection
router.get('/anomalies', adminController.getAnomalyReports);

// Audit logs
router.get('/audit-logs', adminController.getAuditLogs);

// System settings
router.put('/settings', adminController.updateSettings);

module.exports = router;