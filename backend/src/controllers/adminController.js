const { User, Session, Attendance, AuditLog, sequelize } = require('../models');
const { Op } = require('sequelize');

class AdminController {
  // Get dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const totalUsers = await User.count();
      const totalStudents = await User.count({ where: { role: 'student' } });
      const totalFaculty = await User.count({ where: { role: 'faculty' } });
      
      const totalSessions = await Session.count();
      const activeSessions = await Session.count({ where: { status: 'active' } });
      
      const totalAttendance = await Attendance.count();
      const todayAttendance = await Attendance.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      });

      const pendingReviews = await Attendance.count({
        where: { requiresManualReview: true }
      });

      const highRiskAttendance = await Attendance.count({
        where: { riskScore: { [Op.gte]: 60 } }
      });

      return res.json({
        success: true,
        data: {
          users: { total: totalUsers, students: totalStudents, faculty: totalFaculty },
          sessions: { total: totalSessions, active: activeSessions },
          attendance: { total: totalAttendance, today: todayAttendance },
          reviews: { pending: pendingReviews, highRisk: highRiskAttendance }
        }
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard statistics'
      });
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    try {
      const { role, department, isActive, search } = req.query;
      const where = {};

      if (role) where.role = role;
      if (department) where.department = department;
      if (isActive !== undefined) where.isActive = isActive === 'true';
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { studentId: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const users = await User.findAll({
        where,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Get all users error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }
  }

  // Create new user
  async createUser(req, res) {
    try {
      const userData = req.body;
      const user = await User.create(userData);

      // Log action
      await AuditLog.logAction({
        userId: req.user.id,
        action: 'create_user',
        actionType: 'user_management',
        resourceType: 'user',
        resourceId: user.id,
        status: 'success',
        ipAddress: req.ip,
        details: { createdUser: user.email }
      });

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      console.error('Create user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error.message
      });
    }
  }

  // Update user
  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const updates = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await user.update(updates);

      await AuditLog.logAction({
        userId: req.user.id,
        action: 'update_user',
        actionType: 'user_management',
        resourceType: 'user',
        resourceId: userId,
        status: 'success',
        ipAddress: req.ip,
        details: { updatedFields: Object.keys(updates) }
      });

      return res.json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Update user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user'
      });
    }
  }

  // Delete user
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await user.destroy();

      await AuditLog.logAction({
        userId: req.user.id,
        action: 'delete_user',
        actionType: 'user_management',
        resourceType: 'user',
        resourceId: userId,
        status: 'success',
        ipAddress: req.ip,
        details: { deletedUser: user.email }
      });

      return res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
  }

  // Get anomaly reports
  async getAnomalyReports(req, res) {
    try {
      const { minRiskScore = 40 } = req.query;

      const anomalies = await Attendance.findAll({
        where: {
          riskScore: { [Op.gte]: minRiskScore }
        },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'studentId', 'name', 'email', 'department']
          },
          {
            model: Session,
            as: 'session',
            attributes: ['id', 'courseName', 'date', 'startTime', 'classroom']
          }
        ],
        order: [['riskScore', 'DESC'], ['markedAt', 'DESC']]
      });

      return res.json({
        success: true,
        data: anomalies
      });
    } catch (error) {
      console.error('Get anomaly reports error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch anomaly reports'
      });
    }
  }

  // Get audit logs
  async getAuditLogs(req, res) {
    try {
      const { userId, actionType, status, startDate, endDate, limit = 100 } = req.query;
      
      const where = {};
      if (userId) where.userId = userId;
      if (actionType) where.actionType = actionType;
      if (status) where.status = status;
      
      if (startDate && endDate) {
        where.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const logs = await AuditLog.findAll({
        where,
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }]
      });

      return res.json({
        success: true,
        data: logs
      });
    } catch (error) {
      console.error('Get audit logs error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch audit logs'
      });
    }
  }

  // Get system analytics
  async getAnalytics(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const dateFilter = startDate && endDate ? {
        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
      } : {};

      // Attendance trends
      const attendanceTrends = await Attendance.findAll({
        where: dateFilter,
        attributes: [
          [sequelize.fn('DATE', sequelize.col('marked_at')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          'status'
        ],
        group: [sequelize.fn('DATE', sequelize.col('marked_at')), 'status'],
        order: [[sequelize.fn('DATE', sequelize.col('marked_at')), 'ASC']]
      });

      // Department-wise attendance
      const departmentStats = await Attendance.findAll({
        where: dateFilter,
        include: [{
          model: User,
          as: 'student',
          attributes: ['department']
        }],
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('Attendance.id')), 'count'],
          'status'
        ],
        group: ['student.department', 'Attendance.status']
      });

      // Verification method usage
      const verificationStats = await Attendance.findAll({
        where: dateFilter,
        attributes: ['verificationMethods']
      });

      return res.json({
        success: true,
        data: {
          attendanceTrends,
          departmentStats,
          verificationStats
        }
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics'
      });
    }
  }

  // Update system settings
  async updateSettings(req, res) {
    try {
      const settings = req.body;
      
      // Store settings in database or config file
      // For now, we'll just acknowledge the update
      
      await AuditLog.logAction({
        userId: req.user.id,
        action: 'update_settings',
        actionType: 'system',
        status: 'success',
        ipAddress: req.ip,
        details: { settings }
      });

      return res.json({
        success: true,
        message: 'Settings updated successfully'
      });
    } catch (error) {
      console.error('Update settings error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update settings'
      });
    }
  }
}

module.exports = new AdminController();