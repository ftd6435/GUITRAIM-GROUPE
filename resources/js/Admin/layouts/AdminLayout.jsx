import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings as SettingsIcon, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import { cn } from '../../utils/utils';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AD';

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/auth/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-1 pr-3 rounded-full bg-white shadow-sm border border-[#E0E6ED] hover:bg-[hsla(210,25%,98%,1)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span className="sr-only">Profil</span>
              <div className="w-8 h-8 rounded-full bg-[#1A3A5C] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                {user?.avatar ? (
                  <img src={`/storage/images/avatars/${user.avatar}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <ChevronDown size={14} className={cn("transition-transform", isDropdownOpen && "rotate-180")} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#E0E6ED] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-bottom border-[#E0E6ED] mb-1">
                  <div className="font-bold text-sm truncate">{user?.name}</div>
                  <div className="text-xs text-[hsla(210,20%,40%,1)] truncate">{user?.email}</div>
                </div>

                <Link
                  to="/admin/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[hsla(210,25%,98%,1)] transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User size={16} />
                  Voir le profil
                </Link>

                <Link
                  to="/admin/profile?edit=true"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[hsla(210,25%,98%,1)] transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <SettingsIcon size={16} />
                  Modifier le profil
                </Link>

                <div className="h-px bg-[#E0E6ED] my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#D64545] hover:bg-[#FDEAEA] transition-colors w-full text-left"
                >
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            )}
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
