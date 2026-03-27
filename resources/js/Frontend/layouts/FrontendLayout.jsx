import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PageLoader from '../components/PageLoader';

const FrontendLayout = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Route changes
    setLoading(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#1A3A5C] selection:text-white">
      {loading && <PageLoader />}
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default FrontendLayout;
