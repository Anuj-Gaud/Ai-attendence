const { validationResult, body } = require('express-validator');

// Generic validation result handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation for marking attendance
exports.validateMarkAttendance = [
  body('qrData').notEmpty().withMessage('QR data is required'),
  body('location').isObject().withMessage('Location data is required'),
  body('location.lat').isFloat().withMessage('Valid latitude required'),
  body('location.lng').isFloat().withMessage('Valid longitude required'),
  body('location.accuracy').isFloat().withMessage('GPS accuracy required'),
  body('deviceInfo').optional().isObject(),
  exports.validate
];

// Validation for session creation
exports.validateCreateSession = [
  body('courseName').notEmpty().withMessage('Course name is required'),
  body('courseCode').notEmpty().withMessage('Course code is required'),
  body('classroom').notEmpty().withMessage('Classroom is required'),
  body('date').isDate().withMessage('Valid date required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time required (HH:MM)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time required (HH:MM)'),
  exports.validate
];

// Validation for attendance review
exports.validateReviewAttendance = [
  body('decision').isIn(['approve', 'reject']).withMessage('Decision must be approve or reject'),
  body('notes').optional().isString(),
  exports.validate
];