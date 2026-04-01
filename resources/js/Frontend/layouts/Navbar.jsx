import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { cn } from '../../utils/utils';
import Button from '../../Components/ui/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Projets', path: '/projets' },
    { name: 'Blog', path: '/blog' },
    { name: 'Équipe', path: '/equipe' },
    { name: 'À Propos', path: '/a-propos' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[hsla(210,20%,94%,1)] flex justify-center">
      <div className="container px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/img/white_logo.png" alt="GUITRAIM GROUPE" className="h-10 lg:h-12 object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-bold transition-colors hover:text-[#1A3A5C]",
                  location.pathname === link.path
                    ? "text-[#1A3A5C]"
                    : "text-[hsla(210,20%,40%,1)]"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/contact">
              <Button className="h-11 px-6 rounded-xl bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold text-sm">
                Demander un Devis
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-[#1A3A5C]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden absolute top-20 left-0 right-0 bg-white border-b border-[hsla(210,20%,94%,1)] transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <nav className="flex flex-col p-4 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-base font-bold p-2 rounded-lg transition-colors",
                location.pathname === link.path
                  ? "bg-[#1A3A5C]/5 text-[#1A3A5C]"
                  : "text-[hsla(210,20%,40%,1)]"
              )}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setIsOpen(false)}>
            <Button className="w-full h-12 bg-[#1A3A5C] text-white font-bold">
              Demander un Devis
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
