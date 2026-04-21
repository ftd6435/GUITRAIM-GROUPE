import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings as SettingsIcon, ChevronDown, Menu, Search, Bell, Clock } from 'lucide-react';
import Sidebar from './Sidebar';
import { cn } from '../../utils/utils';
import api from '../../utils/api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const profileRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const alertsRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [alerts, setAlerts] = useState({
    contactsNew24h: 0,
    applicationsNew: 0,
    applicationsNew24h: 0,
  });
  const [now, setNow] = useState(() => new Date());

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AD';

  const quickLinks = [
    { label: 'Tableau de bord', path: '/admin', keywords: ['dashboard', 'accueil'] },
    { label: 'Projets', path: '/admin/projects', keywords: ['projet', 'projects'] },
    { label: 'Articles', path: '/admin/blog/articles', keywords: ['blog', 'post', 'publication'] },
    { label: 'Contacts', path: '/admin/contacts', keywords: ['messages', 'inbox'] },
    { label: 'Candidatures', path: '/admin/applications', keywords: ['recrutement', 'applications'] },
    { label: 'CRM · Analyse', path: '/admin/crm', keywords: ['crm', 'analyse', 'dashboard'] },
    { label: 'CRM · Clients', path: '/admin/crm/clients', keywords: ['clients', 'client'] },
    { label: 'CRM · Devis', path: '/admin/crm/quotes', keywords: ['devis', 'quotes'] },
    { label: 'CRM · Factures', path: '/admin/crm/invoices', keywords: ['factures', 'invoices'] },
    { label: 'Paramètres', path: '/admin/settings', keywords: ['settings', 'configuration'] },
    { label: 'Utilisateurs', path: '/admin/users', keywords: ['users', 'roles'] },
  ];

  const searchResults = (() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return quickLinks
      .filter((it) => {
        const hay = [it.label, ...(it.keywords || [])].join(' ').toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 8);
  })();

  const alertsTotal = Math.max(
    0,
    Number(alerts.contactsNew24h || 0) + Number(alerts.applicationsNew || 0),
  );

  const formatHeaderDate = (date) => {
    try {
      const out = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZone: 'GMT',
      }).format(date);
      return `${out} GMT`;
    } catch {
      return '';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/auth/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      const clickedInsideSearch =
        (desktopSearchRef.current && desktopSearchRef.current.contains(event.target)) ||
        (mobileSearchRef.current && mobileSearchRef.current.contains(event.target));
      if (!clickedInsideSearch) {
        setIsSearchOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target)) {
        setAlertsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsSidebarOpen(false);
        setIsSearchOpen(false);
        setAlertsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchAlerts = async () => {
      const results = await Promise.allSettled([
        api.get('/contact/summary'),
        api.get('/applications/summary'),
      ]);

      const contactRes = results[0]?.status === 'fulfilled' ? results[0].value : null;
      const appsRes = results[1]?.status === 'fulfilled' ? results[1].value : null;

      const next = {
        contactsNew24h: Number(contactRes?.data?.new_24h || 0),
        applicationsNew: Number(appsRes?.data?.new || 0),
        applicationsNew24h: Number(appsRes?.data?.new_24h || 0),
      };

      if (!cancelled) setAlerts(next);
    };

    fetchAlerts();
    const id = window.setInterval(fetchAlerts, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    const first = searchResults[0];
    if (!first) return;
    navigate(first.path);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handlePickSearchItem = (item) => {
    navigate(item.path);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <div className="min-h-screen bg-[hsla(40,30%,99%,1)] font-sans text-[hsla(210,30%,20%,1)] lg:flex">
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <Sidebar mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="lg:flex-1 lg:min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-[#1A3A5C] text-white border-b border-white/10 relative">
          <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Ouvrir le menu"
              >
                <Menu size={18} />
              </button>
              <div className="font-bold tracking-wide truncate hidden sm:block">Administration</div>
            </div>

            <div className="flex-1 min-w-0 hidden md:flex justify-center" ref={desktopSearchRef}>
              <form onSubmit={handleSubmitSearch} className="w-full max-w-xl relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Rechercher… (Clients, Factures, Devis, etc.)"
                  className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/10 border border-white/15 placeholder:text-white/60 text-sm text-white outline-none focus:bg-white/15 focus:border-white/25 focus-visible:ring-2 focus-visible:ring-white/50 transition-colors"
                />

                {isSearchOpen && searchQuery.trim() && (
                  <div className="absolute top-full mt-2 w-full bg-white text-[hsla(210,30%,20%,1)] rounded-2xl shadow-xl border border-[#E0E6ED] overflow-hidden">
                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[hsla(210,20%,40%,1)] bg-[hsla(210,25%,98%,1)] border-b border-[#E0E6ED]">
                      Navigation rapide
                    </div>
                    <div className="py-1">
                      {searchResults.length ? (
                        searchResults.map((it) => (
                          <button
                            key={it.path}
                            type="button"
                            onClick={() => handlePickSearchItem(it)}
                            className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-[hsla(210,25%,98%,1)] transition-colors"
                          >
                            {it.label}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                          Aucun résultat.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="md:hidden w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Rechercher"
                onClick={() => {
                  setIsSearchOpen(true);
                  setAlertsOpen(false);
                  setIsDropdownOpen(false);
                  window.setTimeout(() => mobileSearchInputRef.current?.focus?.(), 0);
                }}
              >
                <Search size={18} />
              </button>

              <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-white/85">
                <Clock size={16} className="text-white/75" />
                <span className="whitespace-nowrap">{formatHeaderDate(now)}</span>
              </div>

              <div className="relative" ref={alertsRef}>
                <button
                  type="button"
                  onClick={() => setAlertsOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={alertsOpen}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 relative"
                  aria-label="Alertes"
                >
                  <Bell size={18} />
                  {alertsTotal > 0 ? (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#D64545] text-white text-[11px] font-extrabold flex items-center justify-center border-2 border-[#1A3A5C]">
                      {alertsTotal > 99 ? '99+' : String(alertsTotal)}
                    </span>
                  ) : null}
                </button>

                {alertsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white text-[hsla(210,30%,20%,1)] rounded-2xl shadow-xl border border-[#E0E6ED] overflow-hidden z-50">
                    <div className="px-4 py-3 bg-[hsla(210,25%,98%,1)] border-b border-[#E0E6ED]">
                      <div className="text-sm font-extrabold">Alertes</div>
                      <div className="text-xs font-medium text-[hsla(210,20%,40%,1)]">À traiter</div>
                    </div>

                    <div className="p-2 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAlertsOpen(false);
                          navigate('/admin/applications');
                        }}
                        className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 hover:bg-[hsla(210,25%,98%,1)] transition-colors"
                      >
                        <div className="text-sm font-semibold">Candidatures (statut: new)</div>
                        <div className="text-sm font-extrabold text-[#1A3A5C]">{Number(alerts.applicationsNew || 0)}</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAlertsOpen(false);
                          navigate('/admin/contacts');
                        }}
                        className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 hover:bg-[hsla(210,25%,98%,1)] transition-colors"
                      >
                        <div className="text-sm font-semibold">Messages reçus (24h)</div>
                        <div className="text-sm font-extrabold text-[#1A3A5C]">{Number(alerts.contactsNew24h || 0)}</div>
                      </button>
                    </div>

                    <div className="px-4 py-3 border-t border-[#E0E6ED] text-xs font-medium text-[hsla(210,20%,40%,1)]">
                      Nouveau (24h): candidatures {Number(alerts.applicationsNew24h || 0)}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-haspopup="menu"
                  aria-expanded={isDropdownOpen}
                  className="p-1 pr-3 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition-colors active:scale-95 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <span className="sr-only">Profil</span>
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {user?.avatar ? (
                      <img src={`/storage/images/avatars/${user.avatar}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <ChevronDown size={14} className={cn("text-white/85 transition-transform", isDropdownOpen && "rotate-180")} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white text-[hsla(210,30%,20%,1)] rounded-xl shadow-xl border border-[#E0E6ED] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-[#E0E6ED] mb-1">
                      <div className="font-bold text-sm truncate">{user?.name}</div>
                      <div className="text-xs text-[hsla(210,20%,40%,1)] truncate">{user?.email}</div>
                    </div>

                    <Link
                      to="/admin/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[hsla(210,30%,20%,1)] hover:bg-[hsla(210,25%,98%,1)] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={16} />
                      Voir le profil
                    </Link>

                    <Link
                      to="/admin/profile?edit=true"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[hsla(210,30%,20%,1)] hover:bg-[hsla(210,25%,98%,1)] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <SettingsIcon size={16} />
                      Modifier le profil
                    </Link>

                    <div className="h-px bg-[#E0E6ED] my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#D64545] hover:bg-[#FDEAEA] transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isSearchOpen && (
            <div className="md:hidden px-4 pb-4" ref={mobileSearchRef}>
              <form onSubmit={handleSubmitSearch} className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
                <input
                  ref={mobileSearchInputRef}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  placeholder="Rechercher…"
                  className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/10 border border-white/15 placeholder:text-white/60 text-sm text-white outline-none focus:bg-white/15 focus:border-white/25 focus-visible:ring-2 focus-visible:ring-white/50 transition-colors"
                />
              </form>

              {searchQuery.trim() ? (
                <div className="mt-2 bg-white text-[hsla(210,30%,20%,1)] rounded-2xl shadow-xl border border-[#E0E6ED] overflow-hidden">
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[hsla(210,20%,40%,1)] bg-[hsla(210,25%,98%,1)] border-b border-[#E0E6ED]">
                    Navigation rapide
                  </div>
                  <div className="py-1">
                    {searchResults.length ? (
                      searchResults.map((it) => (
                        <button
                          key={it.path}
                          type="button"
                          onClick={() => handlePickSearchItem(it)}
                          className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-[hsla(210,25%,98%,1)] transition-colors"
                        >
                          {it.label}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                        Aucun résultat.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </header>

        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto page-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
