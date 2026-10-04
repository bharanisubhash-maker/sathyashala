import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import EduDashboard from './pages/EduDashboard';
import MarkAttendance from './pages/MarkAttendance';
import AttendanceReport from './pages/AttendanceReport';
import StudentAttendanceSummary from './pages/StudentAttendanceSummary';
import ShortageList from './pages/ShortageList';
import GraceManagement from './pages/GraceManagement';
import Certificates from './pages/Certificates';

import AttendanceMonitoring from './pages/AttendanceMonitoring';
import InfrastructureScanner from './pages/InfrastructureScanner';
import ViolationsAlerts from './pages/ViolationsAlerts';
import CentresDirectory from './pages/CentresDirectory';
import AuditRecords from './pages/AuditRecords';
import PrivacyArchitecture from './pages/PrivacyArchitecture';
import ModelAccuracyAssessment from './pages/ModelAccuracyAssessment';
import LowBandwidthDeployment from './pages/LowBandwidthDeployment';

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><EduDashboard /></ProtectedRoute>} />
      <Route path="/mark-attendance" element={<ProtectedRoute><MarkAttendance /></ProtectedRoute>} />
      <Route path="/attendance-report" element={<ProtectedRoute><AttendanceReport /></ProtectedRoute>} />
      <Route path="/student-summary" element={<ProtectedRoute><StudentAttendanceSummary /></ProtectedRoute>} />
      <Route path="/shortage-list" element={<ProtectedRoute><ShortageList /></ProtectedRoute>} />
      <Route path="/grace-management" element={<ProtectedRoute><GraceManagement /></ProtectedRoute>} />
      <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />

      {/* AI Vision & Problem Statement Dedicated Modules */}
      <Route path="/attendance" element={<ProtectedRoute><AttendanceMonitoring /></ProtectedRoute>} />
      <Route path="/infrastructure" element={<ProtectedRoute><InfrastructureScanner /></ProtectedRoute>} />
      <Route path="/violations" element={<ProtectedRoute><ViolationsAlerts /></ProtectedRoute>} />
      <Route path="/privacy" element={<ProtectedRoute><PrivacyArchitecture /></ProtectedRoute>} />
      <Route path="/accuracy" element={<ProtectedRoute><ModelAccuracyAssessment /></ProtectedRoute>} />
      <Route path="/bandwidth" element={<ProtectedRoute><LowBandwidthDeployment /></ProtectedRoute>} />
      <Route path="/centres" element={<ProtectedRoute><CentresDirectory /></ProtectedRoute>} />
      <Route path="/records" element={<ProtectedRoute><AuditRecords /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
