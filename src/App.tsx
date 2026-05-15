import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Student view
import { StudentLayout } from './layouts/StudentLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Catalogue } from './pages/Catalogue/Catalogue';
import { CoursePlayer } from './pages/CoursePlayer/CoursePlayer';
import { Community } from './pages/Community/Community';
import { Messages } from './pages/Messages/Messages';
import { Profile } from './pages/Profile/Profile';

// Teacher view
import { TeacherLayout } from './layouts/TeacherLayout';
import { ProfDashboard } from './pages/ProfDashboard/ProfDashboard';
import { ProfMesCours } from './pages/ProfMesCours/ProfMesCours';
import { ProfCourseEditor } from './pages/ProfCourseEditor/ProfCourseEditor';
import { ProfEleves } from './pages/ProfEleves/ProfEleves';
import { ProfCommunity } from './pages/ProfCommunity/ProfCommunity';
import { ProfMessages } from './pages/ProfMessages/ProfMessages';

// Shared
import { RoleSwitcher } from './components/RoleSwitcher/RoleSwitcher';

export default function App() {
  return (
    <BrowserRouter basename="/AVGuitareFormation">
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/mon-espace" replace />} />

        {/* Student routes */}
        <Route element={<StudentLayout />}>
          <Route path="/mon-espace" element={<Dashboard />} />
          <Route path="/cours" element={<Catalogue />} />
          <Route path="/cours/:courseId" element={<CoursePlayer />} />
          <Route path="/communaute" element={<Community />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profil" element={<Profile />} />
        </Route>

        {/* Teacher routes */}
        <Route path="/professeur" element={<Navigate to="/professeur/dashboard" replace />} />
        <Route element={<TeacherLayout />}>
          <Route path="/professeur/dashboard" element={<ProfDashboard />} />
          <Route path="/professeur/mes-cours" element={<ProfMesCours />} />
          <Route path="/professeur/mes-cours/:courseId/edit" element={<ProfCourseEditor />} />
          <Route path="/professeur/eleves" element={<ProfEleves />} />
          <Route path="/professeur/communaute" element={<ProfCommunity />} />
          <Route path="/professeur/messages" element={<ProfMessages />} />
        </Route>
      </Routes>

      {/* Dev role switcher — always visible */}
      <RoleSwitcher />
    </BrowserRouter>
  );
}
