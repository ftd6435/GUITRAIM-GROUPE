import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AD';

  return (
    <div className="flex min-h-screen bg-[hsla(40,30%,99%,1)] font-sans text-[hsla(210,30%,20%,1)]">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            {user && (
              <p className="text-sm font-medium text-[hsla(210,20%,40%,1)] mt-1">
                Bon retour, <span className="text-[#1A3A5C] font-bold">{user.name}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-white shadow-sm border border-[#E0E6ED] hover:bg-[hsla(210,25%,98%,1)] transition-all hover:scale-105 active:scale-95">
              <span className="sr-only">Profil</span>
              <div className="w-8 h-8 rounded-full bg-[#1A3A5C] flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto page-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
