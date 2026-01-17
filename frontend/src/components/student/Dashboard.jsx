import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import { 
  Shield, 
  Calendar, 
  CheckCircle, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  User,
  BookOpen,
  Target,
  Zap,
  Eye,
  Fingerprint
} from 'lucide-react';
import api from '../../services/api';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalClasses: 45,
    attendedClasses: 38,
    attendancePercentage: 84,
    verificationScore: 98
  });
  const [todayClasses, setTodayClasses] = useState([
    {
      id: 1,
      subject: 'Computer Science 101',
      time: '09:00 AM',
      room: 'A-204',
      status: 'verified',
      verificationTime: '08:58 AM'
    },
    {
      id: 2,
      subject: 'Mathematics',
      time: '11:00 AM',
      room: 'B-105',
      status: 'pending',
      verificationTime: null
    },
    {
      id: 3,
      subject: 'Physics Lab',
      time: '02:00 PM',
      room: 'Lab-C',
      status: 'upcoming',
      verificationTime: null
    }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/student/dashboard');
      if (response.data.success) {
        setStats(prev => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="p-4 max-w-6xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Student'}</h1>
              <p className="text-gray-600">Roll No: {user?.studentId || 'STU001'}</p>
              <p className="text-gray-600">{user?.department || 'Computer Science'}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold text-green-600">Verified Profile</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.verificationScore}%</div>
              <div className="text-xs text-gray-500">Security Score</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalClasses}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Classes</h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.attendedClasses}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Attended</h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.attendancePercentage}%</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Attendance Rate</h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">A+</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Grade</h3>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="mb-6">
          <Link
            to="/student/secure-attendance"
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg p-6 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Mark Attendance</h2>
                <p className="text-blue-100">Secure multi-factor verification</p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </Link>
        </div>

        {/* Today's Class Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Today's Classes</h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          <div className="space-y-4">
            {todayClasses.map((classItem, index) => (
              <div key={classItem.id} className="relative">
                {/* Timeline line */}
                {index < todayClasses.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                )}
                
                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    classItem.status === 'verified' 
                      ? 'bg-green-100 text-green-600' 
                      : classItem.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getStatusIcon(classItem.status)}
                  </div>

                  {/* Class details */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{classItem.subject}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(classItem.status)}`}>
                        {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{classItem.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{classItem.room}</span>
                      </div>
                      {classItem.verificationTime && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Verified at {classItem.verificationTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Verification indicators for verified classes */}
                    {classItem.status === 'verified' && (
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Eye className="w-3 h-3" />
                          <span>Face: 94%</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Shield className="w-3 h-3" />
                          <span>ID: 96%</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Fingerprint className="w-3 h-3" />
                          <span>Print: 98%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
