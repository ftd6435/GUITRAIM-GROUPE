import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

// Admin Imports
import AdminLayout from "./Admin/layouts/AdminLayout";
import Dashboard from "./Admin/pages/Dashboard";
import Sectors from "./Admin/pages/Sectors";
import Services from "./Admin/pages/Services";
import Projects from "./Admin/pages/Projects";
import Articles from "./Admin/pages/Articles";
import Categories from "./Admin/pages/Categories";
import Tags from "./Admin/pages/Tags";
import MediaLibrary from "./Admin/pages/MediaLibrary";
import Jobs from "./Admin/pages/Jobs";
import Applications from "./Admin/pages/Applications";
import Contacts from "./Admin/pages/Contacts";
import Settings from "./Admin/pages/Settings";
import Team from "./Admin/pages/Team";
import Testimonials from "./Admin/pages/Testimonials";
import Partners from "./Admin/pages/Partners";
import Pages from "./Admin/pages/Pages";
import Newsletter from "./Admin/pages/Newsletter";
import Users from "./Admin/pages/Users";
import Profile from "./Admin/pages/Profile";
import Login from "./Admin/pages/Login";

// Frontend Imports (To be created)
import Home from "./Frontend/pages/Home";
import ServicesPage from "./Frontend/pages/Services";
import ProjectsPage from "./Frontend/pages/Projects";
import BlogPage from "./Frontend/pages/Blog";
import TeamPage from "./Frontend/pages/Team";
import AboutPage from "./Frontend/pages/About";
import ContactPage from "./Frontend/pages/Contact";
import CareersPage from "./Frontend/pages/Careers";
import ProjectDetailPage from "./Frontend/pages/ProjectDetail";
import ArticleDetailPage from "./Frontend/pages/ArticleDetail";
import FrontendLayout from "./Frontend/layouts/FrontendLayout";
import ErrorBoundary from "./Components/ErrorBoundary";
import { ToastProvider } from "./Components/ui/Toast";

import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('auth_token');
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

const App = () => {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* Frontend Routes */}
                            <Route path="/" element={<FrontendLayout />}>
                                <Route index element={<Home />} />
                                <Route path="services" element={<ServicesPage />} />
                                <Route path="projets" element={<ProjectsPage />} />
                                <Route path="blog" element={<BlogPage />} />
                                <Route path="equipe" element={<TeamPage />} />
                                <Route path="a-propos" element={<AboutPage />} />
                                <Route path="contact" element={<ContactPage />} />
                                <Route path="carrieres" element={<CareersPage />} />
                                <Route
                                    path="projets/:id"
                                    element={<ProjectDetailPage />}
                                />
                                <Route
                                    path="blog/:id"
                                    element={<ArticleDetailPage />}
                                />
                                {/* Future Frontend Routes */}
                                {/* <Route path="services" element={<FrontendServices />} /> */}
                                {/* <Route path="projets" element={<FrontendProjects />} /> */}
                                {/* <Route path="blog" element={<FrontendBlog />} /> */}
                                {/* <Route path="equipe" element={<FrontendTeam />} /> */}
                                {/* <Route path="a-propos" element={<About />} /> */}
                                {/* <Route path="contact" element={<Contact />} /> */}
                            </Route>

                            {/* Admin Routes */}
                            <Route path="/auth/login" element={<Login />} />

                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <AdminLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<Dashboard />} />
                                <Route path="sectors" element={<Sectors />} />
                                <Route path="services" element={<Services />} />
                                <Route path="projects" element={<Projects />} />

                                <Route path="blog">
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

                                <Route
                                    path="*"
                                    element={<Navigate to="/admin" replace />}
                                />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </ToastProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
};

const rootElement = document.getElementById("app");
if (rootElement) {
    createRoot(rootElement).render(<App />);
}

export default App;
