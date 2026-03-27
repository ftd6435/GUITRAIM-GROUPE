import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Search } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import { Input, Textarea, Select } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';
import { cn } from '../../utils/utils';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    summary: '',
    content: '',
    published: true,
    tag_ids: []
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
        tag_ids: article.tags?.map(t => t.id) || []
      });
    } else {
      setEditingArticle(null);
      setFormData({
        category_id: categories[0]?.id || '',
        title: '',
        summary: '',
        content: '',
        published: true,
        tag_ids: []
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      if (editingArticle) {
        await api.put(`/blog/${editingArticle.id}`, formData);
      } else {
        await api.post('/blog', formData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    try {
      await api.delete(`/blog/${id}`);
      fetchData();
    } catch (error) {
      console.error('Échec de la suppression de l\'article');
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsla(210,25%,98%,1)] flex items-center justify-center border border-[#E0E6ED] overflow-hidden">
                          {article.featured_image ? (
                            <img src={article.featured_image} alt="" className="w-full h-full object-cover" />
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
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(article.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
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

          <Textarea
            label="Contenu"
            placeholder="Contenu de l'article"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            error={errors.content?.[0]}
            rows={10}
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-[#1A3A5C] rounded border-[#E0E6ED] focus:ring-[#1A3A5C]/20"
            />
            <label htmlFor="published" className="text-sm font-semibold text-[hsla(210,30%,20%,1)] cursor-pointer">
              Publier cet article immédiatement
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
    </div>
  );
};

export default Articles;

