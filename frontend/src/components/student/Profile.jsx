import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const StudentProfile = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">My Profile</h2>
        <div className="max-w-2xl">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Name</label>
              <p className="text-white">John Doe</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Email</label>
              <p className="text-white">john@example.com</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Roll Number</label>
              <p className="text-white">CS001</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentProfile;
