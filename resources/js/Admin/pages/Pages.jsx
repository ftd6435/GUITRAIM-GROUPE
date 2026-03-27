import React, { useState, useEffect } from 'react';
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
  const [formData, setFormData] = useState({ title: '', content: '', meta_description: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pages/all'); // Assuming there's a route for all pages
      setPages(response.data);
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
      meta_description: page.meta_description || ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await api.put(`/pages/${editingPage.slug}`, formData);
      fetchPages();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
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
          <Textarea
            label="Meta Description (SEO)"
            placeholder="Description pour les moteurs de recherche"
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            error={errors.meta_description?.[0]}
            rows={2}
          />
          <Textarea
            label="Contenu de la Page"
            placeholder="Contenu principal de la page"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            error={errors.content?.[0]}
            rows={12}
            required
          />
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
