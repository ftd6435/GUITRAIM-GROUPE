import React from 'react';
import {
  LayoutDashboard,
  Box,
  Wrench,
  Briefcase,
  FileText,
  Users,
  MessageSquare,
  Handshake,
  File,
  Phone,
  Mail,
  Send,
  Image,
  Settings,
  UserCircle,
  ChevronDown,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/utils';
import api from '../../utils/api';

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/admin' },
  { icon: Box, label: 'Secteurs', path: '/admin/sectors' },
  { icon: Wrench, label: 'Services', path: '/admin/services' },
  { icon: Briefcase, label: 'Projets', path: '/admin/projects' },
  {
    icon: FileText,
    label: 'Blog',
    path: '/admin/blog',
    subItems: [
      { label: 'Articles', path: '/admin/blog/articles' },
      { label: 'Commentaires', path: '/admin/blog/comments' },
      { label: 'Catégories', path: '/admin/blog/categories' },
      { label: 'Tags', path: '/admin/blog/tags' },
    ]
  },
  { icon: Users, label: 'Équipe', path: '/admin/team' },
  { icon: MessageSquare, label: 'Témoignages', path: '/admin/testimonials' },
  { icon: Handshake, label: 'Partenaires', path: '/admin/partners' },
  { icon: File, label: 'Pages', path: '/admin/pages' },
  { icon: Phone, label: 'Contacts', path: '/admin/contacts' },
  { icon: Briefcase, label: 'Emplois', path: '/admin/jobs' },
  { icon: Send, label: 'Candidatures', path: '/admin/applications' },
  { icon: Mail, label: 'Newsletter', path: '/admin/newsletter' },
  { icon: Image, label: 'Médiathèque', path: '/admin/media' },
  { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
  { icon: UserCircle, label: 'Utilisateurs', path: '/admin/users' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = React.useState(null);

  const toggleSubmenu = (label) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const handleLogout = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) return;
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      navigate('/auth/login');
    }
  };

  return (
    <aside className="w-64 bg-[hsla(210,18%,96%,1)] border-r border-[#E0E6ED] h-screen sticky top-0 overflow-y-auto flex flex-col">
      <div className="p-6 flex items-center justify-center">
        <img src="/img/white_logo.png" alt="Logo" className="h-10 object-contain" />
      </div>

      <nav className="mt-6 px-4 space-y-1 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.subItems && item.subItems.some(sub => location.pathname === sub.path));
          const hasSubItems = !!item.subItems;
          const isSubmenuOpen = openSubmenu === item.label;

          return (
            <div key={item.label}>
              {hasSubItems ? (
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                    isActive
                      ? "bg-[#1A3A5C] text-white"
                      : "text-[hsla(210,30%,20%,1)] hover:bg-[hsla(210,25%,98%,1)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </div>
                  {isSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                    isActive
                      ? "bg-[#1A3A5C] text-white"
                      : "text-[hsla(210,30%,20%,1)] hover:bg-[hsla(210,25%,98%,1)]"
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )}

              {hasSubItems && isSubmenuOpen && (
                <div className="mt-1 ml-9 space-y-1">
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.label}
                      to={sub.path}
                      className={cn(
                        "block px-4 py-2 text-sm rounded-lg transition-colors",
                        location.pathname === sub.path
                          ? "text-[#1A3A5C] font-semibold bg-[#4A8BC2]/10"
                          : "text-[hsla(210,20%,40%,1)] hover:bg-[hsla(210,25%,98%,1)]"
                      )}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#E0E6ED]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-[#D64545] hover:bg-[#D64545]/10 transition-colors"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
