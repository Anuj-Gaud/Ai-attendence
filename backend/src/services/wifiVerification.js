class WiFiVerificationService {
  constructor() {
    this.wifiMapping = this.loadWiFiMapping();
    this.requiredSignalStrength = -65; // dBm
  }

  loadWiFiMapping() {
    try {
      const mapping = process.env.WIFI_MAPPING;
      return mapping ? JSON.parse(mapping) : {};
    } catch (error) {
      console.error('Error loading WiFi mapping:', error);
      return {};
    }
  }

  verifyWiFi(detectedAPs, classroom) {
    if (!this.wifiMapping[classroom]) {
      return {
        verified: false,
        reason: 'No WiFi configuration for this classroom'
      };
    }

    const expectedAPs = this.wifiMapping[classroom];
    const detectedBSSIDs = detectedAPs.map(ap => ap.bssid || ap.BSSID);

    // Check if any expected AP is detected
    const matchedAP = detectedAPs.find(ap => 
      expectedAPs.includes(ap.bssid || ap.BSSID)
    );

    if (!matchedAP) {
      return {
        verified: false,
        reason: 'Classroom WiFi not detected',
        expected: expectedAPs,
        detected: detectedBSSIDs
      };
    }

    // Check signal strength
    const signalStrength = matchedAP.level || matchedAP.signalStrength || 0;
    
    if (signalStrength < this.requiredSignalStrength) {
      return {
        verified: false,
        reason: 'WiFi signal too weak',
        signalStrength,
        required: this.requiredSignalStrength
      };
    }

    return {
      verified: true,
      matchedAP: matchedAP.bssid || matchedAP.BSSID,
      signalStrength,
      ssid: matchedAP.ssid || matchedAP.SSID
    };
  }

  addClassroomWiFi(classroom, accessPoints) {
    this.wifiMapping[classroom] = accessPoints;
    return { success: true, classroom, accessPoints };
  }

  removeClassroomWiFi(classroom) {
    delete this.wifiMapping[classroom];
    return { success: true, classroom };
  }

  getAllMappings() {
    return this.wifiMapping;
  }
}

module.exports = new WiFiVerificationService();