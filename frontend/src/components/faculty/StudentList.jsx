import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const StudentList = () => {
  const [students] = React.useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', attendance: '85%' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', attendance: '90%' },
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-6">Student List</h2>
        <div className="bg-gray-800 p-6 rounded-lg">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 border-b border-gray-700">Name</th>
                <th className="text-left p-3 border-b border-gray-700">Email</th>
                <th className="text-left p-3 border-b border-gray-700">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="p-3 border-b border-gray-700">{student.name}</td>
                  <td className="p-3 border-b border-gray-700">{student.email}</td>
                  <td className="p-3 border-b border-gray-700">{student.attendance}</td>
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

export default StudentList;
