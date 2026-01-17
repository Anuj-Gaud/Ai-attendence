import React, { useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    enableFaceRecognition: true,
    enableQRCode: true,
    enableLocationTracking: true,
    sessionTimeout: 30,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">System Settings</h2>
        <div className="max-w-2xl bg-gray-800 p-6 rounded-lg">
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enableFaceRecognition"
                checked={settings.enableFaceRecognition}
                onChange={handleChange}
                className="mr-2"
              />
              Enable Face Recognition
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enableQRCode"
                checked={settings.enableQRCode}
                onChange={handleChange}
                className="mr-2"
              />
              Enable QR Code
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enableLocationTracking"
                checked={settings.enableLocationTracking}
                onChange={handleChange}
                className="mr-2"
              />
              Enable Location Tracking
            </label>
          </div>
          <div className="mb-6">
            <label className="block mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              name="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>
          <button className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SystemSettings;
