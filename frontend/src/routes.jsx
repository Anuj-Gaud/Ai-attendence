import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentDashboard from './components/student/Dashboard';
import MarkAttendance from './components/student/MarkAttendance';
import SecureAttendance from './components/student/SecureAttendance';
import QRScanner from './components/student/QRScanner';
import FaceCapture from './components/student/FaceCapture';
import AttendanceHistory from './components/student/AttendanceHistory';
import StudentProfile from './components/student/Profile';
import FacultyDashboard from './components/faculty/Dashboard';
import SessionManager from './components/faculty/SessionManager';
import QRGenerator from './components/faculty/QRGenerator';
import SessionReport from './components/faculty/SessionReport';
import AttendanceReport from './components/faculty/AttendanceReport';
import StudentList from './components/faculty/StudentList';
import AdminDashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import Analytics from './components/admin/Analytics';
import AnomalyReview from './components/admin/AnomalyReview';
import SystemSettings from './components/admin/SystemSettings';
import CameraTest from './components/test/CameraTest';
import SimpleCameraTest from './components/test/SimpleCameraTest';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Test Routes */}
      <Route path="test/camera" element={<CameraTest />} />
      <Route path="test/simple-camera" element={<SimpleCameraTest />} />

      {/* Student Routes */}
      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route path="student/mark-attendance" element={<MarkAttendance />} />
      <Route path="student/secure-attendance" element={<SecureAttendance />} />
      <Route path="student/qr-scanner" element={<QRScanner />} />
      <Route path="student/face-capture" element={<FaceCapture />} />
      <Route path="student/attendance-history" element={<AttendanceHistory />} />
      <Route path="student/profile" element={<StudentProfile />} />

      {/* Faculty Routes */}
      <Route path="faculty/dashboard" element={<FacultyDashboard />} />
      <Route path="faculty/session-manager" element={<SessionManager />} />
      <Route path="faculty/qr-generator" element={<QRGenerator />} />
      <Route path="faculty/session-report" element={<SessionReport />} />
      <Route path="faculty/attendance-report" element={<AttendanceReport />} />
      <Route path="faculty/student-list" element={<StudentList />} />

      {/* Admin Routes */}
      <Route path="admin/dashboard" element={<AdminDashboard />} />
      <Route path="admin/user-management" element={<UserManagement />} />
      <Route path="admin/analytics" element={<Analytics />} />
      <Route path="admin/anomaly-review" element={<AnomalyReview />} />
      <Route path="admin/system-settings" element={<SystemSettings />} />
    </Routes>
  );
};
