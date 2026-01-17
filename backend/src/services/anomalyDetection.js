const Attendance = require('../models/Attendance');
const { Op } = require('sequelize');

class AnomalyDetectionService {
  async analyzeAttendancePattern(userId, currentAttendance) {
    const flags = [];
    let riskScore = 0;

    // Get last 30 days history
    const history = await this.getAttendanceHistory(userId, 30);

    if (history.length < 5) {
      // Not enough data for pattern analysis
      return { flags: [], riskScore: 0 };
    }

    // 1. Edge Marking Detection
    const edgeMarking = this.detectEdgeMarking(history, currentAttendance);
    if (edgeMarking.detected) {
      flags.push('EDGE_MARKING');
      riskScore += 20;
    }

    // 2. Short Duration Detection
    const shortDuration = this.detectShortDuration(history);
    if (shortDuration.detected) {
      flags.push('SHORT_DURATION');
      riskScore += 25;
    }

    // 3. Failed Random Checks
    const failedChecks = this.detectFailedRandomChecks(history);
    if (failedChecks.detected) {
      flags.push('FAILED_RANDOM_CHECKS');
      riskScore += 30;
    }

    // 4. Device Hopping
    const deviceHopping = this.detectDeviceHopping(history);
    if (deviceHopping.detected) {
      flags.push('DEVICE_HOPPING');
      riskScore += 15;
    }

    // 5. Consistent Timing
    const consistentTiming = this.detectConsistentTiming(history);
    if (consistentTiming.detected) {
      flags.push('CONSISTENT_TIMING');
      riskScore += 10;
    }

    // 6. Batch Marking (multiple students same time/location)
    const batchMarking = await this.detectBatchMarking(currentAttendance);
    if (batchMarking.detected) {
      flags.push('BATCH_MARKING');
      riskScore += 25;
    }

    // 7. Remote Marking
    const remoteMarking = this.detectRemoteMarking(history);
    if (remoteMarking.detected) {
      flags.push('REMOTE_MARKING');
      riskScore += 20;
    }

    return {
      flags,
      riskScore: Math.min(riskScore, 100), // Cap at 100
      details: {
        edgeMarking,
        shortDuration,
        failedChecks,
        deviceHopping,
        consistentTiming,
        batchMarking,
        remoteMarking
      }
    };
  }

  async getAttendanceHistory(userId, days) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Attendance.findAll({
      where: {
        userId,
        createdAt: { [Op.gte]: startDate }
      },
      order: [['createdAt', 'DESC']]
    });
  }

  detectEdgeMarking(history, currentAttendance) {
    // Check if always marking from edge of geofence
    const distances = history
      .map(h => h.distanceFromClassroom)
      .filter(d => d !== null);

    if (distances.length < 3) return { detected: false };

    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    
    // If average distance > 15m (close to 20m boundary), flag it
    return {
      detected: avgDistance > 15,
      avgDistance: Math.round(avgDistance),
      threshold: 15
    };
  }

  detectShortDuration(history) {
    const durations = history
      .map(h => h.calculateDuration())
      .filter(d => d !== null);

    if (durations.length < 3) return { detected: false };

    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

    // If average class duration < 10 minutes, flag it
    return {
      detected: avgDuration < 10,
      avgDuration: Math.round(avgDuration),
      threshold: 10
    };
  }

  detectFailedRandomChecks(history) {
    const totalChecks = history.reduce((sum, h) => 
      sum + (h.randomChecksPassed || 0) + (h.randomChecksFailed || 0), 0
    );

    const failedChecks = history.reduce((sum, h) => 
      sum + (h.randomChecksFailed || 0), 0
    );

    if (totalChecks < 5) return { detected: false };

    const failureRate = failedChecks / totalChecks;

    // If failure rate > 40%, flag it
    return {
      detected: failureRate > 0.4,
      failureRate: Math.round(failureRate * 100),
      threshold: 40
    };
  }

  detectDeviceHopping(history) {
    const devices = new Set(
      history.map(h => h.deviceInfo?.fingerprint).filter(Boolean)
    );

    // If using more than 3 different devices, flag it
    return {
      detected: devices.size > 3,
      uniqueDevices: devices.size,
      threshold: 3
    };
  }

  detectConsistentTiming(history) {
    const times = history
      .map(h => {
        const date = new Date(h.markedAt);
        return date.getHours() * 60 + date.getMinutes();
      })
      .filter(t => t !== null);

    if (times.length < 5) return { detected: false };

    // Calculate standard deviation
    const mean = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = times.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / times.length;
    const stdDev = Math.sqrt(variance);

    // If std deviation < 2 minutes, timing is too consistent
    return {
      detected: stdDev < 2,
      stdDev: Math.round(stdDev * 10) / 10,
      threshold: 2
    };
  }

  async detectBatchMarking(currentAttendance) {
    // Check if multiple students marked attendance from similar location within 1 minute
    const timeWindow = new Date(currentAttendance.markedAt);
    timeWindow.setMinutes(timeWindow.getMinutes() - 1);

    const recentAttendance = await Attendance.findAll({
      where: {
        sessionId: currentAttendance.sessionId,
        markedAt: { [Op.gte]: timeWindow },
        id: { [Op.ne]: currentAttendance.id }
      }
    });

    if (recentAttendance.length === 0) return { detected: false };

    // Check location similarity
    const similarLocations = recentAttendance.filter(a => {
      if (!a.location || !currentAttendance.location) return false;
      
      const distance = this.calculateDistance(
        currentAttendance.location,
        a.location
      );
      
      return distance < 5; // Within 5 meters
    });

    return {
      detected: similarLocations.length >= 2,
      count: similarLocations.length,
      threshold: 2
    };
  }

  detectRemoteMarking(history) {
    const inCampusCount = history.filter(h => h.location?.inCampus !== false).length;
    const totalCount = history.length;

    const outOfCampusRate = 1 - (inCampusCount / totalCount);

    // If > 20% marked from outside campus, flag it
    return {
      detected: outOfCampusRate > 0.2,
      rate: Math.round(outOfCampusRate * 100),
      threshold: 20
    };
  }

  calculateDistance(loc1, loc2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = loc1.lat * Math.PI / 180;
    const φ2 = loc2.lat * Math.PI / 180;
    const Δφ = (loc2.lat - loc1.lat) * Math.PI / 180;
    const Δλ = (loc2.lng - loc1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
}

module.exports = new AnomalyDetectionService();