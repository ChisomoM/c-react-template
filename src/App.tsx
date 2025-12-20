import Home from './(public)/home/home'
import Contact from './(public)/contact/contact-us'
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop'
import { Toaster } from 'sonner';
import Login from './components/Login';
import JoinPage from './(public)/join/JoinPage';
import { ProtectedRoute } from './lib/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import { AdminDashboard } from './(admin)/admin/Admin';
import JoinApplications from './(admin)/admin/JoinApplications';
import TeamManagement from './(admin)/admin/TeamManagement';
import TeacherManagement from './(admin)/admin/TeacherManagement';
import Referrals from './(admin)/admin/Referrals';
import { ReportsPage } from './(admin)/admin/Reports';
import ApprovalsPage from './(admin)/admin/ApprovalsPage';
import RegionManagement from './(admin)/admin/RegionManagement';
import TeacherLayout from './layouts/TeacherLayout';
import AffiliatesPage from './(teacher)/dashboard/AffiliatesPage';


import TeacherDashboard from './(teacher)/dashboard/TeacherDashboard';
import FinancesPage from './(teacher)/dashboard/FinancesPage';

function App() {
  return (
    <>
    <ScrollToTop/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<JoinPage />} />
      <Route path="*" element={<div>Page Not Found</div>} />

      {/* Teacher Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <TeacherLayout />
        </ProtectedRoute>
      }>
        <Route index element={<TeacherDashboard />} />
        <Route path="finances" element={<FinancesPage />} />
        <Route path="affiliates" element={<AffiliatesPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="join-applications" element={<JoinApplications />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="regions" element={<RegionManagement />} />
        <Route path="team-management" element={<TeamManagement />} />
        <Route path="teacher-management" element={<TeacherManagement />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
    </Routes>
    <Toaster position="top-right" richColors />
    </>
  );
}

export default App
