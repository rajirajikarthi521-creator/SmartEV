import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';

// Pages
import { SplashPage } from './pages/SplashPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { LocationPage } from './pages/LocationPage';
import { MapPage } from './pages/MapPage';
import { StationListPage } from './pages/StationListPage';
import { StationDetailsPage } from './pages/StationDetailsPage';
import { RoutePage } from './pages/RoutePage';

// Layout wrapper for authenticated pages that include persistent Navbar
const AppLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Outlet />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public and Auth Flow Routes */}
            <Route path="/" element={<SplashPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Location Permission Onboarding */}
            <Route
              path="/location"
              element={
                <ProtectedRoute>
                  <LocationPage />
                </ProtectedRoute>
              }
            />

            {/* Authenticated Application Pages with Persistent Navbar */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/map" element={<MapPage />} />
              <Route path="/stations" element={<StationListPage />} />
              <Route path="/stations/:stationId" element={<StationDetailsPage />} />
              <Route path="/route/:stationId" element={<RoutePage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;
