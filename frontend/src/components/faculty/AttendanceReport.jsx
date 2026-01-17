import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const AttendanceReport = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">Attendance Reports</h2>
        <div className="mb-6">
          <select className="bg-gray-800 text-white px-4 py-2 rounded">
            <option>Select Course</option>
            <option>CS101</option>
            <option>CS102</option>
          </select>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-400">Select a course to view attendance report</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AttendanceReport;
