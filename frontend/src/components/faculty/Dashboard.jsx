import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock,
  Plus,
  QrCode,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import api from '../../services/api';

const FacultyDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 12,
    activeSessions: 2,
    totalStudents: 120,
    avgAttendance: 87
  });
  const [liveClass, setLiveClass] = useState({
    id: 1,
    subject: 'Computer Science 101',
    room: 'A-204',
    startTime: '09:00 AM',
    totalStudents: 45,
    verifiedStudents: 38,
    pendingVerification: 5,
    flaggedAttempts: 2
  });
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', rollNo: 'STU001', faceVerified: true, idVerified: true, fingerprintVerified: true, riskLevel: 'low', verificationTime: '09:02 AM' },
    { id: 2, name: 'Jane Smith', rollNo: 'STU002', faceVerified: true, idVerified: true, fingerprintVerified: false, riskLevel: 'medium', verificationTime: '09:03 AM' },
    { id: 3, name: 'Mike Johnson', rollNo: 'STU003', faceVerified: false, idVerified: true, fingerprintVerified: false, riskLevel: 'high', verificationTime: '09:05 AM' },
    { id: 4, name: 'Sarah Wilson', rollNo: 'STU004', faceVerified: true, idVerified: true, fingerprintVerified: true, riskLevel: 'low', verificationTime: '09:01 AM' }
  ]);

  useEffect(() => {
    fetchDashboardData();
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLiveClass(prev => ({
        ...prev,
        verifiedStudents: Math.min(prev.totalStudents, prev.verifiedStudents + Math.floor(Math.random() * 2)),
        pendingVerification: Math.max(0, prev.pendingVerification - Math.floor(Math.random() * 2))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const sessionsResponse = await api.get('/faculty/sessions?limit=5');
      if (sessionsResponse.data.success) {
        setSessions(sessionsResponse.data.data || []);
        const allSessions = sessionsResponse.data.data || [];
        setStats({
          totalSessions: allSessions.length,
          activeSessions: allSessions.filter(s => s.status === 'active').length,
          totalStudents: 120,
          avgAttendance: 87
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const StatCard = ({ title, value, icon: Icon, bgColor, textColor, subtitle }) => (
    <div className={`${bgColor} rounded-xl p-6 text-white shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
            <Link
              to="/faculty/session-manager"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Create Session
            </Link>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Sessions"
              value={stats.totalSessions}
              icon={Calendar}
              bgColor="bg-blue-600"
              textColor="text-white"
            />
            <StatCard
              title="Active Sessions"
              value={stats.activeSessions}
              icon={Activity}
              bgColor="bg-green-600"
              textColor="text-white"
            />
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              bgColor="bg-purple-600"
              textColor="text-white"
            />
            <StatCard
              title="Avg Attendance"
              value={`${stats.avgAttendance}%`}
              icon={TrendingUp}
              bgColor="bg-orange-500"
              textColor="text-white"
            />
          </div>

          {/* Live Class Monitoring */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <h2 className="text-xl font-bold text-gray-900">Live Class Monitoring</h2>
              </div>
              <div className="text-sm text-gray-500">
                {liveClass.subject} • {liveClass.room}
              </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{liveClass.totalStudents}</div>
                    <div className="text-sm text-blue-600">Total Students</div>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{liveClass.verifiedStudents}</div>
                    <div className="text-sm text-green-600">Verified</div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{liveClass.pendingVerification}</div>
                    <div className="text-sm text-yellow-600">Pending</div>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-600">{liveClass.flaggedAttempts}</div>
                    <div className="text-sm text-red-600">Flagged</div>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Verification Progress</span>
                <span>{Math.round((liveClass.verifiedStudents / liveClass.totalStudents) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(liveClass.verifiedStudents / liveClass.totalStudents) * 100}%` }}
                />
              </div>
            </div>

            {/* Student List */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Verification Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Risk Level</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.rollNo}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            student.faceVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Eye className="w-3 h-3" />
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            student.idVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Shield className="w-3 h-3" />
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            student.fingerprintVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Target className="w-3 h-3" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(student.riskLevel)}`}>
                          {student.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {student.verificationTime}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Review
                          </button>
                          {student.riskLevel === 'high' && (
                            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                              Flag
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/faculty/session-manager"
              className="bg-white hover:shadow-lg p-6 rounded-xl shadow-sm border border-gray-200 transition group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-900 text-lg font-bold mb-2">Create Session</h3>
              <p className="text-gray-600 text-sm">Start a new secure class session</p>
            </Link>

            <Link
              to="/faculty/qr-generator"
              className="bg-white hover:shadow-lg p-6 rounded-xl shadow-sm border border-gray-200 transition group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-gray-900 text-lg font-bold mb-2">Generate QR</h3>
              <p className="text-gray-600 text-sm">Create secure attendance QR codes</p>
            </Link>

            <Link
              to="/faculty/attendance-report"
              className="bg-white hover:shadow-lg p-6 rounded-xl shadow-sm border border-gray-200 transition group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-gray-900 text-lg font-bold mb-2">View Reports</h3>
              <p className="text-gray-600 text-sm">Analyze attendance patterns</p>
            </Link>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Sessions</h2>
            
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No sessions yet</p>
                <Link to="/faculty/session-manager" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
                  Create your first session →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course Code</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Attendance</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{session.courseName}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{session.courseCode}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(session.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          85% (38/45)
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : session.status === 'completed'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {session.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
