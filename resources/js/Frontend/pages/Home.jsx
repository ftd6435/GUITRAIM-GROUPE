import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, HardHat, Home as HomeIcon, Truck, Monitor, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../Components/ui/Button';
import { Card, CardContent } from '../../Components/ui/Card';
import Reveal from '../components/Reveal';
import api from '../../utils/api';

const Home = () => {
  const [sectors, setSectors] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sectorsResponse, projectsResponse] = await Promise.all([
          api.get('/sectors'),
          api.get('/projects', { params: { featured: true } }),
        ]);
        setSectors(sectorsResponse.data || []);
        setFeaturedProjects(projectsResponse.data || []);
      } catch (e) {
        setSectors([]);
        setFeaturedProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const iconForSector = (sectorSlug) => {
    const slug = (sectorSlug || '').toLowerCase();
    if (slug.includes('construct') || slug.includes('btp')) return <HardHat size={32} />;
    if (slug.includes('immo') || slug.includes('terrain')) return <HomeIcon size={32} />;
    if (slug.includes('transport') || slug.includes('logist')) return <Truck size={32} />;
    return <Monitor size={32} />;
  };

  const domains = useMemo(() => {
    return (sectors || []).map((sector) => ({
      icon: iconForSector(sector.slug),
      title: sector.name,
      desc: sector.description || '',
      path: `/services#${sector.slug}`,
    }));
  }, [sectors]);

  const fallbackProjects = useMemo(() => {
    return [
      {
        title: "Centre d'Affaires de Kaloum",
        category: 'Construction',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
        desc: 'Complexe moderne de bureaux et espaces commerciaux au cœur de Conakry.',
        path: '/projets',
      },
      {
        title: 'Résidence Les Palmiers',
        category: 'Immobilier',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop',
        desc: 'Développement résidentiel haut de gamme avec 150 villas et infrastructures modernes.',
        path: '/projets',
      },
      {
        title: 'Hub Logistique National',
        category: 'Transport',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
        desc: "Centre de distribution stratégique connectant Conakry aux régions de l'intérieur du pays.",
        path: '/projets',
      },
    ];
  }, []);

  const displayedProjects = useMemo(() => {
    if ((featuredProjects || []).length) {
      return featuredProjects.slice(0, 3).map((project) => {
        const imageUrl =
          project?.images?.[0]?.image_path ||
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop';
        return {
          title: project.title,
          category: project?.sector?.name || 'Projet',
          image: imageUrl,
          desc: project.description || '',
          path: project.slug ? `/projets/${project.slug}` : '/projets',
        };
      });
    }
    return fallbackProjects;
  }, [featuredProjects, fallbackProjects]);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden w-full">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2000&auto=format&fit=crop"
            alt="GUITRAIM GROUPE Background"
            className="w-full h-full object-cover scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-[#1A3A5C]/70 backdrop-blur-[2px]" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 flex justify-center w-full">
          <Reveal className="text-center space-y-8 w-full" direction="up" delay={200}>
            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
                GUITRAIM GROUPE
              </h1>
              <h2 className="text-2xl lg:text-3xl font-bold text-white/90">
                Votre Partenaire Multi-Services en Guinée
              </h2>
              <p className="text-lg lg:text-xl font-medium text-white/70 max-w-2xl mx-auto leading-relaxed">
                Expertise reconnue dans la construction, l'immobilier, le transport & logistique, et les solutions technologiques pour accompagner vos projets les plus ambitieux.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/services">
                <Button className="h-14 px-10 rounded-2xl bg-[#4A8BC2] hover:bg-[#4A8BC2]/90 text-white font-bold text-lg shadow-xl shadow-[#4A8BC2]/20">
                  Découvrir Nos Services
                </Button>
              </Link>
              <Link to="/projets">
                <Button variant="secondary" className="h-14 px-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md font-bold text-lg">
                  Voir Nos Projets
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Domains of Expertise */}
      <section className="flex justify-center w-full">
        <Reveal className="container px-4 sm:px-6 lg:px-8 space-y-16" direction="up">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-bold text-[#1A3A5C]">Nos Domaines d'Expertise</h3>
            <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              Quatre secteurs d'activité complémentaires pour répondre à tous vos besoins de développement et d'infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading && !domains.length ? (
              <div className="col-span-full text-center text-sm font-bold text-[hsla(210,20%,40%,1)]">
                Chargement...
              </div>
            ) : domains.map((domain, index) => (
              <Card key={index} className="group hover:border-[#1A3A5C] hover:shadow-2xl transition-all duration-500 rounded-[32px] overflow-hidden border-[#E0E6ED]">
                <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-[24px] bg-[hsla(210,25%,98%,1)] flex items-center justify-center text-[#1A3A5C] group-hover:bg-[#1A3A5C] group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                    {domain.icon}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-[#1A3A5C]">{domain.title}</h4>
                    <p className="text-sm font-medium leading-relaxed text-[hsla(210,20%,40%,1)]">
                      {domain.desc}
                    </p>
                  </div>
                  <Link to={domain.path} className="inline-flex items-center gap-2 text-sm font-bold text-[#4A8BC2] group-hover:translate-x-1 transition-transform">
                    En savoir plus <ArrowRight size={16} />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Featured Projects */}
      <section className="flex justify-center w-full">
        <Reveal className="container px-4 sm:px-6 lg:px-8 space-y-16" direction="up" delay={200}>
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-bold text-[#1A3A5C]">Nos Réalisations</h3>
            <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              Découvrez quelques-uns de nos projets emblématiques qui témoignent de notre expertise et de notre engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayedProjects.map((project, index) => (
              <div key={index} className="group relative rounded-[32px] overflow-hidden border border-[#E0E6ED] bg-white hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8 space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#4A8BC2]/10 text-[#1A3A5C] text-xs font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h4 className="text-xl font-bold text-[#1A3A5C]">{project.title}</h4>
                  <p className="text-sm font-medium leading-relaxed text-[hsla(210,20%,40%,1)]">
                    {project.desc}
                  </p>
                  <Link to={project.path} className="inline-flex items-center gap-2 text-sm font-bold text-[#1A3A5C] group-hover:gap-3 transition-all">
                    Voir le projet <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/projets">
              <Button variant="secondary" className="h-14 px-10 rounded-2xl border-[#E0E6ED] text-[#1A3A5C] font-bold text-lg hover:bg-[hsla(210,25%,98%,1)]">
                Voir Tous Nos Projets
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Call to Action */}
      <section className="flex justify-center w-full">
        <Reveal className="container px-4 sm:px-6 lg:px-8" direction="none">
          <div className="bg-[#1A3A5C] rounded-[48px] p-12 lg:p-24 text-center space-y-10 relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
              <h3 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">
                Prêt à Démarrer Votre Projet ?
              </h3>
              <p className="text-lg lg:text-xl font-medium text-white/70 leading-relaxed">
                Notre équipe d'experts est à votre disposition pour étudier vos besoins et vous proposer des solutions sur mesure. Contactez-nous dès aujourd'hui pour une consultation gratuite.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex justify-center">
              <Link to="/contact" className="w-full sm:w-auto flex justify-center">
              <Button className="h-14 sm:h-16 px-6 sm:px-12 rounded-[20px] sm:rounded-[24px] bg-[#4A8BC2] hover:bg-[#4A8BC2]/90 text-white font-bold text-base sm:text-lg shadow-2xl shadow-[#4A8BC2]/40 gap-3 w-full max-w-[320px] sm:max-w-none">
                <Mail size={20} className="sm:w-6 sm:h-6" />
                Contactez-Nous Maintenant
              </Button>
            </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;
