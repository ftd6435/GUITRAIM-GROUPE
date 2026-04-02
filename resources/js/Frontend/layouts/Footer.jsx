import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Link as LinkIcon, User, Camera, Share2 } from 'lucide-react';
import api from '../../utils/api';

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
                >
                  <User size={18} />
                </a>
              ) : null}
              {contactInfo.linkedin_url ? (
                <a
                  href={contactInfo.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-[hsla(210,20%,90%,1)] flex items-center justify-center text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white transition-all"
                >
                  <LinkIcon size={18} />
                </a>
              ) : null}
              {contactInfo.x_url ? (
                <a
                  href={contactInfo.x_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-[hsla(210,20%,90%,1)] flex items-center justify-center text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white transition-all"
                >
                  <Share2 size={18} />
                </a>
              ) : null}
              {contactInfo.instagram_url ? (
                <a
                  href={contactInfo.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-[hsla(210,20%,90%,1)] flex items-center justify-center text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white transition-all"
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
