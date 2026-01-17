import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const AnomalyReview = () => {
  const [anomalies] = React.useState([
    { id: 1, student: 'John Doe', type: 'Location Mismatch', severity: 'High', date: '2026-01-16' },
    { id: 2, student: 'Jane Smith', type: 'Multiple Entries', severity: 'Medium', date: '2026-01-15' },
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">Anomaly Review</h2>
        <div className="bg-gray-800 p-6 rounded-lg">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 border-b border-gray-700">Student</th>
                <th className="text-left p-3 border-b border-gray-700">Type</th>
                <th className="text-left p-3 border-b border-gray-700">Severity</th>
                <th className="text-left p-3 border-b border-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((anomaly) => (
                <tr key={anomaly.id}>
                  <td className="p-3 border-b border-gray-700">{anomaly.student}</td>
                  <td className="p-3 border-b border-gray-700">{anomaly.type}</td>
                  <td className={`p-3 border-b border-gray-700 ${
                    anomaly.severity === 'High' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {anomaly.severity}
                  </td>
                  <td className="p-3 border-b border-gray-700">{anomaly.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnomalyReview;
