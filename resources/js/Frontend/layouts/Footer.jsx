import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Camera } from 'lucide-react';
import api from '../../utils/api';

const FacebookIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.6-1.6h1.6V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7.5v3H10v8h3.5z" />
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M6.94 6.5a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM4.9 21h4.08V8.8H4.9V21ZM10.9 8.8h3.91v1.67h.05c.54-1.02 1.87-2.1 3.86-2.1 4.13 0 4.89 2.72 4.89 6.27V21h-4.08v-5.54c0-1.32-.03-3.01-1.84-3.01-1.84 0-2.12 1.44-2.12 2.92V21H10.9V8.8Z" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M18.3 2H21l-6.5 7.4L22 22h-6.8l-5.3-6.9L3.9 22H1.2l7-8L1 2h6.9l4.8 6.3L18.3 2Zm-1.2 18h1.5L7.9 3.9H6.3L17.1 20Z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSettings(response.data || null);
      } catch (e) {
        setSettings(null);
      }
    };
    fetchSettings();
  }, []);

  const contactInfo = useMemo(() => {
    return {
      address: settings?.address || 'Quartier Almamya, Commune de Kaloum, Conakry, Guinée',
      phone: settings?.phone || '+224 628 xx xx xx',
      email: settings?.email || 'contact@guitraimgroupe.gn',
      facebook_url: settings?.facebook_url || '',
      linkedin_url: settings?.linkedin_url || '',
      x_url: settings?.x_url || '',
      instagram_url: settings?.instagram_url || '',
    };
  }, [settings]);

  return (
    <footer className="bg-white border-t border-[hsla(210,20%,94%,1)] pt-20 pb-10 flex justify-center">
      <div className="container px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img src="/img/white_logo.png" alt="GUITRAIM GROUPE" className="h-10 object-contain" />
            </Link>
            <p className="text-sm font-medium leading-relaxed text-[hsla(210,20%,40%,1)] max-w-xs">
              Partenaire multi-services de référence en Guinée, spécialisé dans la construction, l'immobilier, le transport et les solutions technologiques.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Navigation Rapide</h4>
            <ul className="space-y-3">
              {[
                { name: 'Services', path: '/services' },
                { name: 'Projets', path: '/projets' },
                { name: 'Blog', path: '/blog' },
                { name: 'Équipe', path: '/equipe' },
                { name: 'À Propos', path: '/a-propos' },
                { name: 'Contact', path: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm font-semibold text-[hsla(210,20%,40%,1)] hover:text-[#1A3A5C] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#1A3A5C] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-[hsla(210,20%,40%,1)]">
                  {contactInfo.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#1A3A5C] shrink-0" />
                <span className="text-sm font-semibold text-[hsla(210,20%,40%,1)]">
                  {contactInfo.phone}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#1A3A5C] shrink-0" />
                <span className="text-sm font-semibold text-[hsla(210,20%,40%,1)]">
                  {contactInfo.email}
                </span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Suivez-Nous</h4>
            <div className="flex items-center gap-4">
              {contactInfo.facebook_url ? (
                <a
                  href={contactInfo.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-[hsla(210,20%,90%,1)] flex items-center justify-center text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white transition-all"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-[18px] h-[18px]" />
                </a>
              ) : null}
              {contactInfo.linkedin_url ? (
                <a
                  href={contactInfo.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-[hsla(210,20%,90%,1)] flex items-center justify-center text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="w-[18px] h-[18px]" />
                </a>
              ) : null}
              {contactInfo.x_url ? (
                <a
                  href={contactInfo.x_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-[hsla(210,20%,90%,1)] flex items-center justify-center text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white transition-all"
                  aria-label="X"
                >
                  <XIcon className="w-[18px] h-[18px]" />
                </a>
              ) : null}
              {contactInfo.instagram_url ? (
                <a
                  href={contactInfo.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-[hsla(210,20%,90%,1)] flex items-center justify-center text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Camera size={18} />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[hsla(210,20%,94%,1)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-[hsla(210,20%,60%,1)]">
          <p>© {currentYear} GUITRAIM GROUPE. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link to="/mentions-legales" className="hover:text-[#1A3A5C]">Mentions légales</Link>
            <Link to="/politique-confidentialite" className="hover:text-[#1A3A5C]">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
