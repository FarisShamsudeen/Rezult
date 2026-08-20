import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyOTP } from './pages/VerifyOTP';
import { ResetPassword } from './pages/ResetPassword';
import { Docs } from './pages/Docs';

// Candidate imports
import { CandidateDashboard, CandidateLayout } from './pages/candidate/Dashboard';
import { Assessments as CandidateAssessments } from './pages/candidate/Assessments';
import { Rezulters as CandidateRezulters } from './pages/candidate/Rezulters';
import { Calendar as CandidateCalendar } from './pages/candidate/Calendar';
import { Concerns as CandidateConcerns } from './pages/candidate/Concerns';
import { CandidateProfile } from './pages/candidate/Profile';

// Rezulter imports
import { RezulterDashboard, RezulterLayout } from './pages/rezulter/Dashboard';
import { RezulterAssessments } from './pages/rezulter/Assessments';
import { RezulterCreateAssessment } from './pages/rezulter/CreateAssessment';
import { RezulterCandidates } from './pages/rezulter/Candidates';
import { RezulterHelpAndSupport } from './pages/rezulter/HelpAndSupport';

// Super Admin imports
import { SuperAdminLayout } from './pages/super_admin/Layout';
import { SuperAdminDashboard } from './pages/super_admin/Dashboard';
import { SuperAdminRezulters } from './pages/super_admin/Rezulters';
import { SuperAdminCandidates } from './pages/super_admin/Candidates';
import { SuperAdminAssessments } from './pages/super_admin/Assessments';
import { SuperAdminReports } from './pages/super_admin/Reports';
import { SuperAdminProfile } from './pages/super_admin/Profile';

import { useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && !allowedRoles.includes(user.role)) {
    // If a candidate/rezulter tries to access super-admin, or vice-versa
    if (user.role === 'super_admin') return <Navigate to="/super-admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// Guest Route Component (redirects to dashboard if already authenticated)
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated) {
    if (user?.role === 'super_admin') return <Navigate to="/super-admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// Role-based Layout Wrapper (for candidate & rezulter)
const RoleBasedLayout = () => {
  const { user } = useAuth();
  if (user?.role === 'rezulter') return <RezulterLayout />;
  // Default to candidate
  return <CandidateLayout />;
};

// Role-based Dashboard Wrapper
const RoleBasedDashboard = () => {
  const { user } = useAuth();
  if (user?.role === 'rezulter') return <RezulterDashboard />;
  // Default to candidate
  return <CandidateDashboard />;
};

// Role-based Assessments Wrapper
const RoleBasedAssessments = () => {
  const { user } = useAuth();
  if (user?.role === 'rezulter') return <RezulterAssessments />;
  // Default to candidate
  return <CandidateAssessments />;
};

// Role-based Create Assessment Wrapper
const RoleBasedCreateAssessment = () => {
  const { user } = useAuth();
  if (user?.role === 'rezulter') return <RezulterCreateAssessment />;
  // Default to candidate - redirect since they shouldn't create assessments
  return <Navigate to="/assessments" replace />;
};

// Role-based Candidates Wrapper
const RoleBasedCandidates = () => {
  const { user } = useAuth();
  if (user?.role === 'rezulter') return <RezulterCandidates />;
  // Default to candidate
  return <div className="text-white p-10 font-bold">Candidates List Placeholder</div>;
};

// Role-based Support Wrapper
const RoleBasedSupport = () => {
  const { user } = useAuth();
  if (user?.role === 'rezulter') return <RezulterHelpAndSupport />;
  // Default to candidate
  return <div className="text-white p-10 font-bold">Candidate Support Placeholder</div>;
};

// Role-based Profile Wrapper
const RoleBasedProfile = () => {
  const { user } = useAuth();
  if (user?.role === 'rezulter') return <div className="text-white p-10 font-bold">Rezulter Profile Placeholder</div>;
  // Default to candidate
  return <CandidateProfile />;
};

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {isAuthenticated ? (
          <>
            <Route path="/super-admin" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<PageTransition><SuperAdminDashboard /></PageTransition>} />
              <Route path="rezulters" element={<PageTransition><SuperAdminRezulters /></PageTransition>} />
              <Route path="candidates" element={<PageTransition><SuperAdminCandidates /></PageTransition>} />
              <Route path="assessments" element={<PageTransition><SuperAdminAssessments /></PageTransition>} />
              <Route path="reports" element={<PageTransition><SuperAdminReports /></PageTransition>} />
              <Route path="profile" element={<PageTransition><SuperAdminProfile /></PageTransition>} />
            </Route>

            <Route element={
              <ProtectedRoute allowedRoles={['candidate', 'rezulter']}>
                <RoleBasedLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<PageTransition><RoleBasedDashboard /></PageTransition>} />
              {/* Note: We currently load Candidate-specific subpages into the router for all roles as a fallback. 
                  In the future, we will separate these completely. */}
              <Route path="/assessments" element={<PageTransition><RoleBasedAssessments /></PageTransition>} />
              <Route path="/assessments/create" element={<PageTransition><RoleBasedCreateAssessment /></PageTransition>} />
              <Route path="/rezulters" element={<PageTransition><CandidateRezulters /></PageTransition>} />
              <Route path="/calendar" element={<PageTransition><CandidateCalendar /></PageTransition>} />
              <Route path="/concerns" element={<PageTransition><CandidateConcerns /></PageTransition>} />
              <Route path="/candidates" element={<PageTransition><RoleBasedCandidates /></PageTransition>} />
              <Route path="/support" element={<PageTransition><RoleBasedSupport /></PageTransition>} />
              <Route path="/profile" element={<PageTransition><RoleBasedProfile /></PageTransition>} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        )}
        <Route path="/login" element={<GuestRoute><PageTransition><Login /></PageTransition></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><PageTransition><Signup /></PageTransition></GuestRoute>} />
        <Route path="/docs" element={<PageTransition><Docs /></PageTransition>} />
        <Route path="/candidate/forgot-password" element={<GuestRoute><PageTransition><ForgotPassword role="candidate" /></PageTransition></GuestRoute>} />
        <Route path="/rezulter/forgot-password" element={<GuestRoute><PageTransition><ForgotPassword role="rezulter" /></PageTransition></GuestRoute>} />
        <Route path="/candidate/verify-otp" element={<GuestRoute><PageTransition><VerifyOTP role="candidate" /></PageTransition></GuestRoute>} />
        <Route path="/rezulter/verify-otp" element={<GuestRoute><PageTransition><VerifyOTP role="rezulter" /></PageTransition></GuestRoute>} />
        <Route path="/candidate/reset-password" element={<GuestRoute><PageTransition><ResetPassword role="candidate" /></PageTransition></GuestRoute>} />
        <Route path="/rezulter/reset-password" element={<GuestRoute><PageTransition><ResetPassword role="rezulter" /></PageTransition></GuestRoute>} />
        <Route path="*" element={<PageTransition><Home /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
