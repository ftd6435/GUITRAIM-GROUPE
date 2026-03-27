import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Tag as TagIcon } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import { Input } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Échec de la récupération des étiquettes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleOpenModal = () => {
    setFormData({ name: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await api.post('/tags', formData);
      fetchTags();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette étiquette ?')) return;
    try {
      await api.delete(`/tags/${id}`);
      fetchTags();
    } catch (error) {
      console.error('Échec de la suppression de l\'étiquette');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Étiquettes (Tags)</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez les tags pour le blog et les projets</p>
        </div>
        <Button onClick={handleOpenModal} className="gap-2">
          <Plus size={18} />
          Ajouter un Tag
        </Button>
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
                  <TH>Nom du Tag</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {tags.map((tag) => (
                  <TR key={tag.id}>
                    <TD>
                      <div className="flex items-center gap-2">
                        <TagIcon size={14} className="text-[hsla(210,15%,55%,1)]" />
                        <span className="font-semibold text-[hsla(210,30%,20%,1)]">{tag.name}</span>
                      </div>
                    </TD>
                    <TD className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(tag.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {tags.length === 0 && (
                  <TR>
                    <TD colSpan={2} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun tag trouvé.
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
        title="Ajouter un Nouveau Tag"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom du Tag"
            placeholder="ex: #durable, #moderne"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name?.[0]}
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
              Créer le Tag
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tags;
