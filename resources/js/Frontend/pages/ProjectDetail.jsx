import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronRight,
  Loader2,
  MapPin,
} from 'lucide-react';
import { cn } from '../../utils/utils';
import Button from '../../Components/ui/Button';
import api from '../../utils/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const slug = id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProjects, setSimilarProjects] = useState([]);

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
  const mainImage = images?.[0]?.image_path || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop';
  const categoryLabel = project?.sector?.name || 'Projet';

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
        </div>
      </section>

      <section className="container px-4 lg:px-8 py-16 space-y-16">
        <div className="space-y-8">
          <div className="aspect-video rounded-[48px] overflow-hidden shadow-2xl border-8 border-white">
            <img src={mainImage} alt={project.title} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-8">
              {images.slice(0, 6).map((img) => (
                <div key={img.id} className="aspect-square rounded-[24px] overflow-hidden border-4 border-white shadow-lg">
                  <img src={img.image_path} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
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
              <div className={cn("bg-white rounded-[40px] p-10 border border-[#E0E6ED] shadow-sm", "prose max-w-none")}>
                <div dangerouslySetInnerHTML={{ __html: project.content }} />
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
    </div>
  );
};

export default ProjectDetail;
