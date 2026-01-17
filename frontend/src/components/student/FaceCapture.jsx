import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const FaceCapture = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">Face Capture</h2>
        <div className="max-w-2xl">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="w-full h-80 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-gray-400">Webcam feed will be displayed here</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FaceCapture;
