import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const SessionReport = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">Session Reports</h2>
        <div className="bg-gray-800 p-6 rounded-lg">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 border-b border-gray-700">Session</th>
                <th className="text-left p-3 border-b border-gray-700">Date</th>
                <th className="text-left p-3 border-b border-gray-700">Present</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-gray-700">CS101-LEC1</td>
                <td className="p-3 border-b border-gray-700">2026-01-16</td>
                <td className="p-3 border-b border-gray-700">95/100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SessionReport;
