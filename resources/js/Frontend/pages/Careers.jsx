import React from 'react';
import {
  Briefcase, Users, TrendingUp, Globe, Award,
  Lightbulb, Shield, HeartHandshake, MapPin,
  Clock, ArrowRight, Send, FileText, Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/utils';
import Button from '../../Components/ui/Button';
import { Input, Textarea, Select } from '../../Components/ui/Input';

const Careers = () => {
  const benefits = [
    {
      icon: <Briefcase size={32} />,
      title: 'Projets Diversifiés',
      desc: 'Travaillez sur des projets variés dans nos 4 secteurs d\'activité : construction, immobilier, transport & logistique, et technologies.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Développement Professionnel',
      desc: 'Formation continue et évolution de carrière avec des opportunités d\'apprentissage et de progression au sein du groupe.'
    },
    {
      icon: <Users size={32} />,
      title: 'Équipe Dynamique',
      desc: 'Collaboration avec des experts passionnés dans un environnement de travail stimulant et bienveillant.'
    },
    {
      icon: <Globe size={32} />,
      title: 'Impact Local',
      desc: 'Contribuez au développement de la Guinée et participez à des projets qui transforment positivement notre pays.'
    }
  ];

  const values = [
    { icon: <Award size={24} />, title: 'Excellence', desc: 'Recherche constante de la qualité dans nos projets.' },
    { icon: <Lightbulb size={24} />, title: 'Innovation', desc: 'Adoption de solutions modernes et créatives.' },
    { icon: <Shield size={24} />, title: 'Intégrité', desc: 'Transparence et honnêteté dans toutes nos relations.' },
    { icon: <HeartHandshake size={24} />, title: 'Engagement Local', desc: 'Contribution au développement socio-économique.' }
  ];

  const jobs = [
    {
      title: 'Ingénieur Civil Senior',
      department: 'Construction',
      type: 'CDI',
      location: 'Conakry, Guinée',
      desc: 'Nous recherchons un ingénieur civil senior pour superviser la coordination technique et l\'assurance qualité sur nos grands projets urbains en cours.',
      tags: ['Génie Civil', 'Gestion de Projets', 'AutoCAD', 'Leadership']
    },
    {
      title: 'Responsable Logistique',
      department: 'Transport & Logistique',
      type: 'CDI',
      location: 'Conakry / Kindia',
      desc: 'Optimisation des chaînes d\'approvisionnement, gestion des stocks et coordination des transports. Développement de stratégies logistiques pour améliorer l\'efficacité opérationnelle.',
      tags: ['Supply Chain', 'Gestion de Stock', 'Transport', 'Analyse']
    },
    {
      title: 'Développeur Web Full-Stack',
      department: 'Technologie',
      type: 'CDI',
      location: 'Conakry / Télétravail',
      desc: 'Développement d\'applications web modernes, maintenance des systèmes existants et intégration de nouvelles technologies. Collaboration étroite avec l\'équipe produit pour créer des solutions digitales innovantes.',
      tags: ['JavaScript', 'React', 'Node.js', 'MongoDB']
    }
  ];

  return (
    <div className="pb-24">
      {/* Header Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop"
            alt="Carrières chez GUITRAIM GROUPE"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1A3A5C]/80 backdrop-blur-sm" />
        </div>
        <div className="container relative z-10 px-4 lg:px-8 text-center space-y-6">
          <div className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center justify-center gap-2">
            Accueil <ArrowRight size={14} /> Carrières
          </div>
          <h1 className="text-4xl lg:text-7xl font-bold text-white tracking-tight">
            Rejoignez Notre Équipe
          </h1>
          <p className="text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto font-medium">
            Construisez votre avenir avec GUITRAIM GROUPE
          </p>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="container px-4 lg:px-8 py-24 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">Pourquoi Travailler Chez GUITRAIM GROUPE ?</h2>
          <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
            Rejoignez une entreprise dynamique qui valorise l'innovation, l'excellence et l'épanouissement professionnel. Découvrez un environnement où votre talent peut s'exprimer pleinement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-10 rounded-[40px] border border-[#E0E6ED] space-y-6 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center group-hover:bg-[#1A3A5C] group-hover:text-white transition-all">
                {benefit.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-[#1A3A5C]">{benefit.title}</h3>
                <p className="text-sm font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[hsla(210,25%,98%,1)] py-24">
        <div className="container px-4 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">Nos Valeurs au Quotidien</h2>
            <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              Ces valeurs guident chacune de nos actions et définissent l'esprit d'équipe qui nous unit. Elles sont incarnées par tous nos collaborateurs au quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, index) => (
              <div key={index} className="bg-white p-8 rounded-[32px] border border-[#E0E6ED] space-y-4 text-center hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center mx-auto">
                  {val.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1A3A5C]">{val.title}</h3>
                <p className="text-xs font-medium text-[hsla(210,20%,40%,1)]">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="container px-4 lg:px-8 py-24 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">Postes Ouverts</h2>
          <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
            Découvrez nos opportunités actuelles
          </p>
        </div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {jobs.map((job, index) => (
            <div key={index} className="bg-white p-8 lg:p-10 rounded-[40px] border border-[#E0E6ED] hover:shadow-xl transition-all space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl lg:text-2xl font-bold text-[#1A3A5C]">{job.title}</h3>
                    <span className="px-3 py-1 rounded-full bg-[#1A3A5C]/5 text-[#1A3A5C] text-[10px] font-bold uppercase tracking-wider">
                      {job.department}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-[hsla(210,20%,60%,1)]">
                    <div className="flex items-center gap-1.5"><MapPin size={16} className="text-[#4A8BC2]" /> {job.location}</div>
                  </div>
                </div>
                <Button className="bg-[#1A3A5C] text-white rounded-2xl px-8 h-12 font-bold whitespace-nowrap">
                  Voir l'Offre et Postuler
                </Button>
              </div>
              <p className="text-base font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">{job.desc}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {job.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-[hsla(210,25%,98%,1)] border border-[#E0E6ED] text-[10px] font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spontaneous Application Section */}
      <section className="container px-4 lg:px-8 py-24">
        <div className="bg-white rounded-[64px] p-12 lg:p-24 border border-[#E0E6ED] shadow-sm space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">Aucun Poste Ne Correspond ? Envoyez-Nous Votre Candidature</h2>
            <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              Nous sommes toujours à la recherche de talents. Envoyez-nous votre CV et lettre de motivation.
            </p>
          </div>

          <form className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input label="Prénom *" placeholder="votre prénom" required />
              <Input label="Nom *" placeholder="votre nom" required />
              <Input label="Email *" type="email" placeholder="votre@email.com" required />
              <Input label="Téléphone *" placeholder="+224 xx xx xx xx" required />
              <Select
                label="Secteur d'Intérêt"
                options={[
                  { label: 'Construction', value: 'construction' },
                  { label: 'Immobilier', value: 'immobilier' },
                  { label: 'Transport & Logistique', value: 'transport' },
                  { label: 'Technologie', value: 'tech' },
                  { label: 'Administration', value: 'admin' }
                ]}
              />
              <Select
                label="Niveau d'Expérience"
                options={[
                  { label: 'Junior (0-2 ans)', value: 'junior' },
                  { label: 'Intermédiaire (3-5 ans)', value: 'mid' },
                  { label: 'Senior (6+ ans)', value: 'senior' },
                  { label: 'Expert / Manager', value: 'expert' }
                ]}
              />
            </div>
            <Textarea label="Message de Motivation (optionnel)" placeholder="Parlez-nous de votre motivation et de vos aspirations..." className="min-h-[150px]" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1A3A5C] ml-1">CV (PDF, max 5MB) *</label>
                <div className="relative h-14 w-full rounded-2xl border-2 border-dashed border-[#E0E6ED] bg-[hsla(210,25%,98%,1)] flex items-center px-6 gap-3 text-[hsla(210,20%,60%,1)] hover:border-[#1A3A5C] transition-all cursor-pointer">
                  <Upload size={20} />
                  <span className="text-sm font-bold">Choisir un fichier</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1A3A5C] ml-1">Lettre de Motivation (optionnel)</label>
                <div className="relative h-14 w-full rounded-2xl border-2 border-dashed border-[#E0E6ED] bg-[hsla(210,25%,98%,1)] flex items-center px-6 gap-3 text-[hsla(210,20%,60%,1)] hover:border-[#1A3A5C] transition-all cursor-pointer">
                  <Upload size={20} />
                  <span className="text-sm font-bold">Choisir un fichier</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-[#E0E6ED] text-[#1A3A5C] focus:ring-[#1A3A5C]" required />
                <span className="text-sm font-medium text-[hsla(210,20%,40%,1)]">J'accepte que mes données soient traitées dans le cadre de ma candidature *</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-[#E0E6ED] text-[#1A3A5C] focus:ring-[#1A3A5C]" />
                <span className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Je souhaite recevoir les actualités de GUITRAIM GROUPE</span>
              </label>
            </div>

            <div className="pt-4 flex justify-center">
              <Button className="h-16 px-16 rounded-[24px] bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold text-lg shadow-xl shadow-[#1A3A5C]/20 gap-3">
                <Send size={20} /> Envoyer ma Candidature
              </Button>
            </div>
            <p className="text-center text-xs font-medium text-[hsla(210,20%,60%,1)] pt-4 italic">
              Vos données personnelles sont traitées de manière confidentielle conformément à notre politique de confidentialité.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Careers;

