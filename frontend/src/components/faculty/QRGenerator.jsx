import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const QRGenerator = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">QR Code Generator</h2>
        <div className="max-w-2xl">
          <button className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 mb-6">
            Generate QR Code
          </button>
          <div className="bg-gray-800 p-6 rounded-lg flex items-center justify-center">
            <div className="w-64 h-64 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-gray-400">QR Code will appear here</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QRGenerator;
