import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { TeamsProvider } from './hooks/useTeams';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import IdeaDetailPage from './pages/IdeaDetailPage';
import CreateIdeaPage from './pages/CreateIdeaPage';
import ProfilePage from './pages/ProfilePage';
import TeamDetailPage from './pages/TeamDetailPage';
import CreateTeamPage from './pages/CreateTeamPage';
import CreateInvestmentPage from './pages/CreateInvestmentPage';
import InvestorProfilePage from './pages/InvestorProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import NotFoundPage from './pages/NotFoundPage';

// Layouts
import MainLayout from './components/layouts/MainLayout';

// Guards
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="ideas/:id" element={<IdeaDetailPage />} />
        <Route path="teams/:id" element={<TeamDetailPage />} />
        
        {/* Public routes */}
        <Route
          path="login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="register"
          element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
        />

        {/* Protected routes */}
        <Route
          path="create-idea"
          element={
            <ProtectedRoute>
              <CreateIdeaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="create-team"
          element={
            <ProtectedRoute>
              <CreateTeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="create-team/:id"
          element={
            <ProtectedRoute>
              <CreateTeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="investor-profile"
          element={
            <ProtectedRoute>
              <InvestorProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="create-investment"
          element={
            <ProtectedRoute>
              <CreateInvestmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="create-investment/:ideaId"
          element={
            <ProtectedRoute>
              <CreateInvestmentPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;