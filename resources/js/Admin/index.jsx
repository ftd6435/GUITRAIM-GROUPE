import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Sectors from './pages/Sectors';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Articles from './pages/Articles';
import Categories from './pages/Categories';
import Tags from './pages/Tags';
import MediaLibrary from './pages/MediaLibrary';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import Contacts from './pages/Contacts';
import Settings from './pages/Settings';
import Team from './pages/Team';
import Testimonials from './pages/Testimonials';
import Partners from './pages/Partners';
import Pages from './pages/Pages';
import Newsletter from './pages/Newsletter';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Clients from './pages/Clients';
import Quotes from './pages/Quotes';
import Invoices from './pages/Invoices';
import CrmDashboard from './pages/CrmDashboard';

import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('auth_token');
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

const AdminApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="sectors" element={<Sectors />} />
          <Route path="services" element={<Services />} />
          <Route path="projects" element={<Projects />} />

          <Route path="blog" element={<Outlet />}>
            <Route path="articles" element={<Articles />} />
            <Route path="categories" element={<Categories />} />
            <Route path="tags" element={<Tags />} />
          </Route>

          <Route path="team" element={<Team />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="partners" element={<Partners />} />
          <Route path="pages" element={<Pages />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="applications" element={<Applications />} />
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<Profile />} />
          <Route path="crm" element={<Outlet />}>
            <Route index element={<CrmDashboard />} />
            <Route path="dashboard" element={<Navigate to="/admin/crm" replace />} />
            <Route path="clients" element={<Clients />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="invoices" element={<Invoices />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const rootElement = document.getElementById('app');
if (rootElement) {
  createRoot(rootElement).render(<AdminApp />);
}

export default AdminApp;
