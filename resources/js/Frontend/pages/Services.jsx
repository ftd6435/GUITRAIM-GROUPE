import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HardHat, Home as HomeIcon, Truck, Monitor, CheckCircle2, ArrowRight, Download, Mail, Loader2 } from 'lucide-react';
import Button from '../../Components/ui/Button';
import { cn } from '../../utils/utils';
import Reveal from '../components/Reveal';
import api from '../../utils/api';
import { applySeo } from '../../utils/seo';

const Services = () => {
  const [sectors, setSectors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedServices, setExpandedServices] = useState({});
  const [page, setPage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sectorsResponse, servicesResponse] = await Promise.all([
          api.get('/sectors'),
          api.get('/services'),
        ]);
        setSectors(sectorsResponse.data || []);
        setServices(servicesResponse.data || []);
      } catch (e) {
        setSectors([]);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await api.get('/pages/services');
        setPage(response.data || null);
        applySeo({
          title: response?.data?.meta_title,
          description: response?.data?.meta_description,
          fallbackTitle: 'Services - GUITRAIM GROUPE',
        });
      } catch (e) {
        setPage(null);
        applySeo({ title: null, description: null, fallbackTitle: 'Services - GUITRAIM GROUPE' });
      }
    };
    fetchPage();
  }, []);

  const iconForSector = (sectorSlug) => {
    const slug = (sectorSlug || '').toLowerCase();
    if (slug.includes('construct') || slug.includes('btp')) return <HardHat size={32} />;
    if (slug.includes('immo') || slug.includes('terrain')) return <HomeIcon size={32} />;
    if (slug.includes('transport') || slug.includes('logist')) return <Truck size={32} />;
    return <Monitor size={32} />;
  };

  const fallbackImagesBySector = {
    construction: [
      'https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?q=80&w=800&auto=format&fit=crop',
    ],
    immobilier: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    ],
    transport: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590486803833-ffc930279883?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606185540410-dd628c04eec2?q=80&w=800&auto=format&fit=crop',
    ],
    technologie: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    ],
  };

  const highlightsBySector = {
    immobilier: {
      title: 'Zones Géographiques Couvertes',
      items: ['Grand Conakry', 'Kindia', 'Mamou', 'Labé', 'Kankan', 'Nzérékoré'],
    },
    transport: {
      title: 'Types de Transport Proposés',
      items: ['Transport routier', 'Transit & Douane', 'Logistique Internationale', 'Distribution urbaine', 'Fret aérien & maritime', 'Transport Frigorifique'],
    },
    technologie: {
      title: 'Technologies Maîtrisées',
      items: ['React / Next.js', 'E-commerce', 'Laravel / PHP', 'Mobile Apps', 'WordPress / CMS', 'Cloud Hosting'],
    },
  };

  const sectorsView = useMemo(() => {
    return (sectors || []).map((sector) => {
      const sectorServices = (services || []).filter((s) => s?.sector?.slug === sector.slug);
      const features = sectorServices.slice(0, 4).map((s) => s.title);
      const galleryImages = sectorServices
        .flatMap((s) => (s?.images || []).map((img) => img?.image_path))
        .filter(Boolean);
      const mainImages = sectorServices.map((s) => s?.image_path).filter(Boolean);
      const images = [...galleryImages, ...mainImages].slice(0, 4);

      const key =
        sector.slug?.includes('construct') ? 'construction' :
        sector.slug?.includes('immo') ? 'immobilier' :
        sector.slug?.includes('transport') || sector.slug?.includes('logist') ? 'transport' :
        'technologie';

      const fallbackImages = fallbackImagesBySector[key] || fallbackImagesBySector.technologie;
      const finalImages = [...images, ...fallbackImages].slice(0, 4);

      const cta =
        key === 'transport'
          ? 'Demander un Devis Transport'
          : key === 'immobilier'
            ? 'Découvrir Nos Offres Immobilières'
            : key === 'technologie'
              ? 'Voir Nos Réalisations Tech'
              : 'Voir Nos Projets Construction';

      return {
        id: sector.slug,
        icon: iconForSector(sector.slug),
        title: sector.name,
        desc: sector.description || '',
        features,
        services: sectorServices,
        images: finalImages,
        cta,
        highlights: sector.highlight_title || (sector.highlight_items || []).length
          ? {
              title: sector.highlight_title || 'Informations',
              items: (sector.highlight_items || []).filter(Boolean),
            }
          : highlightsBySector[key],
        key,
      };
    });
  }, [sectors, services]);

  const toggleService = (serviceId) => {
    setExpandedServices((prev) => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };

  return (
    <div className="pb-24">
      {/* Header Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={page?.hero_image_path || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop"}
            alt="Nos Services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1A3A5C]/80 backdrop-blur-sm" />
        </div>
        <Reveal className="container relative z-10 px-4 lg:px-8 text-center space-y-4" direction="up">
          <div className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center justify-center gap-2">
            Accueil <ArrowRight size={14} /> Services
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white">Nos Services</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto font-medium">
            Des solutions expertes et intégrées pour accompagner votre croissance dans tous les secteurs clés.
          </p>
        </Reveal>
      </section>

      {/* Sectors Navigation */}
      <Reveal className="bg-white border-b border-[#E0E6ED] sticky top-20 z-30 hidden lg:block" direction="none">
        <div className="container px-4 lg:px-8">
          <div className="flex items-center justify-center gap-12 h-20">
            {loading ? (
              <div className="flex items-center gap-2 text-sm font-bold text-[hsla(210,20%,40%,1)]">
                <Loader2 className="animate-spin" size={18} />
                Chargement...
              </div>
            ) : (
              sectorsView.map((sector) => (
              <a
                key={sector.id}
                href={`#${sector.id}`}
                className="flex items-center gap-3 text-sm font-bold text-[hsla(210,20%,40%,1)] hover:text-[#1A3A5C] transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg bg-[hsla(210,25%,98%,1)] flex items-center justify-center group-hover:bg-[#1A3A5C] group-hover:text-white transition-all">
                  {React.cloneElement(sector.icon, { size: 16 })}
                </span>
                {sector.title}
              </a>
            ))
            )}
          </div>
        </div>
      </Reveal>

      {/* Intro Section */}
      <section className="container px-4 lg:px-8 py-24 text-center space-y-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-[#1A3A5C]">Une Expertise Multi-Sectorielle à Votre Service</h2>
        <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] max-w-4xl mx-auto leading-relaxed">
          GUITRAIM GROUPE vous offre l'avantage unique d'un partenaire intégré capable de répondre à tous vos besoins de génie civil et d'infrastructure. Notre approche coordonnée entre nos quatre secteurs d'activité garantit une synergie optimale pour la réussite de vos projets les plus ambitieux.
        </p>
      </section>

      {/* Sectors Detail */}
      <section className="container px-4 lg:px-8 space-y-32">
        {sectorsView.map((sector, index) => (
          <div key={sector.id} id={sector.id} className={cn(
            "flex flex-col gap-12 lg:gap-20",
            index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"
          )}>
            {/* Content Side */}
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center">
                  {sector.icon}
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-[#1A3A5C]">{sector.title}</h3>
              </div>

              <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
                {sector.desc}
              </p>

              {(sector.services || []).length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Nos Services</h4>
                  <div className="space-y-3">
                    {sector.services.map((service) => {
                      const hasContent = !!service?.content;
                      const isExpanded = !!expandedServices[service.id];
                      return (
                        <div
                          key={service.id}
                          className="bg-white rounded-[24px] border border-[#E0E6ED] p-6 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="text-base font-bold text-[hsla(210,30%,20%,1)]">
                                {service.title}
                              </div>
                              {service.description ? (
                                <div className="text-sm font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
                                  {service.description}
                                </div>
                              ) : null}
                            </div>
                            {hasContent ? (
                              <button
                                type="button"
                                onClick={() => toggleService(service.id)}
                                className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold border border-[#E0E6ED] bg-[hsla(210,25%,98%,1)] text-[#1A3A5C] hover:border-[#1A3A5C] transition-colors"
                              >
                                {isExpanded ? 'Masquer' : 'Voir détails'}
                              </button>
                            ) : null}
                          </div>

                          {hasContent && isExpanded ? (
                            <div
                              className="text-sm font-medium text-[hsla(210,20%,40%,1)] leading-relaxed pt-2 border-t border-[#E0E6ED] [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[#4A8BC2] [&_a]:font-bold"
                              dangerouslySetInnerHTML={{ __html: service.content }}
                            />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {sector.highlights && (
                <div className="bg-[hsla(210,25%,98%,1)] p-8 rounded-[32px] border border-[#E0E6ED] space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">{sector.highlights.title}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sector.highlights.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm font-bold text-[hsla(210,20%,40%,1)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4A8BC2]" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex">
                <Link to={sector.key === 'transport' ? '/contact' : `/projets?filter=${sector.id}`} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold text-base shadow-xl shadow-[#1A3A5C]/20">
                    {sector.cta}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Images Side */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {sector.images.map((img, idx) => (
                <div key={idx} className={cn(
                  "rounded-[24px] overflow-hidden border border-[#E0E6ED] shadow-sm",
                  idx === 0 || idx === 3 ? "aspect-square" : "aspect-[4/5]"
                )}>
                  <img src={img} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="container px-4 lg:px-8 mt-32">
        <div className="bg-[#1A3A5C] rounded-[48px] p-12 lg:p-24 text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <h3 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">
              Prêt à Découvrir Nos Solutions ?
            </h3>
            <p className="text-lg lg:text-xl font-medium text-white/70 leading-relaxed">
              Contactez notre équipe d'experts pour une consultation personnalisée et découvrez comment nos quatre secteurs d'activité peuvent transformer vos projets en réussites concrètes.
            </p>
          </div>

          <div className="relative z-10 pt-4 flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-auto min-h-[4rem] py-3 px-4 sm:px-12 rounded-[24px] bg-[#4A8BC2] hover:bg-[#4A8BC2]/90 text-white font-bold text-base sm:text-lg shadow-2xl shadow-[#4A8BC2]/40 gap-3">
                <Mail size={24} className="shrink-0" />
                <span>Demander une Consultation</span>
              </Button>
            </Link>
            <Button variant="secondary" className="w-full sm:w-auto h-auto min-h-[4rem] py-3 px-4 sm:px-12 rounded-[24px] bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md font-bold text-base sm:text-lg gap-3">
              <Download size={24} className="shrink-0" />
              <span>Télécharger Notre Brochure</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
