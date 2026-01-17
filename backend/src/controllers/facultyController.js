const { Session, Attendance, User } = require('../models');
const qrCodeService = require('../services/qrCodeService');
const { Op } = require('sequelize');

class FacultyController {
  // Create new session
  async createSession(req, res) {
    try {
      const facultyId = req.user.id;
      const {
        courseName,
        courseCode,
        classroom,
        department,
        semester,
        date,
        startTime,
        endTime,
        sessionType,
        settings
      } = req.body;

      // Generate unique session code
      const sessionCode = FacultyController.generateSessionCode(courseCode, date);

      const session = await Session.create({
        sessionCode,
        facultyId,
        courseName,
        courseCode,
        classroom,
        department,
        semester,
        date,
        startTime,
        endTime,
        sessionType: sessionType || 'lecture',
        status: 'scheduled',
        settings: settings || {}
      });

      return res.status(201).json({
        success: true,
        message: 'Session created successfully',
        data: session
      });

    } catch (error) {
      console.error('Create session error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create session',
        error: error.message
      });
    }
  }

  // Start session and open attendance window
  async startSession(req, res) {
    try {
      const { sessionId } = req.params;
      const facultyId = req.user.id;

      const session = await Session.findOne({
        where: { id: sessionId, facultyId }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      // Update session status
      const now = new Date();
      session.status = 'active';
      session.attendanceWindowStart = now;
      session.attendanceWindowEnd = new Date(now.getTime() + 15 * 60000); // 15 minutes
      await session.save();

      // Generate initial QR code
      const qrResult = await qrCodeService.generateQRCode(
        sessionId,
        session.classroom
      );

      session.currentQRToken = qrResult.token;
      session.qrGeneratedAt = new Date();
      await session.save();

      return res.json({
        success: true,
        message: 'Session started successfully',
        data: {
          session,
          qrCode: qrResult.qrCodeDataURL
        }
      });

    } catch (error) {
      console.error('Start session error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to start session',
        error: error.message
      });
    }
  }

  // Generate new QR code (for rotation)
  async generateQR(req, res) {
    try {
      const { sessionId } = req.params;
      const facultyId = req.user.id;

      const session = await Session.findOne({
        where: { id: sessionId, facultyId, status: 'active' }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Active session not found'
        });
      }

      // Invalidate old QR
      if (session.currentQRToken) {
        await qrCodeService.invalidateQRCode(session.currentQRToken);
      }

      // Generate new QR
      const qrResult = await qrCodeService.generateQRCode(
        sessionId,
        session.classroom
      );

      session.currentQRToken = qrResult.token;
      session.qrGeneratedAt = new Date();
      await session.save();

      return res.json({
        success: true,
        data: {
          qrCode: qrResult.qrCodeDataURL,
          validUntil: qrResult.validUntil
        }
      });

    } catch (error) {
      console.error('Generate QR error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate QR code',
        error: error.message
      });
    }
  }

  // End session
  async endSession(req, res) {
    try {
      const { sessionId } = req.params;
      const facultyId = req.user.id;

      const session = await Session.findOne({
        where: { id: sessionId, facultyId }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      // Mark absent students
      await this.markAbsentStudents(sessionId);

      // Update session
      session.status = 'completed';
      session.attendanceWindowEnd = new Date();
      await session.save();

      // Invalidate QR code
      if (session.currentQRToken) {
        await qrCodeService.invalidateQRCode(session.currentQRToken);
      }

      return res.json({
        success: true,
        message: 'Session ended successfully',
        data: session
      });

    } catch (error) {
      console.error('End session error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to end session',
        error: error.message
      });
    }
  }

  // Get session attendance report
  async getSessionReport(req, res) {
    try {
      const { sessionId } = req.params;
      const facultyId = req.user.id;

      const session = await Session.findOne({
        where: { id: sessionId, facultyId }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      const attendance = await Attendance.findAll({
        where: { sessionId },
        include: [{
          model: User,
          as: 'student',
          attributes: ['id', 'studentId', 'name', 'email', 'department']
        }],
        order: [['markedAt', 'ASC']]
      });

      const stats = {
        total: session.totalStudents,
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        late: attendance.filter(a => a.status === 'late').length,
        pendingReview: attendance.filter(a => a.status === 'pending_review').length
      };

      return res.json({
        success: true,
        data: {
          session,
          attendance,
          stats
        }
      });

    } catch (error) {
      console.error('Get session report error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch session report',
        error: error.message
      });
    }
  }

  // Get all sessions for faculty
  async getMySessions(req, res) {
    try {
      const facultyId = req.user.id;
      const { status, startDate, endDate } = req.query;

      const where = { facultyId };

      if (status) {
        where.status = status;
      }

      if (startDate && endDate) {
        where.date = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const sessions = await Session.findAll({
        where,
        order: [['date', 'DESC'], ['startTime', 'DESC']],
        limit: 50
      });

      return res.json({
        success: true,
        data: sessions
      });

    } catch (error) {
      console.error('Get sessions error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch sessions',
        error: error.message
      });
    }
  }

  // Review pending attendance
  async reviewAttendance(req, res) {
    try {
      const { attendanceId } = req.params;
      const { decision, notes } = req.body; // decision: 'approve' or 'reject'

      const attendance = await Attendance.findByPk(attendanceId, {
        include: [{
          model: Session,
          as: 'session',
          where: { facultyId: req.user.id }
        }]
      });

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Attendance record not found'
        });
      }

      attendance.status = decision === 'approve' ? 'present' : 'absent';
      attendance.reviewedBy = req.user.id;
      attendance.reviewedAt = new Date();
      attendance.reviewNotes = notes;
      attendance.requiresManualReview = false;
      await attendance.save();

      return res.json({
        success: true,
        message: `Attendance ${decision}d successfully`,
        data: attendance
      });

    } catch (error) {
      console.error('Review attendance error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to review attendance',
        error: error.message
      });
    }
  }

  // Get pending reviews
  async getPendingReviews(req, res) {
    try {
      const facultyId = req.user.id;

      // Get all sessions for this faculty
      const sessions = await Session.findAll({
        where: { facultyId },
        attributes: ['id']
      });

      const sessionIds = sessions.map(s => s.id);

      const pendingReviews = await Attendance.findAll({
        where: {
          sessionId: { [Op.in]: sessionIds },
          requiresManualReview: true
        },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'studentId', 'name', 'email']
          },
          {
            model: Session,
            as: 'session',
            attributes: ['id', 'courseName', 'date', 'startTime']
          }
        ],
        order: [['markedAt', 'DESC']]
      });

      return res.json({
        success: true,
        data: pendingReviews
      });

    } catch (error) {
      console.error('Get pending reviews error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch pending reviews',
        error: error.message
      });
    }
  }

  // Helper: Mark absent students
  async markAbsentStudents(sessionId) {
    try {
      const session = await Session.findByPk(sessionId);
      
      // Get all enrolled students (you'll need to implement enrollment system)
      // For now, we'll just mark those who didn't mark attendance as absent
      
      const markedStudents = await Attendance.findAll({
        where: { sessionId },
        attributes: ['userId']
      });

      // Logic to mark remaining students as absent
      // This depends on your enrollment system implementation

    } catch (error) {
      console.error('Mark absent students error:', error);
    }
  }

  // Helper: Generate session code
  static generateSessionCode(courseCode, date) {
    const dateStr = new Date(date).toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${courseCode}-${dateStr}-${random}`;
  }
}

module.exports = new FacultyController();
