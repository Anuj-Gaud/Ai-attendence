import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const Analytics = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Attendance Trends</h3>
            <div className="h-64 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-gray-400">Chart will be displayed here</span>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">User Statistics</h3>
            <div className="h-64 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-gray-400">Chart will be displayed here</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
