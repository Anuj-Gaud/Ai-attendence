import React, { useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const SessionManager = () => {
  const [sessions, setSessions] = useState([]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">Session Manager</h2>
        <div className="mb-6">
          <button className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700">
            Create New Session
          </button>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 border-b border-gray-700">Session ID</th>
                <th className="text-left p-3 border-b border-gray-700">Status</th>
                <th className="text-left p-3 border-b border-gray-700">Students</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-400">No sessions yet</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SessionManager;
