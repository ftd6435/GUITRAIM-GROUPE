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
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentErrors, setCommentErrors] = useState({});
  const [commentForm, setCommentForm] = useState({ name: '', email: '', body: '' });
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [categoryPostsLoading, setCategoryPostsLoading] = useState(false);

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
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const response = await api.get(`/blog/${id}/comments`);
        setComments(response.data || []);
      } catch (e) {
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!selectedCategorySlug) return;
      try {
        setCategoryPostsLoading(true);
        const response = await api.get('/blog', { params: { category: selectedCategorySlug } });
        const currentSlug = articleData?.slug;
        const list = (response.data || [])
          .filter((p) => (currentSlug ? p.slug !== currentSlug : true))
          .slice(0, 4);
        setRelatedArticlesData(list);
      } catch (e) {
        setRelatedArticlesData([]);
      } finally {
        setCategoryPostsLoading(false);
      }
    };
    fetchRelated();
  }, [selectedCategorySlug, articleData?.slug]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await api.get('/categories');
        setCategories(response.data || []);
      } catch (e) {
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

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

  const articleTitle = article?.title || '';
  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : '';

  const publishedDateLabel = (() => {
    if (article?.published_at) {
      return new Date(article.published_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    if (article?.created_at) {
      return new Date(article.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    return article.date || '';
  })();

  const publishedTimeLabel = (() => {
    if (article?.created_at) {
      return new Date(article.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  })();

  const authorName = article?.author?.name || article.author || '—';
  const authorAvatarUrl =
    article?.author?.avatar_path ||
    (article?.author?.avatar ? `/storage/images/avatars/${article.author.avatar}` : null) ||
    article.authorAvatar ||
    null;

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
    openShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(articleTitle)}`);
  };

  const shareToWhatsApp = () => {
    openShare(`https://wa.me/?text=${encodeURIComponent(`${articleTitle} - ${shareUrl}`)}`);
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
        await navigator.share({ title: articleTitle, url: shareUrl });
      } else {
        await copyLink();
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    const slug = articleData?.category?.slug || article?.category?.slug || article?.categorySlug || null;
    const name = articleData?.category?.name || article?.category?.name || article?.category || '';
    if (!selectedCategorySlug && slug) {
      setSelectedCategorySlug(slug);
      setSelectedCategoryName(name);
    }
  }, [articleData?.category?.slug, articleData?.category?.name]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentSubmitting(true);
    setCommentErrors({});
    try {
      const response = await api.post(`/blog/${id}/comments`, commentForm);
      const created = response?.data;
      if (created) {
        setComments((prev) => {
          const exists = prev.some((c) => c.id === created.id);
          if (exists) return prev;
          return [
            {
              ...created,
              is_approved: !!created.is_approved,
              created_at: created.created_at || new Date().toISOString(),
            },
            ...prev,
          ];
        });
      }
      setCommentForm({ name: '', email: '', body: '' });
    } catch (error) {
      if (error?.errors) setCommentErrors(error.errors);
    } finally {
      setCommentSubmitting(false);
    }
  };

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
                {authorAvatarUrl ? (
                  <img src={authorAvatarUrl} alt={authorName} className="w-12 h-12 rounded-full border-2 border-white/20 object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center text-white font-bold">
                    {(authorName || 'A').slice(0, 1)}
                  </div>
                )}
                <div>
                  <p className="text-white font-bold">{authorName}</p>
                  {article.authorRole ? (
                    <p className="text-white/60 text-xs uppercase tracking-widest">{article.authorRole}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
                <Calendar size={18} />
                {publishedDateLabel}{publishedTimeLabel ? ` • ${publishedTimeLabel}` : ''}
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
            <div className="max-w-none">
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
                <div
                  className="text-[hsla(210,20%,40%,1)] font-medium leading-relaxed break-words overflow-hidden [&_p]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[#1A3A5C] [&_h1]:mb-5 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1A3A5C] [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1A3A5C] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-[#4A8BC2] [&_a]:font-bold [&_a]:break-words [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-[24px] [&_img]:border [&_img]:border-[#E0E6ED] [&_blockquote]:border-l-4 [&_blockquote]:border-[#4A8BC2] [&_blockquote]:pl-5 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:bg-[hsla(210,25%,98%,1)] [&_code]:break-words [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: article.content || '' }}
                />
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
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <h3 className="text-3xl font-bold text-[#1A3A5C]">Commentaires</h3>
                  <div className="text-xs font-bold uppercase tracking-widest text-[hsla(210,20%,50%,1)]">
                    {commentsLoading ? 'Chargement...' : `${comments.length} commentaire${comments.length > 1 ? 's' : ''}`}
                  </div>
                </div>
                {commentsLoading ? (
                  <div className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Chargement des commentaires...</div>
                ) : comments.length ? (
                  <div className="space-y-4">
                    {comments.map((c) => (
                      <div key={c.id} className="bg-white rounded-[32px] p-6 border border-[#E0E6ED]">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center font-bold shrink-0">
                            {(c.name || 'A').slice(0, 1).toUpperCase()}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              <div className="flex items-center gap-3">
                                <div className="font-bold text-[#1A3A5C]">{c.name}</div>
                                {!c.is_approved ? (
                                  <span className="px-2 py-1 rounded-full bg-[#FFF7E6] text-[#B26A00] text-[10px] font-bold uppercase tracking-widest">
                                    En attente
                                  </span>
                                ) : null}
                              </div>
                              <div className="text-xs font-bold uppercase tracking-widest text-[hsla(210,20%,55%,1)]">
                                {c.created_at ? new Date(c.created_at).toLocaleString('fr-FR') : ''}
                              </div>
                            </div>
                            <div className="text-sm font-medium text-[hsla(210,20%,40%,1)] leading-relaxed whitespace-pre-wrap">
                              {c.body}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm font-medium text-[hsla(210,20%,40%,1)]">
                    Soyez le premier à laisser un commentaire.
                  </div>
                )}

                <h3 className="text-3xl font-bold text-[#1A3A5C]">Laissez un Commentaire</h3>
                <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Votre adresse e-mail ne sera pas publiée. Les champs marqués d'un (*) sont obligatoires.</p>
              </div>

              <form onSubmit={handleCommentSubmit} className="space-y-6 bg-white rounded-[40px] p-8 lg:p-12 border border-[#E0E6ED] shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nom *"
                    placeholder="votre nom complet"
                    value={commentForm.name}
                    onChange={(e) => setCommentForm((p) => ({ ...p, name: e.target.value }))}
                    error={commentErrors.name?.[0]}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="votre@email.com"
                    value={commentForm.email}
                    onChange={(e) => setCommentForm((p) => ({ ...p, email: e.target.value }))}
                    error={commentErrors.email?.[0]}
                  />
                </div>
                <Textarea
                  label="Commentaire *"
                  placeholder="partagez votre avis sur cet article..."
                  value={commentForm.body}
                  onChange={(e) => setCommentForm((p) => ({ ...p, body: e.target.value }))}
                  error={commentErrors.body?.[0]}
                  required
                  className="min-h-[150px]"
                />
                <Button
                  type="submit"
                  disabled={commentSubmitting}
                  className="h-14 px-10 rounded-2xl bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold gap-3 shadow-xl shadow-[#1A3A5C]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {commentSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Publier le Commentaire
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Share */}
            <div className="bg-white rounded-[32px] p-8 border border-[#E0E6ED] space-y-6">
              <h4 className="text-lg font-bold text-[#1A3A5C]">Partager l'article</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={shareToFacebook}
                  className="h-12 px-4 rounded-2xl bg-[hsla(210,25%,98%,1)] text-[#1A3A5C] flex items-center justify-center gap-2 hover:bg-[#1A3A5C] hover:text-white transition-all font-bold text-sm"
                  title="Partager sur Facebook"
                >
                  <User size={18} />
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={shareToLinkedIn}
                  className="h-12 px-4 rounded-2xl bg-[hsla(210,25%,98%,1)] text-[#1A3A5C] flex items-center justify-center gap-2 hover:bg-[#1A3A5C] hover:text-white transition-all font-bold text-sm"
                  title="Partager sur LinkedIn"
                >
                  <LinkIcon size={18} />
                  LinkedIn
                </button>
                <button
                  type="button"
                  onClick={shareToX}
                  className="h-12 px-4 rounded-2xl bg-[hsla(210,25%,98%,1)] text-[#1A3A5C] flex items-center justify-center gap-2 hover:bg-[#1A3A5C] hover:text-white transition-all font-bold text-sm"
                  title="Partager sur X"
                >
                  <Share2 size={18} />
                  X
                </button>
                <button
                  type="button"
                  onClick={shareToWhatsApp}
                  className="h-12 px-4 rounded-2xl bg-[hsla(210,25%,98%,1)] text-[#1A3A5C] flex items-center justify-center gap-2 hover:bg-[#1A3A5C] hover:text-white transition-all font-bold text-sm"
                  title="Partager sur WhatsApp"
                >
                  <Send size={18} />
                  WhatsApp
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={copyLink}
                  className="h-12 px-4 rounded-2xl bg-white border border-[#E0E6ED] text-[#1A3A5C] flex items-center justify-center gap-2 hover:border-[#1A3A5C] transition-all font-bold text-sm"
                  title="Copier le lien"
                >
                  <LinkIcon size={18} />
                  Copier
                </button>
                <button
                  type="button"
                  onClick={nativeShare}
                  className="h-12 px-4 rounded-2xl bg-[#1A3A5C] text-white flex items-center justify-center gap-2 hover:bg-[#1A3A5C]/90 transition-all font-bold text-sm"
                  title="Partager"
                >
                  <Share2 size={18} />
                  Partager
                </button>
              </div>
            </div>

            {/* Related Articles */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-[#1A3A5C]">
                {selectedCategoryName ? `Articles - ${selectedCategoryName}` : 'Articles'}
              </h4>
              <div className="space-y-6">
                {categoryPostsLoading ? (
                  <div className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Chargement...</div>
                ) : relatedArticles.map((item) => (
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
                {!categoryPostsLoading && relatedArticles.length === 0 ? (
                  <div className="text-sm font-medium text-[hsla(210,20%,40%,1)]">
                    Aucun article dans cette catégorie.
                  </div>
                ) : null}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-[hsla(210,25%,98%,1)] rounded-[32px] p-8 border border-[#E0E6ED] space-y-6">
              <h4 className="text-xl font-bold text-[#1A3A5C]">Catégories</h4>
              <div className="space-y-3">
                {categoriesLoading ? (
                  <div className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Chargement...</div>
                ) : categories.length ? (
                  categories.map((cat) => {
                    const isActive = selectedCategorySlug === cat.slug;
                    const count = typeof cat.blog_posts_count === 'number' ? cat.blog_posts_count : 0;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategorySlug(cat.slug);
                          setSelectedCategoryName(cat.name);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl transition-all group text-left",
                          isActive ? "bg-white shadow-sm" : "hover:bg-white hover:shadow-sm"
                        )}
                      >
                        <span className={cn(
                          "text-sm font-bold transition-colors",
                          isActive ? "text-[#1A3A5C]" : "text-[hsla(210,20%,40%,1)] group-hover:text-[#1A3A5C]"
                        )}>
                          {cat.name}
                        </span>
                        <span className={cn(
                          "w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-black transition-all",
                          isActive
                            ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
                            : "bg-white border-[#E0E6ED] text-[#1A3A5C] group-hover:bg-[#1A3A5C] group-hover:text-white"
                        )}>
                          {count}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Aucune catégorie.</div>
                )}
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
