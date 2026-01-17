const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

// Register user
exports.register = async (req, res) => {
  try {
    const { studentId, email, password, name, department, role = 'student' } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user (password will be hashed by model hook)
    const user = await User.create({
      studentId,
      email,
      password, // Don't hash here - let the model hook do it
      name,
      department,
      role
    });

    logger.info(`User registered: ${email}`);
    res.status(201).json({ success: true, message: 'User registered successfully', data: { id: user.id, email: user.email } });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    logger.info(`User logged in: ${email}`);
    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      data: { 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name,
          studentId: user.studentId,
          department: user.department,
          role: user.role 
        } 
      } 
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, department } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.update({ name, department });
    logger.info(`User profile updated: ${user.email}`);
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: user });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const newToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    logger.info(`Token refreshed for user: ${user.email}`);
    res.status(200).json({ success: true, data: { token: newToken } });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    logger.info(`User logged out: ${req.user.email}`);
    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Old password is incorrect' });
    }

    // Update password (will be hashed by model hook)
    await user.update({ password: newPassword });

    logger.info(`Password changed for user: ${user.email}`);
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update face embedding
exports.updateFaceEmbedding = async (req, res) => {
  try {
    const { faceEmbedding, image } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { FaceEmbedding } = require('../models');
    
    await FaceEmbedding.findOrCreate({
      where: { userId: user.id },
      defaults: {
        userId: user.id,
        embedding: faceEmbedding,
        imageUrl: image
      }
    }).then(([embedding, created]) => {
      if (!created) {
        embedding.update({ embedding: faceEmbedding, imageUrl: image });
      }
    });

    logger.info(`Face embedding updated for user: ${user.email}`);
    res.status(200).json({ success: true, message: 'Face embedding updated successfully' });
  } catch (error) {
    logger.error('Update face embedding error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save biometric data during registration
exports.saveBiometrics = async (req, res) => {
  try {
    const { userId, faceImage, faceEmbedding, fingerprintData } = req.body;

    if (!userId || !faceImage || !faceEmbedding || !fingerprintData) {
      return res.status(400).json({ success: false, message: 'Missing biometric data' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Save face data
    const { FaceEmbedding } = require('../models');
    await FaceEmbedding.create({
      userId: userId,
      embedding: JSON.stringify(faceEmbedding),
      imageUrl: faceImage,
      quality: 95,
      createdAt: new Date()
    });

    // Save fingerprint data
    const { Fingerprint } = require('../models');
    await Fingerprint.create({
      userId: userId,
      template: JSON.stringify(fingerprintData.template),
      quality: fingerprintData.quality,
      createdAt: new Date()
    });

    logger.info(`Biometric data saved for user: ${user.email}`);
    res.status(200).json({ success: true, message: 'Biometric data saved successfully' });
  } catch (error) {
    logger.error('Save biometrics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify biometric data during attendance
exports.verifyBiometrics = async (req, res) => {
  try {
    const { userId, faceImage, faceEmbedding, fingerprintData } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let verificationResults = {
      face: { verified: false, confidence: 0 },
      fingerprint: { verified: false, confidence: 0 },
      overall: { verified: false, riskLevel: 'high' }
    };

    // Verify face if provided
    if (faceImage && faceEmbedding) {
      const { FaceEmbedding } = require('../models');
      const storedFace = await FaceEmbedding.findOne({ where: { userId } });
      
      if (storedFace) {
        // Simulate face matching (in real app, use AI comparison)
        const storedEmbedding = JSON.parse(storedFace.embedding);
        const similarity = calculateSimilarity(faceEmbedding, storedEmbedding);
        
        verificationResults.face = {
          verified: similarity > 0.8,
          confidence: Math.round(similarity * 100)
        };
      }
    }

    // Verify fingerprint if provided
    if (fingerprintData) {
      const { Fingerprint } = require('../models');
      const storedFingerprint = await Fingerprint.findOne({ where: { userId } });
      
      if (storedFingerprint) {
        // Simulate fingerprint matching
        const storedTemplate = JSON.parse(storedFingerprint.template);
        const similarity = calculateSimilarity(fingerprintData.template, storedTemplate);
        
        verificationResults.fingerprint = {
          verified: similarity > 0.85,
          confidence: Math.round(similarity * 100)
        };
      }
    }

    // Calculate overall verification
    const faceScore = verificationResults.face.verified ? verificationResults.face.confidence : 0;
    const fingerprintScore = verificationResults.fingerprint.verified ? verificationResults.fingerprint.confidence : 0;
    const overallScore = (faceScore + fingerprintScore) / 2;

    verificationResults.overall = {
      verified: overallScore > 75,
      confidence: Math.round(overallScore),
      riskLevel: overallScore > 85 ? 'low' : overallScore > 70 ? 'medium' : 'high'
    };

    logger.info(`Biometric verification for user ${user.email}: ${verificationResults.overall.verified ? 'SUCCESS' : 'FAILED'}`);
    res.status(200).json({ success: true, data: verificationResults });
  } catch (error) {
    logger.error('Verify biometrics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to calculate similarity between embeddings
function calculateSimilarity(embedding1, embedding2) {
  if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
    return 0;
  }

  // Calculate cosine similarity
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  return Math.max(0, Math.min(1, similarity)); // Clamp between 0 and 1
}