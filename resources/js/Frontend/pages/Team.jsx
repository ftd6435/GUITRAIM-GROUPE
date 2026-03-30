import { Link } from 'react-router-dom';
import { Link as LinkIcon, Mail, ArrowRight, HardHat, Home as HomeIcon, Truck, Monitor } from 'lucide-react';
import { cn } from '../../utils/utils';
import Button from '../../Components/ui/Button';
import Reveal from '../components/Reveal';

const Team = () => {
  const management = [
    {
      name: 'Mamadou TRAORÉ',
      role: 'Directeur Général',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
      bio: 'Fort de 15 ans d\'expérience dans le développement d\'infrastructures en Afrique de l\'Ouest, Mamadou guide GUITRAIM GROUPE avec une vision d\'excellence et d\'innovation. Diplômé en génie civil et MBA en management stratégique.'
    },
    {
      name: 'Fatoumata DIALLO',
      role: 'Directrice Adjointe',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
      bio: 'Experte en gestion de projets multi-sectoriels avec 12 ans d\'expérience, Fatoumata supervise l\'excellence opérationnelle et coordonne les synergies entre nos différents départements pour garantir la qualité de nos services.'
    }
  ];

  const sectorLeaders = [
    {
      name: 'Ibrahim CAMARA',
      role: 'Responsable Construction & BTP',
      sector: 'Construction',
      icon: <HardHat size={16} />,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      bio: '10 ans d\'expérience - Génie Civil & Architecture. Spécialiste en infrastructures complexes et construction durable. A dirigé plus de 50 projets majeurs en Guinée et en Afrique de l\'Ouest.'
    },
    {
      name: 'Aminata BARRY',
      role: 'Responsable Immobilier',
      sector: 'Immobilier',
      icon: <HomeIcon size={16} />,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
      bio: '14 ans d\'expérience - Développement & Investissement. Experte en développement résidentiel et commercial. Spécialisée dans l\'accompagnement juridique et la valorisation foncière.'
    },
    {
      name: 'Ousmane KONÉ',
      role: 'Responsable Transport & Logistique',
      sector: 'Transport',
      icon: <Truck size={16} />,
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
      bio: '16 ans d\'expérience - Supply Chain & Distribution. Expert en optimisation logistique et gestion de flotte. Maîtrise parfaite des corridors de transport en Afrique de l\'Ouest.'
    },
    {
      name: 'Sekou CONDÉ',
      role: 'Responsable Solutions Technologiques',
      sector: 'Technologie',
      icon: <Monitor size={16} />,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
      bio: '12 ans d\'expérience - Digital & Innovation. Pionnier de la transformation digitale en Guinée, expertise en développement web, solutions mobiles et systèmes d\'information.'
    }
  ];

  return (
    <div className="pb-24">
      {/* Header Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop"
            alt="Notre Équipe"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1A3A5C]/80 backdrop-blur-sm" />
        </div>
        <Reveal className="container relative z-10 px-4 lg:px-8 text-center space-y-4" direction="up">
          <div className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center justify-center gap-2">
            Accueil <ArrowRight size={14} /> Équipe
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white">Notre Équipe</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto font-medium">
            Rencontrez les experts qui font la force de GUITRAIM GROUPE
          </p>
        </Reveal>
      </section>

      {/* Management Section */}
      <Reveal className="container px-4 lg:px-8 py-24 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1A3A5C]">Direction Générale</h2>
          <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
            L'équipe dirigeante qui porte la vision et la stratégie de GUITRAIM GROUPE
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {management.map((member, index) => (
            <div key={index} className="bg-white rounded-[48px] p-10 border border-[#E0E6ED] hover:shadow-2xl transition-all duration-500 space-y-8 flex flex-col items-center text-center group">
              <div className="relative">
                <div className="w-48 h-48 rounded-[40px] overflow-hidden border-4 border-[#1A3A5C]/5 group-hover:border-[#1A3A5C]/10 transition-colors">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <a href="#" className="w-10 h-10 rounded-2xl bg-[#1A3A5C] text-white flex items-center justify-center shadow-lg hover:bg-[#4A8BC2] transition-colors">
                    <LinkIcon size={18} />
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-[#1A3A5C]">{member.name}</h3>
                <p className="text-sm font-bold text-[#4A8BC2] uppercase tracking-widest">{member.role}</p>
                <p className="text-sm font-medium leading-relaxed text-[hsla(210,20%,40%,1)]">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Sector Leaders Section */}
      <section className="container px-4 lg:px-8 py-24 space-y-16 bg-[hsla(210,25%,98%,1)] rounded-[64px]">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1A3A5C]">Nos Responsables Sectoriels</h2>
          <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
            Des experts reconnus dans leurs domaines respectifs pour vous accompagner dans tous vos projets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sectorLeaders.map((member, index) => (
            <div key={index} className="bg-white rounded-[32px] p-8 border border-[#E0E6ED] hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row items-center sm:items-start gap-8 group">
              <div className="w-32 h-32 rounded-[24px] overflow-hidden shrink-0 border-2 border-[#1A3A5C]/5">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="space-y-4 text-center sm:text-left">
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <h3 className="text-lg font-bold text-[#1A3A5C]">{member.name}</h3>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#1A3A5C]/5 text-[#1A3A5C] text-[10px] font-bold uppercase tracking-wider">
                      {member.icon} {member.sector}
                    </div>
                  </div>
                  <p className="text-xs font-bold text-[#4A8BC2] uppercase tracking-widest">{member.role}</p>
                </div>
                <p className="text-xs font-medium leading-relaxed text-[hsla(210,20%,40%,1)]">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="container px-4 lg:px-8 pt-24">
        <div className="bg-[#1A3A5C] rounded-[48px] p-12 lg:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Travaillez avec Nous</h3>
            <p className="text-lg font-medium text-white/70 leading-relaxed">
              Notre équipe d'experts est prête à vous accompagner dans la réalisation de vos projets les plus ambitieux. Contactez-nous pour découvrir comment nous pouvons transformer vos idées en réalisations concrètes.
            </p>
          </div>
          <div className="relative z-10 pt-4 flex justify-center">
            <Link to="/contact">
              <Button className="h-14 px-10 rounded-2xl bg-[#4A8BC2] hover:bg-[#4A8BC2]/90 text-white font-bold text-lg shadow-xl shadow-[#4A8BC2]/20 gap-3">
                <Mail size={20} />
                Contactez Notre Équipe
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
