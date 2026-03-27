import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight, Calendar, Users, Building2,
  Clock, Wallet, CheckCircle2, Star, MapPin,
  ChevronLeft, ChevronRight, MessageSquare
} from 'lucide-react';
import { cn } from '../../utils/utils';
import Button from '../../Components/ui/Button';

const ProjectDetail = () => {
  const { id } = useParams();

  // In a real app, we would fetch the project by id.
  // Using static data for now.
  const project = {
    title: 'Centre d\'Affaires de Kaloum',
    category: 'Construction',
    categorySlug: 'construction',
    headerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
    mainImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=400&auto=format&fit=crop',
    ],
    technicalSheet: {
      client: 'Groupe Immobilier Guinéen',
      sector: 'Construction',
      location: 'Kaloum, Conakry, Guinée',
      duration: '22 mois',
      deliveryDate: 'Septembre 2023',
      budget: '2.5 millions CHF',
      team: 'Mamadou Traoré (Chef de Projet), Fatoumata Camara (Ingénieur Structure), Ibrahima Condé (Architecte Principal)'
    },
    keyPoints: [
      '12 étages avec 120 bureaux modernes équipés',
      'Parking souterrain de 250 places',
      'Centre commercial intégré au rez-de-chaussée',
      'Système de climatisation centrale écologique',
      'Sécurité 24/7 avec système de surveillance moderne',
      'Certification environnementale HQE-AFRIQUE'
    ],
    description: {
      context: 'Le Centre d\'Affaires de Kaloum répond à un besoin croissant d\'espaces de bureaux modernes dans le centre décisionnel de Conakry. Le défi était de créer un bâtiment de haute qualité environnementale tout en assurant une intégration urbaine fluide respectant les contraintes de densité du quartier de Kaloum.',
      solutions: 'Notre équipe a mis en place des solutions innovantes, notamment une façade bioclimatique permettant de réduire la consommation d\'énergie de 30%. L\'utilisation de matériaux locaux recyclés pour certains éléments structurels a été privilégiée pour minimiser l\'impact environnemental et soutenir l\'économie locale.',
      phases: [
        { name: 'Phase 1', desc: 'Études géotechniques, conception et obtention du permis (4 mois)' },
        { name: 'Phase 2', desc: 'Travaux de terrassement et fondations (6 mois)' },
        { name: 'Phase 3', desc: 'Gros œuvre (10 mois)' },
        { name: 'Phase 4', desc: 'Finitions et équipements technologiques (2 mois)' }
      ],
      results: 'Le Centre d\'Affaires de Kaloum est aujourd\'hui une icône de modernité dans le paysage urbain de Conakry. Il accueille plus de 50 entreprises locales et internationales, contribuant ainsi au dynamisme économique du pays.'
    },
    impact: {
      occupancy: '95%',
      jobs: '800+',
      energySaving: '30%'
    },
    testimonial: {
      text: 'GUITRAIM GROUPE a dépassé toutes nos attentes. Leur professionnalisme, leur respect des délais et la qualité exceptionnelle de leur travail font d\'eux notre partenaire de choix pour tous nos futurs projets immobiliers en Guinée.',
      author: 'Amadou Bah',
      role: 'Directeur Général, Groupe Immobilier Guinéen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
    }
  };

  const similarProjects = [
    {
      title: 'École Moderne de Kindia',
      category: 'Construction',
      location: 'Kindia',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Autoroute Conakry-Coyah',
      category: 'Construction',
      location: 'Conakry-Coyah',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1545143333-6382f1d5b893?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Centre Commercial Madina',
      category: 'Immobilier',
      location: 'Conakry',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="pb-24">
      {/* Header Section */}
      <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={project.headerImage} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1A3A5C]/80 backdrop-blur-sm" />
        </div>
        <div className="container relative z-10 px-4 lg:px-8 text-center space-y-4">
          <div className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center justify-center gap-2">
            Accueil <ArrowRight size={14} /> Projets <ArrowRight size={14} /> {project.category} <ArrowRight size={14} /> {project.title}
          </div>
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-2">
            {project.category}
          </div>
          <h1 className="text-4xl lg:text-7xl font-bold text-white tracking-tight">{project.title}</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto font-medium">{project.description.results.split('.')[0]}.</p>
        </div>
      </section>

      <section className="container px-4 lg:px-8 py-24 space-y-24">
        {/* Gallery Section */}
        <div className="space-y-8">
          <div className="aspect-video rounded-[48px] overflow-hidden shadow-2xl border-8 border-white">
            <img src={project.mainImage} alt={project.title} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-8">
            {project.thumbnails.map((thumb, index) => (
              <div key={index} className="aspect-square rounded-[24px] overflow-hidden border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300">
                <img src={thumb} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Project Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-12">
            <div className="bg-white rounded-[40px] p-10 border border-[#E0E6ED] shadow-sm space-y-8">
              <h3 className="text-2xl font-bold text-[#1A3A5C]">Fiche Technique</h3>
              <div className="space-y-6">
                {[
                  { icon: <Users size={20} />, label: 'Client', value: project.technicalSheet.client },
                  { icon: <Building2 size={20} />, label: 'Secteur d\'Activité', value: project.technicalSheet.sector },
                  { icon: <MapPin size={20} />, label: 'Localisation', value: project.technicalSheet.location },
                  { icon: <Clock size={20} />, label: 'Durée du Projet', value: project.technicalSheet.duration },
                  { icon: <Calendar size={20} />, label: 'Date de Livraison', value: project.technicalSheet.deliveryDate },
                  { icon: <Wallet size={20} />, label: 'Budget', value: project.technicalSheet.budget },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-bold text-[#1A3A5C]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[hsla(210,25%,98%,1)] rounded-[40px] p-10 border border-[#E0E6ED] space-y-8">
              <h3 className="text-2xl font-bold text-[#1A3A5C]">Points Clés du Projet</h3>
              <ul className="space-y-4">
                {project.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
                    <CheckCircle2 size={18} className="text-[#4A8BC2] shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-16">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">À Propos de Ce Projet</h2>

              <div className="space-y-10">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-[#1A3A5C]">Contexte et Défis</h4>
                  <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">{project.description.context}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-[#1A3A5C]">Solutions Apportées</h4>
                  <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">{project.description.solutions}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-[#1A3A5C]">Phases du Projet</h4>
                  <div className="space-y-3">
                    {project.description.phases.map((phase, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#1A3A5C]/5 border border-[#1A3A5C]/10 flex gap-4">
                        <span className="text-[#1A3A5C] font-black">{phase.name}</span>
                        <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">{phase.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-[#1A3A5C]">Résultats et Impact</h4>
                  <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">{project.description.results}</p>
                  <div className="grid grid-cols-3 gap-6 pt-6">
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-black text-[#1A3A5C]">{project.impact.occupancy}</div>
                      <p className="text-[10px] font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-widest">Taux d'occupation</p>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-black text-[#1A3A5C]">{project.impact.jobs}</div>
                      <p className="text-[10px] font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-widest">Emplois créés</p>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-black text-[#1A3A5C]">{project.impact.energySaving}</div>
                      <p className="text-[10px] font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-widest">Économie d'énergie</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-12 border border-[#E0E6ED] shadow-xl space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare size={120} />
              </div>
              <h3 className="text-2xl font-bold text-[#1A3A5C] text-center">Ce Qu'en Dit Notre Client</h3>
              <div className="space-y-8 text-center relative z-10">
                <div className="flex justify-center gap-1 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <p className="text-xl font-medium italic text-[#1A3A5C] leading-relaxed">"{project.testimonial.text}"</p>
                <div className="flex flex-col items-center space-y-3">
                  <img src={project.testimonial.avatar} alt={project.testimonial.author} className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
                  <div>
                    <p className="font-bold text-[#1A3A5C]">{project.testimonial.author}</p>
                    <p className="text-sm font-medium text-[hsla(210,20%,60%,1)]">{project.testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Projects Section */}
        <div className="space-y-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C] text-center">Projets Similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProjects.map((proj, idx) => (
              <div key={idx} className="group bg-white rounded-[32px] overflow-hidden border border-[#E0E6ED] hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#1A3A5C] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {proj.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-xl font-bold text-[#1A3A5C] group-hover:text-[#4A8BC2] transition-colors">{proj.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-[hsla(210,20%,60%,1)]">
                    <div className="flex items-center gap-1.5"><MapPin size={14} className="text-[#4A8BC2]" /> {proj.location}</div>
                    <div className="flex items-center gap-1.5"><Calendar size={14} className="text-[#4A8BC2]" /> {proj.year}</div>
                  </div>
                  <Link to="/projets/1" className="inline-flex items-center gap-2 text-sm font-bold text-[#1A3A5C] hover:gap-3 transition-all pt-2">
                    Voir le Projet <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#1A3A5C] rounded-[64px] p-12 lg:p-24 text-center space-y-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2000&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            <h3 className="text-3xl lg:text-6xl font-bold text-white tracking-tight leading-tight">Prêt à Lancer Votre Projet ?</h3>
            <p className="text-xl font-medium text-white/70 leading-relaxed">Notre équipe d'experts est prête à transformer votre vision en réalité. Contactez-nous pour discuter de votre projet.</p>
          </div>
          <div className="relative z-10 pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact">
              <Button className="h-16 px-12 rounded-[24px] bg-[#4A8BC2] hover:bg-[#4A8BC2]/90 text-white font-bold text-lg shadow-2xl shadow-[#4A8BC2]/20 gap-3 w-full sm:w-auto">
                Contactez-Nous
              </Button>
            </Link>
            <Link to="/projets">
              <Button variant="secondary" className="h-16 px-12 rounded-[24px] bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md font-bold text-lg w-full sm:w-auto">
                Voir Tous Nos Projets
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;

