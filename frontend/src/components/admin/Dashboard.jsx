import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import { 
  Users, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  UserPlus,
  BarChart3,
  Settings,
  Shield,
  Server,
  Database,
  Wifi,
  Eye,
  Target,
  Zap,
  Clock
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 1247, students: 1150, faculty: 85, admins: 12 },
    sessions: { total: 156, active: 8, completed: 148 },
    attendance: { total: 45680, today: 892, verified: 847, flagged: 45 },
    security: { proxyAttempts: 23, anomalies: 7, riskScore: 2.3 }
  });
  const [systemHealth, setSystemHealth] = useState({
    aiService: { status: 'healthy', responseTime: 98, uptime: 99.9 },
    database: { status: 'healthy', connections: 45, performance: 'excellent' },
    cameras: { status: 'healthy', active: 156, offline: 3 },
    server: { status: 'healthy', cpu: 23, memory: 67, disk: 45 }
  });
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'security', message: 'High-risk verification attempt detected', time: '2m ago', severity: 'high' },
    { id: 2, type: 'system', message: 'New faculty member registered', time: '5m ago', severity: 'low' },
    { id: 3, type: 'attendance', message: 'Bulk attendance verification completed', time: '8m ago', severity: 'medium' },
    { id: 4, type: 'security', message: 'Anomaly pattern identified in Room A-204', time: '12m ago', severity: 'high' },
    { id: 5, type: 'system', message: 'System backup completed successfully', time: '15m ago', severity: 'low' }
  ]);

  useEffect(() => {
    fetchDashboardData();
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        attendance: {
          ...prev.attendance,
          today: prev.attendance.today + Math.floor(Math.random() * 3),
          verified: prev.attendance.verified + Math.floor(Math.random() * 2)
        }
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      if (response.data.success) {
        setStats(prev => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const StatCard = ({ title, value, icon: Icon, bgColor, textColor, subtitle, trend }) => (
    <div className={`${bgColor} rounded-xl p-6 text-white shadow-sm border-l-4 border-white border-opacity-30`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{value}</div>
          {trend && (
            <div className="text-xs opacity-75 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </div>
          )}
        </div>
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
          {/* Command Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mb-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Control Center</h1>
                <p className="text-gray-300">Enterprise Attendance Security System</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{stats.security.riskScore}</div>
                <div className="text-sm text-gray-300">Risk Score (Low)</div>
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          {stats.security.anomalies > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Security Alert</h3>
                  <p className="text-red-700 text-sm">
                    {stats.security.anomalies} anomalies detected requiring immediate attention
                  </p>
                </div>
                <Link
                  to="/admin/anomaly-review"
                  className="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Review Now
                </Link>
              </div>
            </div>
          )}
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats.users.total.toLocaleString()}
              icon={Users}
              bgColor="bg-blue-600"
              textColor="text-white"
              subtitle={`${stats.users.students} students • ${stats.users.faculty} faculty`}
              trend="+12 today"
            />
            <StatCard
              title="Active Sessions"
              value={stats.sessions.active}
              icon={Activity}
              bgColor="bg-green-600"
              textColor="text-white"
              subtitle={`${stats.sessions.total} total sessions`}
              trend="+3 this hour"
            />
            <StatCard
              title="Security Incidents"
              value={stats.security.proxyAttempts}
              icon={Shield}
              bgColor="bg-red-600"
              textColor="text-white"
              subtitle={`${stats.security.anomalies} high-risk events`}
              trend="-15% vs yesterday"
            />
            <StatCard
              title="Today's Attendance"
              value={stats.attendance.today.toLocaleString()}
              icon={TrendingUp}
              bgColor="bg-purple-600"
              textColor="text-white"
              subtitle={`${stats.attendance.verified} verified • ${stats.attendance.flagged} flagged`}
              trend="+8% vs avg"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* System Health */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">System Health Monitor</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* AI Service */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">AI Recognition</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(systemHealth.aiService.status)}`}>
                        {systemHealth.aiService.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Time</span>
                        <span className="font-medium">{systemHealth.aiService.responseTime}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uptime</span>
                        <span className="font-medium">{systemHealth.aiService.uptime}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Database */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-900">Database</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(systemHealth.database.status)}`}>
                        {systemHealth.database.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Connections</span>
                        <span className="font-medium">{systemHealth.database.connections}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Performance</span>
                        <span className="font-medium capitalize">{systemHealth.database.performance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Camera Network */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-900">Camera Network</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(systemHealth.cameras.status)}`}>
                        {systemHealth.cameras.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Cameras</span>
                        <span className="font-medium">{systemHealth.cameras.active}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Offline</span>
                        <span className="font-medium text-red-600">{systemHealth.cameras.offline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Server Resources */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Server className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold text-gray-900">Server Resources</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(systemHealth.server.status)}`}>
                        {systemHealth.server.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">CPU Usage</span>
                        <span className="font-medium">{systemHealth.server.cpu}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${systemHealth.server.cpu}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Memory</span>
                        <span className="font-medium">{systemHealth.server.memory}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${systemHealth.server.memory}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security Feed</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.severity === 'high' ? 'bg-red-500' :
                      activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{activity.time}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(activity.severity)}`}>
                          {activity.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link
              to="/admin/user-management"
              className="bg-white hover:shadow-lg p-6 rounded-xl shadow-sm border border-gray-200 transition group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-900 text-lg font-bold mb-2">User Management</h3>
              <p className="text-gray-600 text-sm">Manage students, faculty, and system access</p>
            </Link>

            <Link
              to="/admin/analytics"
              className="bg-white hover:shadow-lg p-6 rounded-xl shadow-sm border border-gray-200 transition group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-gray-900 text-lg font-bold mb-2">Security Analytics</h3>
              <p className="text-gray-600 text-sm">Advanced threat detection and reporting</p>
            </Link>

            <Link
              to="/admin/system-settings"
              className="bg-white hover:shadow-lg p-6 rounded-xl shadow-sm border border-gray-200 transition group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-gray-900 text-lg font-bold mb-2">System Configuration</h3>
              <p className="text-gray-600 text-sm">Security policies and system settings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
