import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase, Users, TrendingUp, Globe, Award,
  Lightbulb, Shield, HeartHandshake, MapPin,
  Clock, Calendar, ArrowRight, Send, FileText, Upload, Loader2,
  X, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/utils';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Input, Textarea, Select } from '../../Components/ui/Input';
import Modal from '../../Components/ui/Modal';
import Reveal from '../components/Reveal';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const cvInputRef = useRef(null);
  const coverLetterInputRef = useRef(null);
  const [spontaneousFiles, setSpontaneousFiles] = useState({ cv_file: null, cover_letter_file: null });
  const spontaneousCvInputRef = useRef(null);
  const spontaneousCoverLetterInputRef = useRef(null);

  const [spontaneousForm, setSpontaneousForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    sector: 'construction',
    experience_level: 'junior',
    message: '',
    gdpr_accepted: false,
    newsletter: false,
  });
  const [spontaneousSubmitting, setSpontaneousSubmitting] = useState(false);
  const [spontaneousErrors, setSpontaneousErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
    cv_file: null,
    cover_letter_file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs');
        setJobs(response.data || []);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleOpenJob = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    setErrors({});
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const data = new FormData();
    data.append('job_id', selectedJob.id);
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('message', formData.message);
    if (formData.cv_file) data.append('cv_file', formData.cv_file);
    if (formData.cover_letter_file) data.append('cover_letter_file', formData.cover_letter_file);

    try {
      await api.post('/applications', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: '',
        cv_file: null,
        cover_letter_file: null,
      });
      if (cvInputRef.current) cvInputRef.current.value = '';
      if (coverLetterInputRef.current) coverLetterInputRef.current.value = '';
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        console.error('Failed to submit application:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSpontaneousApply = async (e) => {
    e.preventDefault();
    setSpontaneousSubmitting(true);
    setSpontaneousErrors({});

    const data = new FormData();
    data.append('first_name', spontaneousForm.first_name);
    data.append('last_name', spontaneousForm.last_name);
    data.append('email', spontaneousForm.email);
    data.append('phone', spontaneousForm.phone);
    if (spontaneousForm.sector) data.append('sector', spontaneousForm.sector);
    if (spontaneousForm.experience_level) data.append('experience_level', spontaneousForm.experience_level);
    if (spontaneousForm.message) data.append('message', spontaneousForm.message);
    if (spontaneousFiles.cv_file) data.append('cv_file', spontaneousFiles.cv_file);
    if (spontaneousFiles.cover_letter_file) data.append('cover_letter_file', spontaneousFiles.cover_letter_file);

    try {
      await api.post('/applications', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsSuccessModalOpen(true);
      setSpontaneousForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        sector: 'construction',
        experience_level: 'junior',
        message: '',
        gdpr_accepted: false,
        newsletter: false,
      });
      setSpontaneousFiles({ cv_file: null, cover_letter_file: null });
      if (spontaneousCvInputRef.current) spontaneousCvInputRef.current.value = '';
      if (spontaneousCoverLetterInputRef.current) spontaneousCoverLetterInputRef.current.value = '';
    } catch (error) {
      if (error.errors) {
        setSpontaneousErrors(error.errors);
      } else {
        console.error('Failed to submit spontaneous application:', error);
      }
    } finally {
      setSpontaneousSubmitting(false);
    }
  };
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

  const jobs_data = [
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
          {loading ? (
            <div className="flex items-center justify-center p-24">
              <Loader2 className="animate-spin text-[#1A3A5C]" size={40} />
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job, index) => (
              <Reveal key={job.id} delay={index * 100} direction="up">
                <div className="bg-white p-8 lg:p-10 rounded-[40px] border border-[#E0E6ED] hover:shadow-xl transition-all space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl lg:text-2xl font-bold text-[#1A3A5C]">{job.title}</h3>
                        <span className="px-3 py-1 rounded-full bg-[#1A3A5C]/5 text-[#1A3A5C] text-[10px] font-bold uppercase tracking-wider">
                          {job.sector?.name || job.sector || 'Général'}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                          {job.contract_type || job.type || '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-bold text-[hsla(210,20%,60%,1)]">
                        <div className="flex items-center gap-1.5"><MapPin size={16} className="text-[#4A8BC2]" /> {job.location}</div>
                        {job.published_at || job.created_at ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-[#4A8BC2]" />
                            {new Date(job.published_at || job.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleOpenJob(job)}
                      className="bg-[#1A3A5C] text-white rounded-2xl px-8 h-12 font-bold whitespace-nowrap"
                    >
                      Voir l'Offre et Postuler
                    </Button>
                  </div>
                  <p className="text-base font-medium text-[hsla(210,20%,40%,1)] leading-relaxed line-clamp-2">{job.description}</p>
                </div>
              </Reveal>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[40px] border border-[#E0E6ED]">
              <Briefcase size={48} className="mx-auto text-[hsla(210,15%,55%,1)] mb-4 opacity-20" />
              <p className="text-xl font-bold text-[#1A3A5C]">Aucun poste ouvert pour le moment</p>
              <p className="text-[hsla(210,20%,40%,1)]">Revenez bientôt ou envoyez-nous une candidature spontanée.</p>
            </div>
          )}
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

          <form onSubmit={handleSpontaneousApply} className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Prénom *"
                placeholder="votre prénom"
                value={spontaneousForm.first_name}
                onChange={(e) => setSpontaneousForm((p) => ({ ...p, first_name: e.target.value }))}
                error={spontaneousErrors.first_name?.[0]}
                required
              />
              <Input
                label="Nom *"
                placeholder="votre nom"
                value={spontaneousForm.last_name}
                onChange={(e) => setSpontaneousForm((p) => ({ ...p, last_name: e.target.value }))}
                error={spontaneousErrors.last_name?.[0]}
                required
              />
              <Input
                label="Email *"
                type="email"
                placeholder="votre@email.com"
                value={spontaneousForm.email}
                onChange={(e) => setSpontaneousForm((p) => ({ ...p, email: e.target.value }))}
                error={spontaneousErrors.email?.[0]}
                required
              />
              <Input
                label="Téléphone *"
                placeholder="+224 xx xx xx xx"
                value={spontaneousForm.phone}
                onChange={(e) => setSpontaneousForm((p) => ({ ...p, phone: e.target.value }))}
                error={spontaneousErrors.phone?.[0]}
                required
              />
              <Select
                label="Secteur d'Intérêt"
                value={spontaneousForm.sector}
                onChange={(e) => setSpontaneousForm((p) => ({ ...p, sector: e.target.value }))}
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
                value={spontaneousForm.experience_level}
                onChange={(e) => setSpontaneousForm((p) => ({ ...p, experience_level: e.target.value }))}
                options={[
                  { label: 'Junior (0-2 ans)', value: 'junior' },
                  { label: 'Intermédiaire (3-5 ans)', value: 'mid' },
                  { label: 'Senior (6+ ans)', value: 'senior' },
                  { label: 'Expert / Manager', value: 'expert' }
                ]}
              />
            </div>
            <Textarea
              label="Message de Motivation (optionnel)"
              placeholder="Parlez-nous de votre motivation et de vos aspirations..."
              className="min-h-[150px]"
              value={spontaneousForm.message}
              onChange={(e) => setSpontaneousForm((p) => ({ ...p, message: e.target.value }))}
              error={spontaneousErrors.message?.[0]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1A3A5C] ml-1 flex items-center gap-2">
                  CV (PDF/DOC, max 5MB) *
                  {spontaneousFiles.cv_file ? (
                    <span className="text-green-600 text-[10px] font-black uppercase">Fichier joint</span>
                  ) : null}
                </label>
                <label className="block relative cursor-pointer">
                  <input
                    ref={spontaneousCvInputRef}
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSpontaneousFiles((p) => ({ ...p, cv_file: file }));
                    }}
                    required
                  />
                  <div className={cn(
                    "relative h-14 w-full rounded-2xl border-2 border-dashed flex items-center px-6 gap-3 transition-all",
                    spontaneousFiles.cv_file
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "border-[#E0E6ED] bg-[hsla(210,25%,98%,1)] text-[hsla(210,20%,60%,1)] hover:border-[#1A3A5C]"
                  )}>
                    {spontaneousFiles.cv_file ? <CheckCircle2 size={20} /> : <Upload size={20} />}
                    <span className="text-sm font-bold truncate">
                      {spontaneousFiles.cv_file ? spontaneousFiles.cv_file.name : "Choisir un fichier"}
                    </span>
                  </div>
                </label>
                {spontaneousErrors.cv_file?.[0] ? <p className="text-xs font-medium text-[#D64545] ml-1">{spontaneousErrors.cv_file[0]}</p> : null}
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1A3A5C] ml-1 flex items-center gap-2">
                  Lettre de Motivation (optionnel)
                  {spontaneousFiles.cover_letter_file ? (
                    <span className="text-green-600 text-[10px] font-black uppercase">Fichier joint</span>
                  ) : null}
                </label>
                <label className="block relative cursor-pointer">
                  <input
                    ref={spontaneousCoverLetterInputRef}
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSpontaneousFiles((p) => ({ ...p, cover_letter_file: file }));
                    }}
                  />
                  <div className={cn(
                    "relative h-14 w-full rounded-2xl border-2 border-dashed flex items-center px-6 gap-3 transition-all",
                    spontaneousFiles.cover_letter_file
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "border-[#E0E6ED] bg-[hsla(210,25%,98%,1)] text-[hsla(210,20%,60%,1)] hover:border-[#1A3A5C]"
                  )}>
                    {spontaneousFiles.cover_letter_file ? <CheckCircle2 size={20} /> : <Upload size={20} />}
                    <span className="text-sm font-bold truncate">
                      {spontaneousFiles.cover_letter_file ? spontaneousFiles.cover_letter_file.name : "Choisir un fichier"}
                    </span>
                  </div>
                </label>
                {spontaneousErrors.cover_letter_file?.[0] ? <p className="text-xs font-medium text-[#D64545] ml-1">{spontaneousErrors.cover_letter_file[0]}</p> : null}
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-[#E0E6ED] text-[#1A3A5C] focus:ring-[#1A3A5C]"
                  checked={spontaneousForm.gdpr_accepted}
                  onChange={(e) => setSpontaneousForm((p) => ({ ...p, gdpr_accepted: e.target.checked }))}
                  required
                />
                <span className="text-sm font-medium text-[hsla(210,20%,40%,1)]">J'accepte que mes données soient traitées dans le cadre de ma candidature *</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-[#E0E6ED] text-[#1A3A5C] focus:ring-[#1A3A5C]"
                  checked={spontaneousForm.newsletter}
                  onChange={(e) => setSpontaneousForm((p) => ({ ...p, newsletter: e.target.checked }))}
                />
                <span className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Je souhaite recevoir les actualités de GUITRAIM GROUPE</span>
              </label>
            </div>

            <div className="pt-4 flex justify-center">
              <Button
                type="submit"
                disabled={spontaneousSubmitting}
                className="h-16 px-16 rounded-[24px] bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold text-lg shadow-xl shadow-[#1A3A5C]/20 gap-3"
              >
                {spontaneousSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Envoyer ma Candidature
              </Button>
            </div>
            <p className="text-center text-xs font-medium text-[hsla(210,20%,60%,1)] pt-4 italic">
              Vos données personnelles sont traitées de manière confidentielle conformément à notre politique de confidentialité.
            </p>
          </form>
        </div>
      </section>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedJob?.title}
        className="max-w-4xl"
      >
        <div className="space-y-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#1A3A5C] flex items-center gap-2">
                  <FileText size={20} className="text-[#4A8BC2]" />
                  Description du Poste
                </h3>
                <p className="text-sm font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
                  {selectedJob?.description}
                </p>
              </div>

              {selectedJob?.requirements && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#1A3A5C] flex items-center gap-2">
                    <Award size={20} className="text-[#4A8BC2]" />
                    Exigences & Compétences
                  </h3>
                  <div
                    className="text-sm font-medium leading-relaxed break-words overflow-hidden text-[hsla(210,20%,40%,1)] [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#1A3A5C] [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#1A3A5C] [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#1A3A5C] [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-[#4A8BC2] [&_a]:font-bold [&_a]:break-words [&_blockquote]:border-l-4 [&_blockquote]:border-[#4A8BC2] [&_blockquote]:pl-5 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:bg-[hsla(210,25%,98%,1)] [&_code]:break-words [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: selectedJob.requirements }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-[hsla(210,25%,98%,1)] p-6 rounded-3xl border border-[#E0E6ED] space-y-4">
                <h4 className="font-bold text-[#1A3A5C]">Détails</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                    <Briefcase size={16} className="text-[#4A8BC2]" />
                    {selectedJob?.sector?.name || selectedJob?.sector || '—'}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                    <MapPin size={16} className="text-[#4A8BC2]" />
                    {selectedJob?.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                    <Clock size={16} className="text-[#4A8BC2]" />
                    {selectedJob?.contract_type || selectedJob?.type || '—'}
                  </div>
                  {selectedJob?.published_at || selectedJob?.created_at ? (
                    <div className="flex items-center gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                      <Calendar size={16} className="text-[#4A8BC2]" />
                      {new Date(selectedJob.published_at || selectedJob.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  ) : null}
                  {selectedJob?.salary_range && (
                    <div className="flex items-center gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                      <TrendingUp size={16} className="text-[#4A8BC2]" />
                      {selectedJob?.salary_range}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E0E6ED] space-y-8">
            <h3 className="text-2xl font-bold text-[#1A3A5C] text-center">Postuler à cette offre</h3>

            <form onSubmit={handleApply} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Prénom *"
                  placeholder="votre prénom"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  error={errors.first_name?.[0]}
                  required
                />
                <Input
                  label="Nom *"
                  placeholder="votre nom"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  error={errors.last_name?.[0]}
                  required
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email?.[0]}
                  required
                />
                <Input
                  label="Téléphone *"
                  placeholder="+224 xx xx xx xx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone?.[0]}
                  required
                />
              </div>

              <Textarea
                label="Message / Motivation (optionnel)"
                placeholder="Pourquoi souhaitez-vous nous rejoindre ?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                error={errors.message?.[0]}
                className="min-h-[120px]"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-bold text-[#1A3A5C] ml-1 flex items-center gap-2">
                    CV (PDF/DOC, max 5MB) *
                    {formData.cv_file && <span className="text-green-600 text-[10px] font-black uppercase">Fichier joint</span>}
                  </div>
                  <label className="block relative cursor-pointer">
                    <input
                      ref={cvInputRef}
                      type="file"
                      onChange={(e) => handleFileChange(e, 'cv_file')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      required
                    />
                    <div className={cn(
                      "h-14 w-full rounded-2xl border-2 border-dashed flex items-center px-6 gap-3 transition-all",
                      formData.cv_file ? "bg-green-50 border-green-200 text-green-700" : "bg-[hsla(210,25%,98%,1)] border-[#E0E6ED] text-[hsla(210,20%,60%,1)] hover:border-[#1A3A5C]"
                    )}>
                      {formData.cv_file ? <CheckCircle2 size={20} /> : <Upload size={20} />}
                      <span className="text-sm font-bold truncate">
                        {formData.cv_file ? formData.cv_file.name : "Choisir un fichier"}
                      </span>
                    </div>
                  </label>
                  {errors.cv_file?.[0] ? <p className="text-xs font-medium text-[#D64545] ml-1">{errors.cv_file[0]}</p> : null}
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-bold text-[#1A3A5C] ml-1 flex items-center gap-2">
                    Lettre de Motivation (optionnel)
                    {formData.cover_letter_file && <span className="text-green-600 text-[10px] font-black uppercase">Fichier joint</span>}
                  </div>
                  <label className="block relative cursor-pointer">
                    <input
                      ref={coverLetterInputRef}
                      type="file"
                      onChange={(e) => handleFileChange(e, 'cover_letter_file')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    />
                    <div className={cn(
                      "h-14 w-full rounded-2xl border-2 border-dashed flex items-center px-6 gap-3 transition-all",
                      formData.cover_letter_file ? "bg-green-50 border-green-200 text-green-700" : "bg-[hsla(210,25%,98%,1)] border-[#E0E6ED] text-[hsla(210,20%,60%,1)] hover:border-[#1A3A5C]"
                    )}>
                      {formData.cover_letter_file ? <CheckCircle2 size={20} /> : <Upload size={20} />}
                      <span className="text-sm font-bold truncate">
                        {formData.cover_letter_file ? formData.cover_letter_file.name : "Choisir un fichier"}
                      </span>
                    </div>
                  </label>
                  {errors.cover_letter_file?.[0] ? <p className="text-xs font-medium text-[#D64545] ml-1">{errors.cover_letter_file[0]}</p> : null}
                </div>
              </div>

              <div className="pt-6 flex justify-center">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-16 px-16 rounded-[24px] bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold text-lg shadow-xl shadow-[#1A3A5C]/20 gap-3"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  Envoyer ma Candidature
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Candidature Envoyée !"
        className="max-w-md"
      >
        <div className="py-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold text-[#1A3A5C]">Merci pour votre intérêt !</p>
            <p className="text-sm font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              Votre candidature a été transmise à notre équipe RH. Nous reviendrons vers vous dans les plus brefs délais.
            </p>
          </div>
          <Button
            onClick={() => setIsSuccessModalOpen(false)}
            className="w-full bg-[#1A3A5C] text-white h-12 rounded-xl font-bold"
          >
            Fermer
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Careers;
