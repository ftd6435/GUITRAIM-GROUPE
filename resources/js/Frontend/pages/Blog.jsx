import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, User } from 'lucide-react';
import { cn } from '../../utils/utils';
import Button from '../../Components/ui/Button';
import api from '../../utils/api';
import { applySeo } from '../../utils/seo';

const Blog = () => {
  const fallbackArticles = [
    {
      id: 1,
      title: 'Les Nouvelles Techniques de Construction Durable en Guinée',
      category: 'Construction',
      date: '15 Nov 2024',
      author: 'Équipe GUITRAIM',
      readTime: '5 min de lecture',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800&auto=format&fit=crop',
      summary: 'Découvrez comment GUITRAIM GROUPE intègre les dernières innovations en matière de construction écologique pour des bâtiments plus durables et économes en énergie.'
    },
    {
      id: 2,
      title: 'Tendances du Marché Immobilier Guinéen 2024',
      category: 'Immobilier',
      date: '12 Nov 2024',
      author: 'Direction Immobilière',
      readTime: '7 min de lecture',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop',
      summary: 'Analyse complète des évolutions du secteur immobilier en Guinée : opportunités d\'investissement, zones en développement et perspectives d\'avenir.'
    },
    {
      id: 3,
      title: 'Optimisation des Chaînes Logistiques en Afrique de l\'Ouest',
      category: 'Transport',
      date: '8 Nov 2024',
      author: 'Logistique Pro',
      readTime: '6 min de lecture',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      summary: 'Comment les nouvelles technologies transforment le secteur du transport et de la logistique pour améliorer l\'efficacité des approvisionnements régionaux.'
    },
    {
      id: 4,
      title: 'La Transformation Numérique des Entreprises Guinéennes',
      category: 'Tech',
      date: '5 Nov 2024',
      author: 'Expert Digital',
      readTime: '4 min de lecture',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      summary: 'Accompagner les entreprises locales dans leur digitalisation : enjeux, solutions et bénéfices de l\'adoption des nouvelles technologies.'
    },
    {
      id: 5,
      title: 'GUITRAIM GROUPE Remporte le Prix de l\'Excellence 2024',
      category: 'Actualités',
      date: '2 Nov 2024',
      author: 'Com Corporate',
      readTime: '3 min de lecture',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      summary: 'Reconnaissance nationale pour notre engagement dans le développement économique de la Guinée et l\'innovation dans nos secteurs d\'activité.'
    },
    {
      id: 6,
      title: 'Développement d\'Infrastructures Durables : Notre Vision 2025',
      category: 'Construction',
      date: '30 Oct 2024',
      author: 'Direction Technique',
      readTime: '8 min de lecture',
      image: 'https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?q=80&w=800&auto=format&fit=crop',
      summary: 'Plans stratégiques pour le développement d\'infrastructures modernes et respectueuses de l\'environnement en Guinée et dans la sous-région.'
    },
    {
      id: 7,
      title: 'Guide d\'Investissement Immobilier pour les Expatriés',
      category: 'Immobilier',
      date: '28 Oct 2024',
      author: 'Conseil Immo',
      readTime: '6 min de lecture',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
      summary: 'Conseils pratiques et opportunités d\'investissement pour les professionnels internationaux souhaitant acquérir des biens immobiliers en Guinée.'
    },
    {
      id: 8,
      title: 'Solutions Logistiques Innovantes pour le Commerce Régional',
      category: 'Transport',
      date: '25 Oct 2024',
      author: 'Responsable Flux',
      readTime: '5 min de lecture',
      image: 'https://images.unsplash.com/photo-1606185540410-dd628c04eec2?q=80&w=800&auto=format&fit=crop',
      summary: 'Présentation de nos nouvelles solutions de transport et distribution pour faciliter les échanges commerciaux entre les pays de l\'Afrique de l\'Ouest.'
    },
    {
      id: 9,
      title: 'Notre Engagement pour le Développement Local',
      category: 'Actualités',
      date: '22 Oct 2024',
      author: 'Responsable RSE',
      readTime: '4 min de lecture',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
      summary: 'Découvrez nos initiatives de formation professionnelle et de soutien aux entreprises locales pour contribuer au développement économique de la Guinée.'
    }
  ];

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await api.get('/blog');
        setArticles(response.data || []);
      } catch (e) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await api.get('/pages/blog');
        setPage(response.data || null);
        applySeo({
          title: response?.data?.meta_title,
          description: response?.data?.meta_description,
          fallbackTitle: 'Blog - GUITRAIM GROUPE',
        });
      } catch (e) {
        setPage(null);
        applySeo({ title: null, description: null, fallbackTitle: 'Blog - GUITRAIM GROUPE' });
      }
    };
    fetchPage();
  }, []);

  const displayedArticles = useMemo(() => {
    return articles.length ? articles : fallbackArticles;
  }, [articles, fallbackArticles]);

  const estimateReadingTimeMinutes = (value) => {
    if (!value) return null;
    const text = Array.isArray(value)
      ? value.map((b) => (b?.value ? String(b.value) : '')).join(' ')
      : String(value).replace(/<[^>]*>/g, ' ');
    const words = (text.match(/[\p{L}\p{N}]+/gu) || []).length;
    if (!words) return null;
    return Math.max(1, Math.ceil(words / 200));
  };

  return (
    <div className="pb-24">
      {/* Header Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={page?.hero_image_path || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000&auto=format&fit=crop"}
            alt="Blog & Actualités"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1A3A5C]/80 backdrop-blur-sm" />
        </div>
        <div className="container relative z-10 px-4 lg:px-8 text-center space-y-4">
          <div className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center justify-center gap-2">
            Accueil <ArrowRight size={14} /> Blog
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white">Blog & Actualités</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto font-medium">
            Suivez nos actualités et découvrez nos analyses sectorielles
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="container px-4 lg:px-8 py-16 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1A3A5C]">Articles Récents</h2>
          <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
            Découvrez nos dernières analyses sectorielles et actualités du groupe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            <div className="col-span-full text-center text-sm font-medium text-[hsla(210,20%,40%,1)]">
              Chargement...
            </div>
          ) : (
            displayedArticles.map((article) => {
              const imageUrl =
                article.image_path ||
                article.image ||
                'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop';
              const categoryLabel = article?.category?.name || article.category || 'Actualités';
              const dateLabel = article?.published_at
                ? new Date(article.published_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                : article?.created_at
                  ? new Date(article.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                  : article.date || '—';
              const authorLabel = article?.author?.name || article.author || 'Équipe GUITRAIM';
              const readTimeMinutes =
                article?.reading_time ||
                estimateReadingTimeMinutes(article?.content) ||
                estimateReadingTimeMinutes(article?.excerpt) ||
                null;
              const readTimeLabel = readTimeMinutes
                ? `${readTimeMinutes} min de lecture`
                : (article.readTime || '—');
              const excerpt = article.excerpt || article.summary || '';
              const articleSlug = article.slug || article.id;

              return (
                <div key={article.id} className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-[#E0E6ED] hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-[#1A3A5C] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {categoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow space-y-4">
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#4A8BC2]" />
                        {dateLabel}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-[#4A8BC2]" />
                        {authorLabel}
                      </div>
                    </div>

                    <div className="space-y-3 flex-grow">
                      <h3 className="text-xl font-bold text-[#1A3A5C] group-hover:text-[#4A8BC2] transition-colors leading-tight">
                        {article.title}
                      </h3>
                      <p className="text-sm font-medium leading-relaxed text-[hsla(210,20%,40%,1)] line-clamp-3">
                        {excerpt}
                      </p>
                    </div>

                    <div className="pt-6 mt-4 border-t border-[#E0E6ED] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[hsla(210,20%,40%,1)] uppercase tracking-wider">
                        <Clock size={12} className="text-[#4A8BC2]" />
                        {readTimeLabel}
                      </div>
                      <Link to={`/blog/${articleSlug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#1A3A5C] group-hover:gap-3 transition-all">
                        Lire l'Article <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
