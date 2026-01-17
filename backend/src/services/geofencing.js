const geolib = require('geolib');

class GeofencingService {
  constructor() {
    this.classrooms = this.loadClassrooms();
    this.defaultRadius = parseInt(process.env.CLASSROOM_RADIUS) || 20; // meters
  }

  loadClassrooms() {
    try {
      const classroomsConfig = process.env.CLASSROOMS;
      if (classroomsConfig) {
        return JSON.parse(classroomsConfig);
      }
    } catch (error) {
      console.error('Error loading classroom config:', error);
    }

    // Default classroom configuration
    return {
      'ROOM_101': {
        lat: 28.6139,
        lng: 77.2090,
        radius: 20,
        floor: 1,
        building: 'A'
      },
      'ROOM_102': {
        lat: 28.6140,
        lng: 77.2091,
        radius: 20,
        floor: 1,
        building: 'A'
      },
      'LAB_201': {
        lat: 28.6141,
        lng: 77.2092,
        radius: 25,
        floor: 2,
        building: 'B'
      }
    };
  }

  verifyLocation(studentLocation, classroomId) {
    const classroom = this.classrooms[classroomId];

    if (!classroom) {
      return {
        valid: false,
        reason: 'Unknown classroom',
        classroom: classroomId
      };
    }

    // Check GPS accuracy
    if (studentLocation.accuracy > 20) {
      return {
        valid: false,
        reason: 'GPS accuracy too low',
        accuracy: studentLocation.accuracy,
        required: 20
      };
    }

    // Calculate distance from classroom center
    const distance = geolib.getDistance(
      { latitude: studentLocation.lat, longitude: studentLocation.lng },
      { latitude: classroom.lat, longitude: classroom.lng }
    );

    // Check if within radius
    const withinRange = distance <= classroom.radius;

    if (!withinRange) {
      return {
        valid: false,
        reason: 'Outside classroom boundary',
        distance: Math.round(distance),
        maxAllowed: classroom.radius,
        classroom: classroomId
      };
    }

    // Check floor if available
    if (studentLocation.floor !== undefined && classroom.floor !== undefined) {
      if (studentLocation.floor !== classroom.floor) {
        return {
          valid: false,
          reason: `Wrong floor. Expected: ${classroom.floor}, Got: ${studentLocation.floor}`,
          distance
        };
      }
    }

    return {
      valid: true,
      distance: Math.round(distance),
      classroom: classroomId,
      floor: classroom.floor,
      building: classroom.building
    };
  }

  getNearestClassroom(studentLocation) {
    let nearest = null;
    let minDistance = Infinity;

    for (const [classroomId, classroom] of Object.entries(this.classrooms)) {
      const distance = geolib.getDistance(
        { latitude: studentLocation.lat, longitude: studentLocation.lng },
        { latitude: classroom.lat, longitude: classroom.lng }
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = { id: classroomId, ...classroom, distance };
      }
    }

    return nearest;
  }

  isOnCampus(location) {
    const campusCenter = {
      latitude: parseFloat(process.env.CAMPUS_CENTER_LAT) || 28.6139,
      longitude: parseFloat(process.env.CAMPUS_CENTER_LNG) || 77.2090
    };

    const campusRadius = parseInt(process.env.CAMPUS_RADIUS) || 1000; // meters

    const distance = geolib.getDistance(
      { latitude: location.lat, longitude: location.lng },
      campusCenter
    );

    return {
      onCampus: distance <= campusRadius,
      distanceFromCenter: Math.round(distance),
      campusRadius
    };
  }

  // Calculate distance between two locations
  calculateDistance(location1, location2) {
    return geolib.getDistance(
      { latitude: location1.lat, longitude: location1.lng },
      { latitude: location2.lat, longitude: location2.lng }
    );
  }

  // Check if location is suspicious (moving too fast)
  checkLocationConsistency(previousLocation, currentLocation, timeElapsedSeconds) {
    if (!previousLocation) return { consistent: true };

    const distance = this.calculateDistance(previousLocation, currentLocation);
    const speedMetersPerSecond = distance / timeElapsedSeconds;
    const speedKmPerHour = speedMetersPerSecond * 3.6;

    // Max walking speed: ~6 km/h, Running: ~12 km/h
    const maxReasonableSpeed = 15; // km/h

    if (speedKmPerHour > maxReasonableSpeed) {
      return {
        consistent: false,
        reason: 'Unrealistic location change',
        speed: Math.round(speedKmPerHour),
        maxAllowed: maxReasonableSpeed,
        distance: Math.round(distance)
      };
    }

    return {
      consistent: true,
      speed: Math.round(speedKmPerHour),
      distance: Math.round(distance)
    };
  }

  // Estimate floor from altitude (if available)
  estimateFloor(altitude, groundLevelAltitude = 200) {
    if (!altitude) return null;
    
    const heightAboveGround = altitude - groundLevelAltitude;
    const floorHeight = 3; // Average floor height in meters
    
    return Math.max(0, Math.floor(heightAboveGround / floorHeight));
  }

  // Add or update classroom
  addClassroom(classroomId, config) {
    this.classrooms[classroomId] = {
      lat: config.lat,
      lng: config.lng,
      radius: config.radius || this.defaultRadius,
      floor: config.floor,
      building: config.building
    };

    return this.classrooms[classroomId];
  }

  // Get all classrooms
  getAllClassrooms() {
    return this.classrooms;
  }

  // Update classroom configuration
  updateClassroom(classroomId, updates) {
    if (!this.classrooms[classroomId]) {
      return { success: false, error: 'Classroom not found' };
    }

    this.classrooms[classroomId] = {
      ...this.classrooms[classroomId],
      ...updates
    };

    return { success: true, classroom: this.classrooms[classroomId] };
  }

  // Delete classroom
  deleteClassroom(classroomId) {
    if (!this.classrooms[classroomId]) {
      return { success: false, error: 'Classroom not found' };
    }

    delete this.classrooms[classroomId];
    return { success: true };
  }
}

module.exports = new GeofencingService();