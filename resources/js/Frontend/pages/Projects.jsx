import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Search, Filter } from 'lucide-react';
import { cn } from '../../utils/utils';
import Button from '../../Components/ui/Button';

const Projects = () => {
  const [filter, setFilter] = React.useState('all');

  const categories = [
    { id: 'all', label: 'Tous les Projets' },
    { id: 'construction', label: 'Construction' },
    { id: 'immobilier', label: 'Immobilier' },
    { id: 'transport', label: 'Transport & Logistique' },
    { id: 'technologie', label: 'Technologie' }
  ];

  const projects = [
    {
      id: 1,
      title: 'Centre d\'Affaires de Kaloum',
      category: 'construction',
      categoryLabel: 'Construction',
      location: 'Conakry',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      desc: 'Complexe moderne de bureaux et espaces commerciaux au cœur de Conakry, offrant des infrastructures de qualité internationale.'
    },
    {
      id: 2,
      title: 'Résidence Les Palmiers',
      category: 'immobilier',
      categoryLabel: 'Immobilier',
      location: 'Coyah',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop',
      desc: 'Développement résidentiel haut de gamme avec 150 villas modernes et infrastructures complètes pour un cadre de vie exceptionnel.'
    },
    {
      id: 3,
      title: 'Hub Logistique National',
      category: 'transport',
      categoryLabel: 'Transport',
      location: 'Dubréka',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      desc: 'Centre de distribution stratégique connectant Conakry aux régions de l\'intérieur avec des capacités de stockage optimisées.'
    },
    {
      id: 4,
      title: 'École Moderne de Kindia',
      category: 'construction',
      categoryLabel: 'Construction',
      location: 'Kindia',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=800&auto=format&fit=crop',
      desc: 'Établissement scolaire moderne avec 24 salles de classe, laboratoires et espaces récréatifs pour 800 élèves.'
    },
    {
      id: 5,
      title: 'Plateforme E-Commerce GuinShop',
      category: 'technologie',
      categoryLabel: 'Technologie',
      location: 'Conakry',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      desc: 'Plateforme de commerce électronique complète connectant vendeurs et acheteurs à travers la Guinée avec paiement mobile intégré.'
    },
    {
      id: 6,
      title: 'Centre Commercial Madina',
      category: 'immobilier',
      categoryLabel: 'Immobilier',
      location: 'Conakry',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?q=80&w=800&auto=format&fit=crop',
      desc: 'Centre commercial moderne avec 80 boutiques, supermarché, restaurants et espaces de divertissement sur 3 niveaux.'
    },
    {
      id: 7,
      title: 'Autoroute Conakry-Coyah',
      category: 'construction',
      categoryLabel: 'Construction',
      location: 'Conakry-Coyah',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1545143333-6382f1d5b893?q=80&w=800&auto=format&fit=crop',
      desc: 'Infrastructure routière moderne de 45 km reliant Conakry à Coyah avec voies express et échangeurs autoroutiers.'
    },
    {
      id: 8,
      title: 'Flotte Transport Régional',
      category: 'transport',
      categoryLabel: 'Transport',
      location: 'National',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1606185540410-dd628c04eec2?q=80&w=800&auto=format&fit=crop',
      desc: 'Système de gestion de flotte moderne avec 150 véhicules couvrant toutes les régions de la Guinée et GPS intégré.'
    },
    {
      id: 9,
      title: 'Tours Résidentielles Kipé',
      category: 'immobilier',
      categoryLabel: 'Immobilier',
      location: 'Ratoma',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
      desc: 'Complexe résidentiel de 4 tours avec 200 appartements haut standing et services communautaires intégrés.'
    }
  ];

  const filteredProjects = projects.filter(p => filter === 'all' || p.category === filter);

  return (
    <div className="pb-24">
      {/* Header Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop"
            alt="Nos Projets"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1A3A5C]/80 backdrop-blur-sm" />
        </div>
        <div className="container relative z-10 px-4 lg:px-8 text-center space-y-4">
          <div className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center justify-center gap-2">
            Accueil <ArrowRight size={14} /> Projets
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white">Nos Projets</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto font-medium">
            Découvrez nos réalisations à travers la Guinée
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="container px-4 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#1A3A5C]">Filtrer par Secteur</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    filter === cat.id
                      ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
                      : "bg-white text-[hsla(210,20%,40%,1)] border-[#E0E6ED] hover:border-[#1A3A5C]"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm font-bold text-[hsla(210,20%,40%,1)]">
            {filteredProjects.length} projets trouvés
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group bg-white rounded-[32px] overflow-hidden border border-[#E0E6ED] hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#1A3A5C] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {project.categoryLabel}
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-4 flex-grow flex flex-col">
                <div className="space-y-2 flex-grow">
                  <h3 className="text-xl font-bold text-[#1A3A5C] group-hover:text-[#4A8BC2] transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-[hsla(210,20%,60%,1)]">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#4A8BC2]" />
                      {project.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#4A8BC2]" />
                      {project.year}
                    </div>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-[hsla(210,20%,40%,1)] line-clamp-3">
                    {project.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E0E6ED]">
                  <Link to={`/projets/${project.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#1A3A5C] hover:gap-3 transition-all pt-2">
                    Voir le Projet <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-[hsla(210,25%,98%,1)] flex items-center justify-center mx-auto text-[hsla(210,20%,60%,1)]">
              <Search size={32} />
            </div>
            <p className="text-lg font-bold text-[#1A3A5C]">Aucun projet trouvé</p>
            <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">
              Essayez de modifier vos filtres pour voir d'autres réalisations.
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container px-4 lg:px-8 mt-24">
        <div className="bg-white rounded-[48px] p-12 lg:p-20 text-center space-y-8 border border-[#E0E6ED] shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-bold text-[#1A3A5C]">Vous avez un projet en tête ?</h3>
            <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              Notre équipe d'experts est prête à transformer votre vision en réalité. Contactez-nous pour discuter de votre projet.
            </p>
          </div>
          <div className="relative z-10 pt-4 flex justify-center">
            <Button className="h-14 px-10 rounded-2xl bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold text-lg shadow-xl shadow-[#1A3A5C]/20">
              Contactez-Nous
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
