import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './layout/AppShell';
import { CmsPage } from './pages/CmsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { UserPortalPage } from './pages/UserPortalPage';
import { VetPortalPage } from './pages/VetPortalPage';

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        跳到主内容
      </a>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/user" element={<UserPortalPage />} />
          <Route path="/vet" element={<VetPortalPage />} />
          <Route path="/cms" element={<CmsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}