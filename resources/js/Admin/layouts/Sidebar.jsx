import React from "react";
import {
    LayoutDashboard,
    Box,
    Briefcase,
    FileText,
    Users,
    Handshake,
    File,
    Mail,
    Settings,
    UserCircle,
    ChevronDown,
    ChevronRight,
    LogOut,
    X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../utils/utils";
import api from "../../utils/api";

const menuItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/admin" },
    {
        icon: Box,
        label: "Catalogue",
        path: "/admin/catalogue",
        subItems: [
            { label: "Secteurs", path: "/admin/sectors" },
            { label: "Services", path: "/admin/services" },
            { label: "Projets", path: "/admin/projects" },
        ],
    },
    {
        icon: FileText,
        label: "Blog",
        path: "/admin/blog",
        subItems: [
            { label: "Articles", path: "/admin/blog/articles" },
            { label: "Commentaires", path: "/admin/blog/comments" },
            { label: "Catégories", path: "/admin/blog/categories" },
            { label: "Tags", path: "/admin/blog/tags" },
        ],
    },
    {
        icon: File,
        label: "Contenu",
        path: "/admin/content",
        subItems: [
            { label: "Pages", path: "/admin/pages" },
            { label: "Équipe", path: "/admin/team" },
            { label: "Témoignages", path: "/admin/testimonials" },
            { label: "Partenaires", path: "/admin/partners" },
            { label: "Médiathèque", path: "/admin/media" },
        ],
    },
    {
        icon: Briefcase,
        label: "Recrutement",
        path: "/admin/recruitment",
        subItems: [
            { label: "Emplois", path: "/admin/jobs" },
            { label: "Candidatures", path: "/admin/applications" },
        ],
    },
    {
        icon: Mail,
        label: "Communication",
        path: "/admin/communication",
        subItems: [
            { label: "Contacts", path: "/admin/contacts" },
            { label: "Newsletter", path: "/admin/newsletter" },
        ],
    },
    {
        icon: Handshake,
        label: "CRM",
        path: "/admin/crm",
        subItems: [
            { label: "Analyse", path: "/admin/crm" },
            { label: "Clients", path: "/admin/crm/clients" },
            { label: "Devis", path: "/admin/crm/quotes" },
            { label: "Factures", path: "/admin/crm/invoices" },
        ],
    },
    { icon: Settings, label: "Paramètres", path: "/admin/settings" },
    { icon: UserCircle, label: "Utilisateurs", path: "/admin/users" },
];

const Sidebar = ({ mobileOpen = false, onClose = () => {} }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [openSubmenu, setOpenSubmenu] = React.useState(null);

    const toggleSubmenu = (label) => {
        setOpenSubmenu(openSubmenu === label ? null : label);
    };

    React.useEffect(() => {
        const activeParent = menuItems.find((item) => {
            if (!item.subItems) return false;
            return item.subItems.some((sub) => location.pathname === sub.path);
        });
        if (activeParent) {
            setOpenSubmenu(activeParent.label);
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?"))
            return;
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error("Erreur lors de la déconnexion", err);
        } finally {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            delete api.defaults.headers.common["Authorization"];
            navigate("/auth/login");
            onClose();
        }
    };

    const handleNavigate = () => {
        onClose();
    };

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-[#1A3A5C] text-white border-r border-white/10 overflow-y-auto flex flex-col transform transition-transform duration-200 lg:sticky lg:top-0 lg:translate-x-0 lg:w-64 lg:h-screen",
                mobileOpen ? "translate-x-0" : "-translate-x-full",
            )}
        >
            <div className="px-6 py-5 flex items-center justify-between">
                <div className="bg-white rounded-2xl border border-[#E0E6ED] shadow-sm p-2 flex items-center justify-center">
                    <img src="/img/white_logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="lg:hidden w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center"
                    aria-label="Fermer le menu"
                >
                    <X size={18} />
                </button>
            </div>

            <nav className="mt-2 px-4 space-y-1 flex-1">
                {menuItems.map((item) => {
                    const isActive =
                        location.pathname === item.path ||
                        (item.subItems &&
                            item.subItems.some(
                                (sub) => location.pathname === sub.path,
                            ));
                    const hasSubItems = !!item.subItems;
                    const isSubmenuOpen = openSubmenu === item.label;

                    return (
                        <div key={item.label}>
                            {hasSubItems ? (
                                <button
                                    type="button"
                                    onClick={() => toggleSubmenu(item.label)}
                                    aria-expanded={isSubmenuOpen}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                                        isActive
                                            ? "bg-white/15 text-white"
                                            : "text-white/85 hover:bg-white/10",
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} />
                                        <span>{item.label}</span>
                                    </div>
                                    {isSubmenuOpen ? (
                                        <ChevronDown size={16} />
                                    ) : (
                                        <ChevronRight size={16} />
                                    )}
                                </button>
                            ) : (
                                <Link
                                    to={item.path}
                                    onClick={handleNavigate}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                                        isActive
                                            ? "bg-white/15 text-white"
                                            : "text-white/85 hover:bg-white/10",
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
                                            onClick={handleNavigate}
                                            aria-current={location.pathname === sub.path ? "page" : undefined}
                                            className={cn(
                                                "block px-4 py-2 text-sm rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                                                location.pathname === sub.path
                                                    ? "text-white font-semibold bg-white/15"
                                                    : "text-white/75 hover:bg-white/10 hover:text-white",
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

            <div className="p-4 border-t border-white/10">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-white/85 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
