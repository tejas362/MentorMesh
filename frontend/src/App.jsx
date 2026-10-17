import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AlumniDirectoryPage from './pages/AlumniDirectoryPage';
import AlumniProfilePage from './pages/AlumniProfilePage';
import RecommendationsPage from './pages/RecommendationsPage';
import MentorshipRequestPage from './pages/MentorshipRequestPage';
import MessageGeneratorPage from './pages/MessageGeneratorPage';
import RequestManagementPage from './pages/RequestManagementPage';
import ProfileEditPage from './pages/ProfileEditPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/directory" element={<AlumniDirectoryPage />} />
          <Route path="/alumni/:id" element={<AlumniProfilePage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/generator" element={<MessageGeneratorPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request/:alumniId"
            element={
              <ProtectedRoute>
                <MentorshipRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <RequestManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileEditPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
