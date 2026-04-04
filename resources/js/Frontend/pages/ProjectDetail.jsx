import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Loader2,
  MapPin,
  Link as LinkIcon,
  Share2,
  Send,
  User,
} from 'lucide-react';
import { cn } from '../../utils/utils';
import Button from '../../Components/ui/Button';
import Modal from '../../Components/ui/Modal';
import api from '../../utils/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const slug = id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const projectTitle = project?.title || '';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

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

  const WhatsAppIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.1 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.3-1.6A10 10 0 1 0 12.1 2Zm0 18.3c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.9.9-3-.2-.3A8.3 8.3 0 1 1 12.1 20.3Zm4.8-6.2c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-1 .9-.2.1-.4.1-.7-.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.5c.1-.1.2-.3.3-.5.1-.2 0-.3 0-.5l-.9-2.1c-.2-.5-.4-.4-.7-.4h-.6c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.4s1 2.7 1.1 2.9c.1.2 2 3.1 4.9 4.4.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4 0-.2-.3-.3-.6-.4Z" />
    </svg>
  );

  const openShare = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer,width=720,height=600');
  };

  const shareToFacebook = () => {
    openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  };

  const shareToLinkedIn = () => {
    openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
  };

  const shareToX = () => {
    openShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(projectTitle)}`);
  };

  const shareToWhatsApp = () => {
    openShare(`https://wa.me/?text=${encodeURIComponent(`${projectTitle} - ${shareUrl}`)}`);
  };

  const copyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { type: 'success', message: 'Lien copié.' } }));
    } catch (e) {
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { type: 'error', message: 'Impossible de copier le lien.' } }));
    }
  };

  const nativeShare = async () => {
    try {
      if (navigator?.share) {
        await navigator.share({ title: projectTitle, url: shareUrl });
      } else {
        await copyLink();
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects/${slug}`);
        setProject(response.data);
      } catch (e) {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!project?.sector?.slug) return;
      try {
        const response = await api.get('/projects', { params: { sector: project.sector.slug } });
        const list = (response.data || []).filter((p) => p.slug !== project.slug).slice(0, 3);
        setSimilarProjects(list);
      } catch (e) {
        setSimilarProjects([]);
      }
    };
    fetchSimilar();
  }, [project?.sector?.slug, project?.slug]);

  const images = useMemo(() => project?.images || [], [project]);
  const fallbackMainImage = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop';
  const mainImage = images?.[activeImageIndex]?.image_path || images?.[0]?.image_path || fallbackMainImage;
  const categoryLabel = project?.sector?.name || 'Projet';

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project?.id]);

  useEffect(() => {
    if (!isImageModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsImageModalOpen(false);
      if (e.key === 'ArrowLeft') setActiveImageIndex((prev) => (prev - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));
      if (e.key === 'ArrowRight') setActiveImageIndex((prev) => (prev + 1) % Math.max(images.length, 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageModalOpen, images.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-[#1A3A5C]" size={32} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-24 text-center space-y-4">
        <p className="text-2xl font-bold text-[#1A3A5C]">Projet introuvable</p>
        <Link to="/projets">
          <Button className="bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold">
            Retour aux projets
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <section className="relative h-[50vh] min-h-[450px] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={mainImage} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A5C] via-[#1A3A5C]/70 to-transparent" />
        </div>
        <div className="container relative z-10 px-4 lg:px-8 space-y-6">
          <div className="flex items-center gap-3 text-white/70 text-xs sm:text-sm font-bold uppercase tracking-widest flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <Link to="/projets" className="hover:text-white transition-colors">Projets</Link>
            <ChevronRight size={14} />
            <span className="text-white">{categoryLabel}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider w-fit">
            <Building2 size={14} />
            {categoryLabel}
          </div>
          <h1 className="text-4xl lg:text-7xl font-bold text-white tracking-tight">{project.title}</h1>
          {project.description ? (
            <p className="text-lg lg:text-xl text-white/75 max-w-3xl font-medium leading-relaxed">
              {project.description}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={shareToFacebook}
              className="h-10 w-10 sm:w-auto sm:px-4 rounded-full sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-md flex items-center justify-center gap-2"
              aria-label="Partager sur Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Facebook</span>
            </button>
            <button
              type="button"
              onClick={shareToLinkedIn}
              className="h-10 w-10 sm:w-auto sm:px-4 rounded-full sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-md flex items-center justify-center gap-2"
              aria-label="Partager sur LinkedIn"
            >
              <LinkedInIcon className="w-4 h-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </button>
            <button
              type="button"
              onClick={shareToX}
              className="h-10 w-10 sm:w-auto sm:px-4 rounded-full sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-md flex items-center justify-center gap-2"
              aria-label="Partager sur X"
            >
              <XIcon className="w-4 h-4" />
              <span className="hidden sm:inline">X</span>
            </button>
            <button
              type="button"
              onClick={shareToWhatsApp}
              className="h-10 w-10 sm:w-auto sm:px-4 rounded-full sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-md flex items-center justify-center gap-2"
              aria-label="Partager sur WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="h-10 w-10 sm:w-auto sm:px-4 rounded-full sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-md flex items-center justify-center gap-2"
              aria-label="Copier le lien"
            >
              <LinkIcon size={16} />
              <span className="hidden sm:inline">Copier</span>
            </button>
            <button
              type="button"
              onClick={nativeShare}
              className="h-10 w-10 sm:w-auto sm:px-4 rounded-full sm:rounded-2xl bg-[#4A8BC2] hover:bg-[#4A8BC2]/90 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#4A8BC2]/20 flex items-center justify-center gap-2"
              aria-label="Partager"
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">Partager</span>
            </button>
          </div>
        </div>
      </section>

      <section className="container px-4 lg:px-8 py-16 space-y-16">
        <div className="space-y-8">
          <div className="aspect-video rounded-[48px] overflow-hidden shadow-2xl border-8 border-white relative group">
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="absolute inset-0 z-10"
              aria-label="Ouvrir l'image en grand"
            />
            <img src={mainImage} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-8">
              {images.slice(0, 6).map((img, idx) => {
                const index = idx;
                const isActive = activeImageIndex === index;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={cn(
                      "aspect-square rounded-[24px] overflow-hidden border-4 shadow-lg transition-all",
                      isActive ? "border-[#4A8BC2]" : "border-white hover:border-[#1A3A5C]/20"
                    )}
                    aria-label={`Voir l'image ${index + 1}`}
                  >
                    <img src={img.image_path} alt="" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[40px] p-8 border border-[#E0E6ED] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#1A3A5C]">Informations</h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center shrink-0">
                    <Building2 size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-wider">Secteur</p>
                    <p className="text-sm font-bold text-[#1A3A5C]">{categoryLabel}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-wider">Localisation</p>
                    <p className="text-sm font-bold text-[#1A3A5C]">{project.location || '—'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-wider">Année</p>
                    <p className="text-sm font-bold text-[#1A3A5C]">{project.year || '—'}</p>
                  </div>
                </div>
              </div>

              {project?.tags?.length ? (
                <div className="pt-4 border-t border-[#E0E6ED]">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((t) => (
                      <span key={t.id} className="px-3 py-1 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] text-xs font-bold">
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            {project.content ? (
              <div className="bg-white rounded-[40px] p-10 border border-[#E0E6ED] shadow-sm">
                <div
                  className="text-[hsla(210,20%,40%,1)] font-medium leading-relaxed break-words overflow-hidden [&_p]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[#1A3A5C] [&_h1]:mb-5 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1A3A5C] [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1A3A5C] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-[#4A8BC2] [&_a]:font-bold [&_a]:break-words [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-[24px] [&_img]:border [&_img]:border-[#E0E6ED] [&_blockquote]:border-l-4 [&_blockquote]:border-[#4A8BC2] [&_blockquote]:pl-5 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:bg-[hsla(210,25%,98%,1)] [&_code]:break-words [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              </div>
            ) : null}
          </div>
        </div>

        {similarProjects.length ? (
          <div className="space-y-10">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C] text-center">Projets Similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProjects.map((p) => {
                const imageUrl =
                  p?.images?.[0]?.image_path ||
                  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop';
                return (
                  <div key={p.id} className="group bg-white rounded-[32px] overflow-hidden border border-[#E0E6ED] hover:shadow-2xl transition-all duration-500 flex flex-col">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#1A3A5C] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          {p?.sector?.name || 'Projet'}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 space-y-4">
                      <h3 className="text-xl font-bold text-[#1A3A5C] group-hover:text-[#4A8BC2] transition-colors">{p.title}</h3>
                      <div className="flex items-center gap-4 text-xs font-bold text-[hsla(210,20%,60%,1)]">
                        <div className="flex items-center gap-1.5"><MapPin size={14} className="text-[#4A8BC2]" /> {p.location || '—'}</div>
                        <div className="flex items-center gap-1.5"><Calendar size={14} className="text-[#4A8BC2]" /> {p.year || '—'}</div>
                      </div>
                      <Link to={`/projets/${p.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#1A3A5C] hover:gap-3 transition-all pt-2">
                        Voir le Projet <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

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

      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title={project.title}
        className="max-w-6xl"
      >
        <div className="relative">
          <div className="rounded-[28px] overflow-hidden border border-[#E0E6ED] bg-[hsla(210,25%,98%,1)]">
            <img
              src={mainImage}
              alt={project.title}
              className="w-full max-h-[75vh] object-contain"
            />
          </div>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute top-1/2 -translate-y-1/2 left-3 w-12 h-12 rounded-2xl bg-white/90 border border-[#E0E6ED] shadow-lg flex items-center justify-center text-[#1A3A5C] hover:bg-white transition-colors"
                aria-label="Image précédente"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                className="absolute top-1/2 -translate-y-1/2 right-3 w-12 h-12 rounded-2xl bg-white/90 border border-[#E0E6ED] shadow-lg flex items-center justify-center text-[#1A3A5C] hover:bg-white transition-colors"
                aria-label="Image suivante"
              >
                <ChevronRight size={22} />
              </button>
              <div className="pt-4 flex items-center justify-center gap-2 text-xs font-bold text-[hsla(210,20%,50%,1)] uppercase tracking-widest">
                {activeImageIndex + 1} / {images.length}
              </div>
            </>
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
