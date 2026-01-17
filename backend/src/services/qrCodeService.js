const QRCode = require('qrcode');
const crypto = require('crypto');
const { cacheService } = require('../config/redis');

class QRCodeService {
  constructor() {
    this.validity = parseInt(process.env.QR_CODE_VALIDITY) || 300; // 5 minutes
  }

  async generateQRCode(sessionId, classroom) {
    try {
      // Generate unique token
      const token = crypto.randomBytes(32).toString('hex');
      const timestamp = Date.now();

      const qrData = {
        sessionId,
        token,
        classroom,
        timestamp,
        validUntil: timestamp + (this.validity * 1000)
      };

      // Store in Redis with TTL
      await cacheService.storeQRCode(token, qrData, this.validity);

      // Generate QR code image
      const qrCodeDataURL = await QRCode.toDataURL(
        JSON.stringify(qrData),
        {
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }
      );

      return {
        success: true,
        token,
        qrCodeDataURL,
        validUntil: new Date(qrData.validUntil),
        expiresIn: this.validity
      };
    } catch (error) {
      console.error('QR generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async verifyQRCode(scannedData, studentLocation) {
    try {
      // Parse scanned data
      let qrData;
      try {
        qrData = typeof scannedData === 'string' 
          ? JSON.parse(scannedData) 
          : scannedData;
      } catch {
        return {
          valid: false,
          reason: 'Invalid QR code format'
        };
      }

      const { token, sessionId, classroom, validUntil } = qrData;

      if (!token || !sessionId) {
        return {
          valid: false,
          reason: 'Missing required QR data'
        };
      }

      // Check if QR code exists and is valid
      const storedData = await cacheService.getQRCode(token);

      if (!storedData) {
        return {
          valid: false,
          reason: 'QR code expired or invalid'
        };
      }

      // Check expiration
      if (Date.now() > validUntil) {
        await cacheService.deleteQRCode(token);
        return {
          valid: false,
          reason: 'QR code expired'
        };
      }

      // Verify session ID matches
      if (storedData.sessionId !== sessionId) {
        return {
          valid: false,
          reason: 'QR code session mismatch'
        };
      }

      // Optional: Verify location proximity to classroom
      // This prevents students from sharing QR screenshots
      const geofencing = require('./geofencing');
      if (studentLocation) {
        const locationCheck = geofencing.verifyLocation(studentLocation, classroom);
        
        if (!locationCheck.valid) {
          return {
            valid: false,
            reason: 'Location verification failed',
            locationError: locationCheck.reason
          };
        }
      }

      return {
        valid: true,
        sessionId,
        classroom,
        token,
        scannedAt: new Date()
      };
    } catch (error) {
      console.error('QR verification error:', error);
      return {
        valid: false,
        reason: error.message
      };
    }
  }

  async invalidateQRCode(token) {
    try {
      await cacheService.deleteQRCode(token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async markQRAsUsed(token, studentId) {
    try {
      const qrData = await cacheService.getQRCode(token);
      
      if (!qrData) {
        return { success: false, reason: 'QR code not found' };
      }

      // Track which students used this QR
      if (!qrData.usedBy) {
        qrData.usedBy = [];
      }

      qrData.usedBy.push({
        studentId,
        timestamp: Date.now()
      });

      // Update in cache
      const ttl = Math.max(1, Math.floor((qrData.validUntil - Date.now()) / 1000));
      await cacheService.storeQRCode(token, qrData, ttl);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check if QR code was used by multiple students (suspicious)
  async checkQRUsage(token) {
    try {
      const qrData = await cacheService.getQRCode(token);
      
      if (!qrData || !qrData.usedBy) {
        return { count: 0, users: [] };
      }

      return {
        count: qrData.usedBy.length,
        users: qrData.usedBy
      };
    } catch (error) {
      return { count: 0, users: [], error: error.message };
    }
  }

  // Generate rotating QR codes (auto-refresh)
  async generateRotatingQR(sessionId, classroom, rotationInterval = 300000) {
    const qrResult = await this.generateQRCode(sessionId, classroom);
    
    if (!qrResult.success) {
      return qrResult;
    }

    // Schedule rotation
    setTimeout(async () => {
      await this.invalidateQRCode(qrResult.token);
      // Faculty should request new QR
    }, rotationInterval);

    return qrResult;
  }
}

module.exports = new QRCodeService();