import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Pencil, Loader2, FileText, ExternalLink } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import { Input, Textarea } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', meta_title: '', meta_description: '' });
  const [aboutData, setAboutData] = useState({
    history_title: 'Notre Histoire',
    history_text: '',
    vision_title: 'Notre Vision',
    vision_text: '',
    values: [{ title: '', description: '' }],
    stats: [{ value: '', label: '', sublabel: '' }],
  });
  const [teamData, setTeamData] = useState({
    management_title: 'Direction Générale',
    management_subtitle: '',
    sector_title: 'Nos Responsables Sectoriels',
    sector_subtitle: '',
  });
  const [homeData, setHomeData] = useState({
    hero_title: '',
    hero_subtitle: '',
  });
  const [heroImage, setHeroImage] = useState(null);
  const [historyImage, setHistoryImage] = useState(null);
  const [visionImage, setVisionImage] = useState(null);
  const [homeHeroImages, setHomeHeroImages] = useState([]);
  const [heroPreview, setHeroPreview] = useState(null);
  const [historyPreview, setHistoryPreview] = useState(null);
  const [visionPreview, setVisionPreview] = useState(null);
  const [homeHeroPreviews, setHomeHeroPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const heroInputRef = useRef(null);
  const historyInputRef = useRef(null);
  const visionInputRef = useRef(null);
  const homeHeroInputRef = useRef(null);

  const isAboutPage = useMemo(() => editingPage?.slug === 'a-propos', [editingPage?.slug]);
  const isTeamPage = useMemo(() => editingPage?.slug === 'equipe', [editingPage?.slug]);
  const isHomePage = useMemo(() => editingPage?.slug === 'accueil', [editingPage?.slug]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pages/all'); // Assuming there's a route for all pages
      setPages(response.data || []);
    } catch (error) {
      // Fallback if the endpoint is different or not ready
      console.error('Échec de la récupération des pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleOpenModal = (page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      content: page.content || '',
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || ''
    });
    setHeroImage(null);
    setHeroPreview(page.hero_image_path || null);
    if (page.slug === 'a-propos') {
      const data = page.data || {};
      setAboutData({
        history_title: data.history_title || 'Notre Histoire',
        history_text: data.history_text || '',
        vision_title: data.vision_title || 'Notre Vision',
        vision_text: data.vision_text || '',
        values: Array.isArray(data.values) && data.values.length ? data.values : [{ title: '', description: '' }],
        stats: Array.isArray(data.stats) && data.stats.length ? data.stats : [{ value: '', label: '', sublabel: '' }],
      });
      setHistoryImage(null);
      setVisionImage(null);
      setHistoryPreview(page.history_image_path || null);
      setVisionPreview(page.vision_image_path || null);
    }
    if (page.slug === 'equipe') {
      const data = page.data || {};
      setTeamData({
        management_title: data.management_title || 'Direction Générale',
        management_subtitle: data.management_subtitle || '',
        sector_title: data.sector_title || 'Nos Responsables Sectoriels',
        sector_subtitle: data.sector_subtitle || '',
      });
    }
    if (page.slug === 'accueil') {
      const data = page.data || {};
      setHomeData({
        hero_title: data.hero_title || '',
        hero_subtitle: data.hero_subtitle || '',
      });
      setHomeHeroImages([]);
      setHomeHeroPreviews(page.hero_images_paths || []);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
    setHeroImage(null);
    setHistoryImage(null);
    setVisionImage(null);
    setHomeHeroImages([]);
    setHeroPreview(null);
    setHistoryPreview(null);
    setVisionPreview(null);
    setHomeHeroPreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const data = new FormData();
      data.append('title', formData.title || '');
      data.append('meta_title', formData.meta_title || '');
      data.append('meta_description', formData.meta_description || '');
      data.append('content', formData.content || '');

      if (heroImage) data.append('hero_image', heroImage);

      if (isAboutPage) {
        data.append('data', JSON.stringify(aboutData));
        if (historyImage) data.append('history_image', historyImage);
        if (visionImage) data.append('vision_image', visionImage);
      } else if (isTeamPage) {
        data.append('data', JSON.stringify(teamData));
      } else if (isHomePage) {
        data.append('data', JSON.stringify(homeData));
        (homeHeroImages || []).forEach((file) => {
          if (file) data.append('hero_images[]', file);
        });
      }

      await api.post(`/pages/${editingPage.slug}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchPages();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const updateValueItem = (index, patch) => {
    setAboutData((prev) => {
      const next = [...(prev.values || [])];
      next[index] = { ...(next[index] || { title: '', description: '' }), ...patch };
      return { ...prev, values: next };
    });
  };

  const addValueItem = () => {
    setAboutData((prev) => ({ ...prev, values: [...(prev.values || []), { title: '', description: '' }] }));
  };

  const removeValueItem = (index) => {
    setAboutData((prev) => {
      const next = [...(prev.values || [])];
      next.splice(index, 1);
      return { ...prev, values: next.length ? next : [{ title: '', description: '' }] };
    });
  };

  const updateStatItem = (index, patch) => {
    setAboutData((prev) => {
      const next = [...(prev.stats || [])];
      next[index] = { ...(next[index] || { value: '', label: '', sublabel: '' }), ...patch };
      return { ...prev, stats: next };
    });
  };

  const addStatItem = () => {
    setAboutData((prev) => ({ ...prev, stats: [...(prev.stats || []), { value: '', label: '', sublabel: '' }] }));
  };

  const removeStatItem = (index) => {
    setAboutData((prev) => {
      const next = [...(prev.stats || [])];
      next.splice(index, 1);
      return { ...prev, stats: next.length ? next : [{ value: '', label: '', sublabel: '' }] };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Pages Statiques</h2>
        <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Modifiez le contenu des pages principales de votre site web</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin text-[#1A3A5C]" size={32} />
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Titre de la Page</TH>
                  <TH>Slug</TH>
                  <TH>Dernière Mise à jour</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {pages.map((page) => (
                  <TR key={page.id}>
                    <TD>
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#4A8BC2]" />
                        <span className="font-semibold text-[hsla(210,30%,20%,1)]">{page.title}</span>
                      </div>
                    </TD>
                    <TD>
                      <code className="text-xs bg-[hsla(210,25%,98%,1)] px-2 py-1 rounded border border-[#E0E6ED]">
                        /{page.slug}
                      </code>
                    </TD>
                    <TD>{new Date(page.updated_at).toLocaleDateString()}</TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(page)} className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => window.open(`/${page.slug}`)} className="text-[hsla(210,15%,55%,1)] hover:bg-[hsla(210,25%,98%,1)]">
                        <ExternalLink size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {pages.length === 0 && (
                  <TR>
                    <TD colSpan={4} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucune page statique trouvée.
                    </TD>
                  </TR>
                )}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Modifier la Page : ${editingPage?.title}`}
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Titre de la Page"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title?.[0]}
            required
          />
          <Input
            label="Meta Title (SEO)"
            placeholder="Titre pour les moteurs de recherche"
            value={formData.meta_title}
            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
            error={errors.meta_title?.[0]}
          />
          <Textarea
            label="Meta Description (SEO)"
            placeholder="Description pour les moteurs de recherche"
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            error={errors.meta_description?.[0]}
            rows={2}
          />
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[hsla(210,30%,20%,1)] ml-1">Image de couverture (Background) (min 1200×600, max 2 Mo)</label>
            <div className="flex items-center gap-4">
              <Button type="button" variant="secondary" onClick={() => heroInputRef.current?.click()}>
                Choisir l’image
              </Button>
              {heroPreview ? (
                <img src={heroPreview} alt="Aperçu" className="h-16 w-28 rounded-xl object-cover border border-[#E0E6ED]" />
              ) : null}
            </div>
            <input
              ref={heroInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setHeroImage(file);
                setHeroPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            {errors.hero_image?.[0] ? <p className="text-xs font-medium text-[#D64545] ml-1">{errors.hero_image[0]}</p> : null}
          </div>

          {isHomePage ? (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[hsla(210,30%,20%,1)]">Accueil - Couverture (Diapo)</h3>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[hsla(210,30%,20%,1)] ml-1">Images (2 à 3, min 1200×600, max 2 Mo chacune)</label>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="secondary" onClick={() => homeHeroInputRef.current?.click()}>
                    Choisir les images
                  </Button>
                  <div className="text-xs font-medium text-[hsla(210,20%,45%,1)]">
                    {(homeHeroImages?.length || 0) ? `${homeHeroImages.length} sélectionnée(s)` : `${homeHeroPreviews.length} existante(s)`}
                  </div>
                </div>
                <input
                  ref={homeHeroInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []).slice(0, 3);
                    setHomeHeroImages(files);
                    setHomeHeroPreviews(files.map((f) => URL.createObjectURL(f)));
                  }}
                />
                {errors.hero_images?.[0] ? <p className="text-xs font-medium text-[#D64545] ml-1">{errors.hero_images[0]}</p> : null}
                {errors['hero_images.0']?.[0] ? <p className="text-xs font-medium text-[#D64545] ml-1">{errors['hero_images.0'][0]}</p> : null}
                {homeHeroPreviews.length ? (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {homeHeroPreviews.slice(0, 3).map((src, idx) => (
                      <img key={idx} src={src} alt={`Aperçu ${idx + 1}`} className="h-20 w-full rounded-xl object-cover border border-[#E0E6ED]" />
                    ))}
                  </div>
                ) : null}
              </div>
              <Input
                label="Titre Hero (optionnel)"
                value={homeData.hero_title}
                onChange={(e) => setHomeData((p) => ({ ...p, hero_title: e.target.value }))}
              />
              <Textarea
                label="Sous-titre Hero (optionnel)"
                value={homeData.hero_subtitle}
                onChange={(e) => setHomeData((p) => ({ ...p, hero_subtitle: e.target.value }))}
                rows={3}
              />
            </div>
          ) : isTeamPage ? (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[hsla(210,30%,20%,1)]">Équipe - Sections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Titre - Direction Générale"
                  value={teamData.management_title}
                  onChange={(e) => setTeamData((p) => ({ ...p, management_title: e.target.value }))}
                />
                <Input
                  label="Sous-titre - Direction Générale"
                  value={teamData.management_subtitle}
                  onChange={(e) => setTeamData((p) => ({ ...p, management_subtitle: e.target.value }))}
                />
                <Input
                  label="Titre - Responsables"
                  value={teamData.sector_title}
                  onChange={(e) => setTeamData((p) => ({ ...p, sector_title: e.target.value }))}
                />
                <Input
                  label="Sous-titre - Responsables"
                  value={teamData.sector_subtitle}
                  onChange={(e) => setTeamData((p) => ({ ...p, sector_subtitle: e.target.value }))}
                />
              </div>
            </div>
          ) : isAboutPage ? (
            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[hsla(210,30%,20%,1)]">Notre Histoire</h3>
                <Textarea
                  label="Texte"
                  value={aboutData.history_text}
                  onChange={(e) => setAboutData((p) => ({ ...p, history_text: e.target.value }))}
                  rows={6}
                />
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[hsla(210,30%,20%,1)] ml-1">Image (min 800×600, max 2 Mo)</label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="secondary" onClick={() => historyInputRef.current?.click()}>
                      Choisir l’image
                    </Button>
                    {historyPreview ? (
                      <img src={historyPreview} alt="Aperçu" className="h-16 w-28 rounded-xl object-cover border border-[#E0E6ED]" />
                    ) : null}
                  </div>
                  <input
                    ref={historyInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setHistoryImage(file);
                      setHistoryPreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  {errors.history_image?.[0] ? <p className="text-xs font-medium text-[#D64545] ml-1">{errors.history_image[0]}</p> : null}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[hsla(210,30%,20%,1)]">Notre Vision</h3>
                <Textarea
                  label="Texte"
                  value={aboutData.vision_text}
                  onChange={(e) => setAboutData((p) => ({ ...p, vision_text: e.target.value }))}
                  rows={6}
                />
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[hsla(210,30%,20%,1)] ml-1">Image (min 800×600, max 2 Mo)</label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="secondary" onClick={() => visionInputRef.current?.click()}>
                      Choisir l’image
                    </Button>
                    {visionPreview ? (
                      <img src={visionPreview} alt="Aperçu" className="h-16 w-28 rounded-xl object-cover border border-[#E0E6ED]" />
                    ) : null}
                  </div>
                  <input
                    ref={visionInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setVisionImage(file);
                      setVisionPreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  {errors.vision_image?.[0] ? <p className="text-xs font-medium text-[#D64545] ml-1">{errors.vision_image[0]}</p> : null}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[hsla(210,30%,20%,1)]">Nos Valeurs</h3>
                <div className="space-y-4">
                  {(aboutData.values || []).map((v, idx) => (
                    <div key={idx} className="bg-[hsla(210,25%,98%,1)] border border-[#E0E6ED] rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-sm font-bold text-[#1A3A5C]">Valeur #{idx + 1}</div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeValueItem(idx)} disabled={(aboutData.values || []).length <= 1}>
                          Supprimer
                        </Button>
                      </div>
                      <Input
                        label="Titre"
                        value={v.title || ''}
                        onChange={(e) => updateValueItem(idx, { title: e.target.value })}
                      />
                      <Textarea
                        label="Description"
                        value={v.description || ''}
                        onChange={(e) => updateValueItem(idx, { description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={addValueItem}>
                    Ajouter une valeur
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[hsla(210,30%,20%,1)]">GUITRAIM GROUPE en Chiffres</h3>
                <div className="space-y-4">
                  {(aboutData.stats || []).map((s, idx) => (
                    <div key={idx} className="bg-[hsla(210,25%,98%,1)] border border-[#E0E6ED] rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-sm font-bold text-[#1A3A5C]">Stat #{idx + 1}</div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeStatItem(idx)} disabled={(aboutData.stats || []).length <= 1}>
                          Supprimer
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Valeur (ex: 20+)"
                          value={s.value || ''}
                          onChange={(e) => updateStatItem(idx, { value: e.target.value })}
                        />
                        <Input
                          label="Label"
                          value={s.label || ''}
                          onChange={(e) => updateStatItem(idx, { label: e.target.value })}
                        />
                        <Input
                          label="Sublabel"
                          value={s.sublabel || ''}
                          onChange={(e) => updateStatItem(idx, { sublabel: e.target.value })}
                        />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={addStatItem}>
                    Ajouter un chiffre
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Textarea
              label="Contenu de la Page"
              placeholder="Contenu principal de la page"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              error={errors.content?.[0]}
              rows={12}
            />
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : null}
              Enregistrer les Modifications
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Pages;
