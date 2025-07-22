import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import WebhookReceiver from './components/WebhookReceiver';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import LoadingSpinner from './components/LoadingSpinner';
import { ROUTES } from './constants';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <WebhookReceiver />
        <Routes>
          <Route 
            path="/" 
            element={<Navigate to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />} 
          />
          <Route 
            path={ROUTES.LOGIN} 
            element={user ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginPage />} 
          />
          <Route 
            path={ROUTES.DASHBOARD} 
            element={user ? <DashboardPage /> : <Navigate to={ROUTES.LOGIN} replace />} 
          />
          <Route 
            path={ROUTES.RESULTS} 
            element={user ? <ResultsPage /> : <Navigate to={ROUTES.LOGIN} replace />} 
          />
          <Route 
            path={ROUTES.SETTINGS} 
            element={user ? <SettingsPage /> : <Navigate to={ROUTES.LOGIN} replace />} 
          />
          <Route 
            path={ROUTES.HELP} 
            element={user ? <HelpPage /> : <Navigate to={ROUTES.LOGIN} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;