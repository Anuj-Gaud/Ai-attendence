class BeaconService {
  constructor() {
    this.beaconMapping = this.loadBeaconMapping();
    this.requiredRSSI = -70; // Signal strength threshold
  }

  loadBeaconMapping() {
    try {
      const mapping = process.env.BEACON_MAPPING;
      return mapping ? JSON.parse(mapping) : {};
    } catch (error) {
      console.error('Error loading beacon mapping:', error);
      return {};
    }
  }

  verifyBeacon(detectedBeacons, classroom) {
    if (!this.beaconMapping[classroom]) {
      return {
        verified: false,
        reason: 'No beacon configuration for this classroom'
      };
    }

    const expectedBeacons = this.beaconMapping[classroom];
    const detectedUUIDs = detectedBeacons.map(b => b.uuid || b.id);

    // Check if any expected beacon is detected
    const matchedBeacon = detectedBeacons.find(beacon => 
      expectedBeacons.includes(beacon.uuid || beacon.id)
    );

    if (!matchedBeacon) {
      return {
        verified: false,
        reason: 'Classroom beacons not detected',
        expected: expectedBeacons,
        detected: detectedUUIDs
      };
    }

    // Check RSSI (signal strength)
    const rssi = matchedBeacon.rssi || 0;
    
    if (rssi < this.requiredRSSI) {
      return {
        verified: false,
        reason: 'Beacon signal too weak',
        rssi,
        required: this.requiredRSSI
      };
    }

    // Estimate distance from beacon
    const distance = this.estimateDistance(rssi);

    return {
      verified: true,
      matchedBeacon: matchedBeacon.uuid || matchedBeacon.id,
      rssi,
      estimatedDistance: distance,
      name: matchedBeacon.name
    };
  }

  estimateDistance(rssi, txPower = -59) {
    if (rssi === 0) {
      return -1.0;
    }

    const ratio = rssi * 1.0 / txPower;
    
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    } else {
      const distance = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
      return Math.round(distance * 100) / 100; // Round to 2 decimals
    }
  }

  addClassroomBeacons(classroom, beacons) {
    this.beaconMapping[classroom] = beacons;
    return { success: true, classroom, beacons };
  }

  removeClassroomBeacons(classroom) {
    delete this.beaconMapping[classroom];
    return { success: true, classroom };
  }

  getAllMappings() {
    return this.beaconMapping;
  }
}

module.exports = new BeaconService();