import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';

// Public pages
import { Landing } from './pages/Landing/Landing';
import { PackDetail } from './pages/PackDetail/PackDetail';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';

// Public catalogue (wrapped in public layout via Catalogue itself)
import { PublicCatalogue } from './pages/Catalogue/PublicCatalogue';
import { Payment } from './pages/Payment/Payment';

// Student app (auth required)
import { StudentLayout } from './layouts/StudentLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { CoursePlayer } from './pages/CoursePlayer/CoursePlayer';
import { Community } from './pages/Community/Community';
import { Messages } from './pages/Messages/Messages';
import { Profile } from './pages/Profile/Profile';

// Teacher app
import { TeacherLayout } from './layouts/TeacherLayout';
import { ProfDashboard } from './pages/ProfDashboard/ProfDashboard';
import { ProfMesCours } from './pages/ProfMesCours/ProfMesCours';
import { ProfCourseEditor } from './pages/ProfCourseEditor/ProfCourseEditor';
import { ProfEleves } from './pages/ProfEleves/ProfEleves';
import { ProfCommunity } from './pages/ProfCommunity/ProfCommunity';
import { ProfMessages } from './pages/ProfMessages/ProfMessages';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext();
  if (isLoading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function RequireTeacher({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuthContext();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'teacher') return <Navigate to="/mon-espace" replace />;
  return <>{children}</>;
}

function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  if (isLoading) return null;
  if (!isAuthenticated) return <>{children}</>;
  return <Navigate to={user?.role === 'teacher' ? '/professeur/dashboard' : '/mon-espace'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── Pages publiques (pas de layout wrapper — chaque page embarque PublicNavbar) ── */}
      <Route path="/" element={<Landing />} />
      <Route path="/cours" element={<PublicCatalogue />} />
      <Route path="/cours/:courseId" element={<PackDetail />} />
      <Route path="/paiement/:courseId" element={<RequireAuth><Payment /></RequireAuth>} />

      {/* ── Auth ── */}
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />

      {/* ── App étudiant (auth) ── */}
      <Route element={<RequireAuth><StudentLayout /></RequireAuth>}>
        <Route path="/mon-espace" element={<Dashboard />} />
        <Route path="/mon-espace/cours/:courseId" element={<CoursePlayer />} />
        <Route path="/communaute" element={<Community />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profil" element={<Profile />} />
      </Route>

      {/* ── App professeur (auth + admin) ── */}
      <Route path="/professeur" element={<Navigate to="/professeur/dashboard" replace />} />
      <Route element={<RequireTeacher><TeacherLayout /></RequireTeacher>}>
        <Route path="/professeur/dashboard" element={<ProfDashboard />} />
        <Route path="/professeur/mes-cours" element={<ProfMesCours />} />
        <Route path="/professeur/mes-cours/:courseId/edit" element={<ProfCourseEditor />} />
        <Route path="/professeur/eleves" element={<ProfEleves />} />
        <Route path="/professeur/communaute" element={<ProfCommunity />} />
        <Route path="/professeur/messages" element={<ProfMessages />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/Av_Guitare_Formation">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
