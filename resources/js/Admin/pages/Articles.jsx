import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Search, Upload, X, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';
import { Input, Textarea, Select } from '../../Components/ui/Input';
import RichTextEditor from '../../Components/ui/RichTextEditor';
import { Card, CardContent } from '../../Components/ui/Card';
import { cn } from '../../utils/utils';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    summary: '',
    content: '',
    published: true,
    tag_ids: [],
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesRes, categoriesRes, tagsRes] = await Promise.all([
        api.get('/blog'),
        api.get('/categories'),
        api.get('/tags')
      ]);
      setArticles(articlesRes.data);
      setCategories(categoriesRes.data);
      setTags(tagsRes.data);
    } catch (error) {
      console.error('Échec de la récupération des données du blog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (article = null) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        category_id: article.category_id || '',
        title: article.title,
        summary: article.summary || '',
        content: article.content || '',
        published: !!article.published,
        tag_ids: article.tags?.map(t => t.id) || [],
        image: null
      });
      setPreviewUrl(article.image_path || null);
    } else {
      setEditingArticle(null);
      setFormData({
        category_id: categories[0]?.id || '',
        title: '',
        summary: '',
        content: '',
        published: true,
        tag_ids: [],
        image: null
      });
      setPreviewUrl(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category_id', formData.category_id);
    data.append('summary', formData.summary);
    data.append('content', formData.content);
    data.append('published', formData.published ? 1 : 0);

    formData.tag_ids.forEach(id => {
      data.append('tags[]', id);
    });

    if (formData.image) {
      data.append('image', formData.image);
    }

    if (editingArticle) {
      data.append('_method', 'PUT');
    }

    try {
      if (editingArticle) {
        await api.post(`/blog/${editingArticle.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/blog', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setArticleToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/blog/${articleToDelete}`);
      fetchData();
      setIsConfirmOpen(false);
      setArticleToDelete(null);
    } catch (error) {
      console.error('Échec de la suppression de l\'article');
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (article) => {
    try {
      await api.put(`/blog/${article.id}`, { ...article, published: !article.published });
      fetchData();
    } catch (error) {
      console.error('Échec de la mise à jour du statut');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Articles de Blog</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez vos publications de blog</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} />
          Rédiger un Article
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-24">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Statut</TH>
                  <TH>Titre</TH>
                  <TH>Catégorie</TH>
                  <TH>Statut</TH>
                  <TH>Créé le</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {articles.map((article) => (
                  <TR key={article.id}>
                    <TD>
                      <button
                        onClick={() => toggleStatus(article)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          article.published
                            ? "text-green-600 bg-green-50 hover:bg-green-100"
                            : "text-[hsla(210,15%,55%,1)] bg-[hsla(210,25%,98%,1)] hover:bg-[hsla(210,25%,94%,1)]"
                        )}
                        title={article.published ? "Publié" : "Brouillon"}
                      >
                        {article.published ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsla(210,25%,98%,1)] flex items-center justify-center border border-[#E0E6ED] overflow-hidden">
                          {article.image_path ? (
                            <img src={article.image_path} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-[hsla(210,15%,55%,1)]" size={20} />
                          )}
                        </div>
                        <span className="font-semibold text-[hsla(210,30%,20%,1)] max-w-xs truncate">{article.title}</span>
                      </div>
                    </TD>
                    <TD>
                      <span className="px-2 py-1 rounded-full bg-[#4A8BC2]/10 text-[#1A3A5C] text-xs font-bold">
                        {article.category?.name || 'Aucune Catégorie'}
                      </span>
                    </TD>
                    <TD>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold",
                        article.published ? "bg-[#E8F5F0] text-[#4CAF8D]" : "bg-[#FDEAEA] text-[#D64545]"
                      )}>
                        {article.published ? 'Publié' : 'Brouillon'}
                      </span>
                    </TD>
                    <TD>{new Date(article.created_at).toLocaleDateString()}</TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(article)} className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(article.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {articles.length === 0 && (
                  <TR>
                    <TD colSpan={5} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun article trouvé.
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
        title={editingArticle ? 'Modifier l\'Article' : 'Rédiger un Nouvel Article'}
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 py-4 border-b border-[#E0E6ED] mb-6">
            <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-[#E0E6ED] flex items-center justify-center overflow-hidden bg-[hsla(210,25%,98%,1)] relative group">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <ImageIcon size={48} className="text-[hsla(210,15%,55%,1)] mx-auto mb-2" />
                  <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Image mise en avant</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2 font-bold"
              >
                <Upload size={20} />
                Changer l'image
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <p className="text-xs font-medium text-[hsla(210,20%,40%,1)] uppercase tracking-widest">Format recommandé: 16:9 (ex: 1280x720)</p>
            {errors.image && <p className="text-xs font-medium text-[#D64545]">{errors.image[0]}</p>}
          </div>

          <Input
            label="Titre de l'Article"
            placeholder="ex: L'avenir de l'architecture durable"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title?.[0]}
            required
          />

          <Select
            label="Catégorie"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            options={categories.map(c => ({ value: c.id, label: c.name }))}
            error={errors.category_id?.[0]}
            required
          />

          <Textarea
            label="Résumé"
            placeholder="Bref résumé pour les aperçus"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            error={errors.summary?.[0]}
            rows={2}
          />

          <RichTextEditor
            label="Contenu"
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            error={errors.content?.[0]}
          />

          <div>
            <label className="text-sm font-semibold text-[hsla(210,30%,20%,1)] ml-1 block mb-2">
              Étiquettes (Tags)
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-[hsla(210,25%,98%,1)] rounded-xl border border-[#E0E6ED]">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    const ids = formData.tag_ids.includes(tag.id)
                      ? formData.tag_ids.filter(id => id !== tag.id)
                      : [...formData.tag_ids, tag.id];
                    setFormData({ ...formData, tag_ids: ids });
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                    formData.tag_ids.includes(tag.id)
                      ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
                      : "bg-white text-[hsla(210,30%,20%,1)] border-[#E0E6ED] hover:border-[#1A3A5C]"
                  )}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-[#1A3A5C] rounded border-[#E0E6ED] focus:ring-[#1A3A5C]/20"
            />
            <label htmlFor="published" className="text-sm font-semibold text-[hsla(210,30%,20%,1)] cursor-pointer">
              Publier l'article (visible sur le site)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : null}
              {editingArticle ? 'Mettre à jour l\'Article' : 'Publier l\'Article'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Supprimer l'Article"
        message="Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
      />
    </div>
  );
};

export default Articles;

