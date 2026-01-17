import React, { useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const MarkAttendance = () => {
  const [method, setMethod] = useState('qr');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">Mark Attendance</h2>
        <div className="max-w-2xl">
          <div className="mb-6">
            <label className="block mb-4">Select method:</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="qr"
                  checked={method === 'qr'}
                  onChange={(e) => setMethod(e.target.value)}
                  className="mr-2"
                />
                QR Code
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="face"
                  checked={method === 'face'}
                  onChange={(e) => setMethod(e.target.value)}
                  className="mr-2"
                />
                Face Recognition
              </label>
            </div>
          </div>
          {method === 'qr' && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <p>QR Scanner will be initialized here</p>
            </div>
          )}
          {method === 'face' && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <p>Face Capture will be initialized here</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MarkAttendance;
