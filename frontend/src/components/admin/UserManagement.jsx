import { useState, useEffect } from 'react';
import Header from '../common/Header';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for display
  const mockUsers = [
    { id: 1, name: 'John Doe', studentId: '12345', class: 'Mathematics', avatar: '👤' },
    { id: 2, name: 'Jane Smith', studentId: '12350', class: 'Science', avatar: '👤' },
    { id: 3, name: 'Dave Doe', studentId: '13456', class: 'Business', avatar: '👤' },
    { id: 4, name: 'Jane Wang', studentId: '13750', class: 'Science', avatar: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              <Plus className="w-5 h-5" />
              Add Student
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Student ID</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Class</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                            {user.avatar}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{user.studentId}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{user.class}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition">
                            <Edit className="w-4 h-4" />
                            Edit Student
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
