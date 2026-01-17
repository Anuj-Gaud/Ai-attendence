import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  History, 
  User, 
  Calendar,
  Users,
  BarChart3,
  Settings,
  FileText,
  QrCode
} from 'lucide-react';

const Sidebar = ({ userRole }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const linkClass = (path) => `
    flex items-center gap-3 p-3 rounded-lg transition
    ${isActive(path) 
      ? 'bg-blue-600 text-white' 
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }
  `;

  const studentLinks = [
    { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/student/mark-attendance', icon: CheckSquare, label: 'Mark Attendance' },
    { path: '/student/attendance-history', icon: History, label: 'History' },
    { path: '/student/profile', icon: User, label: 'Profile' },
  ];

  const facultyLinks = [
    { path: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/faculty/session-manager', icon: Calendar, label: 'Sessions' },
    { path: '/faculty/qr-generator', icon: QrCode, label: 'QR Generator' },
    { path: '/faculty/attendance-report', icon: FileText, label: 'Reports' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/user-management', icon: Users, label: 'Users' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/system-settings', icon: Settings, label: 'Settings' },
  ];

  const links = 
    userRole === 'student' ? studentLinks :
    userRole === 'faculty' ? facultyLinks :
    userRole === 'admin' ? adminLinks : [];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4 border-r border-gray-700">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-400 uppercase tracking-wider">
          Navigation
        </h2>
      </div>
      
      <nav className="space-y-2">
        {links.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={linkClass(path)}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
