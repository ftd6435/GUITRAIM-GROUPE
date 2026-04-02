import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, User, Clock, Share2, Send,
  ArrowRight, MessageSquare, Search, ChevronRight,
  Quote, CheckCircle2, Lightbulb, Link as LinkIcon, Camera, Loader2
} from 'lucide-react';
import { cn } from '../../utils/utils';
import Button from '../../Components/ui/Button';
import { Input, Textarea } from '../../Components/ui/Input';
import api from '../../utils/api';

const ArticleDetail = () => {
  const { id } = useParams();

  const [articleData, setArticleData] = useState(null);
  const [relatedArticlesData, setRelatedArticlesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/blog/${id}`);
        setArticleData(response.data);
      } catch (e) {
        setArticleData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      const categorySlug = articleData?.category?.slug;
      if (!categorySlug) return;
      try {
        const response = await api.get('/blog', { params: { category: categorySlug } });
        const list = (response.data || []).filter((p) => p.slug !== articleData.slug).slice(0, 2);
        setRelatedArticlesData(list);
      } catch (e) {
        setRelatedArticlesData([]);
      }
    };
    fetchRelated();
  }, [articleData?.category?.slug, articleData?.slug]);

  // Static article data
  const fallbackArticle = {
    title: 'Les Nouvelles Techniques de Construction Durable en Guinée : Innovation et Écologie au Service de l\'Architecture',
    category: 'Construction',
    categorySlug: 'construction',
    author: 'Mamadou Diallo',
    authorRole: 'Ingénieur Construction Senior',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    date: '15 Novembre 2024',
    readTime: '6 min de lecture',
    mainImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2000&auto=format&fit=crop',
    content: [
      {
        type: 'text',
        value: 'Dans un contexte où l\'environnement et la durabilité deviennent des priorités mondiales, l\'industrie de la construction en Guinée connaît une véritable révolution. GUITRAIM GROUPE, pionnier dans l\'adoption des technologies vertes, explore les dernières innovations qui transforment notre approche de la construction pour créer des bâtiments plus respectueux de l\'environnement et économes en énergie.'
      },
      {
        type: 'heading',
        value: 'L\'émergence de l\'éco-construction en Afrique de l\'Ouest'
      },
      {
        type: 'text',
        value: 'L\'Afrique de l\'Ouest fait face à des défis climatiques croissants qui nécessitent une approche repensée de la construction. Les températures élevées, les précipitations irrégulières et la nécessité de réduire l\'empreinte carbone poussent les entreprises comme GUITRAIM GROUPE à innover constamment.'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
        caption: 'Chantier de construction écologique intégrant panneaux solaires et matériaux durables.'
      },
      {
        type: 'heading',
        value: 'Les matériaux innovants au cœur de la transformation'
      },
      {
        type: 'list',
        items: [
          'Briques de terre compressée stabilisée (BTCS) - Réduction de 40% de l\'empreinte carbone par rapport aux briques traditionnelles.',
          'Béton recyclé : Intégration de 20% de matériaux recyclés sans compromettre la résistance structurelle.',
          'Isolants naturels : Utilisation de fibres de coco et de paille de riz produites localement.',
          'Toitures végétalisées : Réduction de la température intérieure de 3 à 5°C en période chaude.'
        ]
      },
      {
        type: 'quote',
        text: 'L\'innovation en construction durable ne consiste pas seulement à utiliser de nouveaux matériaux, mais à repenser entièrement notre rapport à l\'environnement et aux ressources locales.',
        author: 'Amadou Bah, Directeur Technique GUITRAIM GROUPE'
      },
      {
        type: 'heading',
        value: 'Gestion intelligente de l\'eau et de l\'énergie'
      },
      {
        type: 'text',
        value: 'La gestion de l\'eau représente un enjeu crucial dans notre région. Nos solutions intègrent :'
      },
      {
        type: 'list',
        items: [
          'Systèmes de récupération d\'eau de pluie avec filtration naturelle.',
          'Traitement des eaux grises pour l\'irrigation des espaces verts.',
          'Équipements sanitaires économes réduisant la consommation de 40%.',
          'Revêtements perméables favorisant l\'infiltration naturelle.'
        ]
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1585822719534-909836800aa0?q=80&w=1200&auto=format&fit=crop',
        caption: 'Système de gestion intelligente de l\'eau intégrant récupération et filtration naturelle.'
      }
    ],
    tags: ['Construction Durable', 'Écologie', 'Innovation', 'Guinée', 'BTP', 'Matériaux Verts'],
    relatedArticles: [
      {
        id: 2,
        title: 'Tendances du Marché Immobilier Guinéen 2024',
        category: 'Immobilier',
        date: '12 Novembre 2024',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 3,
        title: 'Optimisation des Chaînes Logistiques',
        category: 'Transport',
        date: '8 Novembre 2024',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400&auto=format&fit=crop'
      }
    ]
  };

  const article = articleData || fallbackArticle;
  const relatedArticles = relatedArticlesData.length ? relatedArticlesData : (article.relatedArticles || []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-[#1A3A5C]" size={32} />
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Article Header */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={article.image_path || article.mainImage} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A5C] via-[#1A3A5C]/60 to-transparent" />
        </div>
        <div className="container relative z-10 px-4 lg:px-8 space-y-8">
          <div className="flex items-center gap-4 text-white/70 text-sm font-bold uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight size={14} />
            <span className="text-white">{article?.category?.name || article.category}</span>
          </div>

          <div className="space-y-6 max-w-5xl">
            <div className="inline-block px-4 py-1 rounded-full bg-[#4A8BC2] text-white text-xs font-bold uppercase tracking-wider">
              {article?.category?.name || article.category}
            </div>
            <h1 className="text-3xl lg:text-6xl font-bold text-white leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                {article.authorAvatar ? (
                  <img src={article.authorAvatar} alt={article.author} className="w-12 h-12 rounded-full border-2 border-white/20" />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center text-white font-bold">
                    {(article?.author?.name || article.author || 'A').slice(0, 1)}
                  </div>
                )}
                <div>
                  <p className="text-white font-bold">{article?.author?.name || article.author}</p>
                  {article.authorRole ? (
                    <p className="text-white/60 text-xs uppercase tracking-widest">{article.authorRole}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
                <Calendar size={18} />
                {article?.published_at ? new Date(article.published_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : article.date}
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
                <Clock size={18} />
                {article?.reading_time ? `${article.reading_time} min de lecture` : article.readTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <div className="prose prose-lg prose-slate max-w-none">
              {Array.isArray(article.content) ? (
                article.content.map((block, idx) => {
                  if (block.type === 'text') return <p key={idx} className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed mb-8">{block.value}</p>;
                  if (block.type === 'heading') return <h2 key={idx} className="text-3xl font-bold text-[#1A3A5C] mt-12 mb-6">{block.value}</h2>;
                  if (block.type === 'image') return (
                    <figure key={idx} className="my-12 space-y-4">
                      <div className="rounded-[32px] overflow-hidden shadow-xl">
                        <img src={block.url} alt={block.caption} className="w-full h-auto" />
                      </div>
                      <figcaption className="text-center text-sm font-medium text-[hsla(210,20%,60%,1)] italic">{block.caption}</figcaption>
                    </figure>
                  );
                  if (block.type === 'list') return (
                    <ul key={idx} className="space-y-4 my-8">
                      {block.items.map((item, i) => (
                        <li key={i} className="flex gap-4 text-lg font-medium text-[hsla(210,20%,40%,1)]">
                          <CheckCircle2 size={24} className="text-[#4A8BC2] shrink-0 mt-1" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                  if (block.type === 'quote') return (
                    <div key={idx} className="my-12 p-10 bg-[hsla(210,25%,98%,1)] rounded-[40px] border-l-8 border-[#4A8BC2] relative overflow-hidden">
                      <Quote size={80} className="absolute -top-4 -right-4 text-[#4A8BC2] opacity-10" />
                      <p className="text-2xl font-bold italic text-[#1A3A5C] leading-relaxed relative z-10">"{block.text}"</p>
                      <p className="mt-4 font-bold text-[#4A8BC2] uppercase tracking-widest text-sm">— {block.author}</p>
                    </div>
                  );
                  return null;
                })
              ) : (
                <div dangerouslySetInnerHTML={{ __html: article.content || '' }} />
              )}
            </div>

            {/* Tags */}
            <div className="pt-8 border-t border-[#E0E6ED] flex flex-wrap gap-3">
              <span className="text-sm font-bold text-[#1A3A5C] mr-2">Mots-clés :</span>
              {(article.tags || []).map((tag, idx) => (
                <span key={idx} className="px-4 py-1.5 rounded-full bg-[hsla(210,25%,98%,1)] border border-[#E0E6ED] text-xs font-bold text-[hsla(210,20%,40%,1)] hover:bg-[#1A3A5C] hover:text-white transition-all cursor-pointer">
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
            </div>

            {/* Comment Form */}
            <div className="pt-16 space-y-10">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-[#1A3A5C]">Laissez un Commentaire</h3>
                <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Votre adresse e-mail ne sera pas publiée. Les champs marqués d'un (*) sont obligatoires.</p>
              </div>

              <form className="space-y-6 bg-white rounded-[40px] p-8 lg:p-12 border border-[#E0E6ED] shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Nom *" placeholder="votre nom complet" required />
                  <Input label="Email *" type="email" placeholder="votre@email.com" required />
                </div>
                <Textarea label="Commentaire *" placeholder="partagez votre avis sur cet article..." required className="min-h-[150px]" />
                <Button className="h-14 px-10 rounded-2xl bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold gap-3 shadow-xl shadow-[#1A3A5C]/20">
                  <Send size={18} /> Publier le Commentaire
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Share */}
            <div className="bg-white rounded-[32px] p-8 border border-[#E0E6ED] space-y-6">
              <h4 className="text-lg font-bold text-[#1A3A5C]">Partager l'article</h4>
              <div className="flex gap-4">
                {[User, Send, LinkIcon, Share2].map((Icon, idx) => (
                  <button key={idx} className="w-12 h-12 rounded-2xl bg-[hsla(210,25%,98%,1)] text-[#1A3A5C] flex items-center justify-center hover:bg-[#1A3A5C] hover:text-white transition-all">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>

            {/* Related Articles */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-[#1A3A5C]">Articles Similaires</h4>
              <div className="space-y-6">
                {relatedArticles.map((item) => (
                  <Link key={item.id} to={`/blog/${item.slug || item.id}`} className="flex gap-4 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      <img
                        src={item.image_path || item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#4A8BC2] uppercase tracking-widest">{item?.category?.name || item.category}</span>
                      <h5 className="text-sm font-bold text-[#1A3A5C] line-clamp-2 group-hover:text-[#4A8BC2] transition-colors">{item.title}</h5>
                      <p className="text-[10px] font-medium text-[hsla(210,20%,60%,1)] uppercase tracking-widest">
                        {item?.published_at ? new Date(item.published_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : item.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-[hsla(210,25%,98%,1)] rounded-[32px] p-8 border border-[#E0E6ED] space-y-6">
              <h4 className="text-xl font-bold text-[#1A3A5C]">Catégories</h4>
              <div className="space-y-3">
                {[
                  { name: 'Construction', count: 12 },
                  { name: 'Immobilier', count: 8 },
                  { name: 'Transport', count: 5 },
                  { name: 'Tech', count: 9 },
                  { name: 'Actualités', count: 3 }
                ].map((cat, idx) => (
                  <Link key={idx} to="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group">
                    <span className="text-sm font-bold text-[hsla(210,20%,40%,1)] group-hover:text-[#1A3A5C]">{cat.name}</span>
                    <span className="w-8 h-8 rounded-lg bg-white border border-[#E0E6ED] flex items-center justify-center text-xs font-black text-[#1A3A5C] group-hover:bg-[#1A3A5C] group-hover:text-white transition-all">{cat.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Global CTA */}
      <section className="container px-4 lg:px-8 mt-12">
        <div className="bg-[#1A3A5C] rounded-[64px] p-12 lg:p-24 text-center space-y-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
            <h3 className="text-3xl lg:text-6xl font-bold text-white tracking-tight leading-tight">Besoin d'Accompagnement pour Votre Projet ?</h3>
            <p className="text-xl font-medium text-white/70 leading-relaxed">Notre équipe d'experts en construction durable est à votre disposition pour étudier vos besoins et vous proposer des solutions sur mesure respectueuses de l'environnement.</p>
          </div>
          <div className="relative z-10 pt-4 flex justify-center">
            <Link to="/contact">
              <Button className="h-16 px-12 rounded-[24px] bg-[#4A8BC2] hover:bg-[#4A8BC2]/90 text-white font-bold text-lg shadow-2xl shadow-[#4A8BC2]/20 gap-3">
                <Lightbulb size={24} /> Contactez Notre Bureau d'Études
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArticleDetail;
