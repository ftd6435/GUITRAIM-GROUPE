import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';
import { Input, Textarea } from '../../Components/ui/Input';
import { Card, CardHeader, CardContent } from '../../Components/ui/Card';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import { cn } from '../../utils/utils';

const Sectors = () => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [sectorToDelete, setSectorToDelete] = useState(null);
  const [editingSector, setEditingSector] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', highlight_title: '', highlight_items_text: '', icon: '', is_visible: true });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchSectors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/sectors');
      setSectors(response.data);
    } catch (error) {
      console.error('Failed to fetch sectors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  const handleOpenModal = (sector = null) => {
    if (sector) {
      setEditingSector(sector);
      setFormData({ 
        name: sector.name, 
        description: sector.description || '',
        highlight_title: sector.highlight_title || '',
        highlight_items_text: Array.isArray(sector.highlight_items) ? sector.highlight_items.join('\n') : '',
        icon: sector.icon || '',
        is_visible: !!sector.is_visible 
      });
    } else {
      setEditingSector(null);
      setFormData({ name: '', description: '', highlight_title: '', highlight_items_text: '', icon: '', is_visible: true });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSector(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const highlight_items = (formData.highlight_items_text || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        description: formData.description,
        highlight_title: formData.highlight_title || null,
        highlight_items: highlight_items.length ? highlight_items : null,
        icon: formData.icon,
        is_visible: formData.is_visible,
      };

      if (editingSector) {
        await api.put(`/sectors/${editingSector.id}`, payload);
      } else {
        await api.post('/sectors', payload);
      }
      fetchSectors();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVisibility = async (sector) => {
    try {
      await api.put(`/sectors/${sector.id}`, { ...sector, is_visible: !sector.is_visible });
      fetchSectors();
    } catch (error) {
      console.error('Échec de la mise à jour de la visibilité');
    }
  };

  const handleDeleteClick = (id) => {
    setSectorToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sectorToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/sectors/${sectorToDelete}`);
      fetchSectors();
      setIsConfirmOpen(false);
      setSectorToDelete(null);
    } catch (error) {
      console.error('Échec de la suppression du secteur');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Secteurs</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez vos secteurs d'activité</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} />
          Ajouter un Secteur
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
                  <TH>Nom</TH>
                  <TH>Description</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {sectors.map((sector) => (
                  <TR key={sector.id}>
                    <TD>
                      <button
                        onClick={() => toggleVisibility(sector)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          sector.is_visible 
                            ? "text-green-600 bg-green-50 hover:bg-green-100" 
                            : "text-[hsla(210,15%,55%,1)] bg-[hsla(210,25%,98%,1)] hover:bg-[hsla(210,25%,94%,1)]"
                        )}
                        title={sector.is_visible ? "Visible sur le site" : "Masqué sur le site"}
                      >
                        {sector.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </TD>
                    <TD className="font-semibold text-[hsla(210,30%,20%,1)]">{sector.name}</TD>
                    <TD className="max-w-md truncate">{sector.description || 'Pas de description'}</TD>
                    <TD className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(sector)}
                        className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(sector.id)}
                        className="text-[#D64545] hover:bg-[#D64545]/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {sectors.length === 0 && (
                  <TR>
                    <TD colSpan={4} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun secteur trouvé.
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
        title={editingSector ? 'Modifier le Secteur' : 'Ajouter un Nouveau Secteur'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom du Secteur"
            placeholder="ex: Technologie, Santé"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name?.[0]}
            required
          />
          <Textarea
            label="Description"
            placeholder="Brève description du secteur"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description?.[0]}
            rows={4}
          />

          <Input
            label="Titre du bloc (ex: Zones Géographiques Couvertes)"
            placeholder="Titre du bloc d'informations"
            value={formData.highlight_title}
            onChange={(e) => setFormData({ ...formData, highlight_title: e.target.value })}
            error={errors.highlight_title?.[0]}
          />

          <Textarea
            label="Éléments (1 par ligne)"
            placeholder={"Grand Conakry\nKindia\nMamou"}
            value={formData.highlight_items_text}
            onChange={(e) => setFormData({ ...formData, highlight_items_text: e.target.value })}
            error={errors['highlight_items']?.[0] || errors['highlight_items.0']?.[0]}
            rows={5}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
              className="w-4 h-4 text-[#1A3A5C] rounded border-[#E0E6ED] focus:ring-[#1A3A5C]/20"
            />
            <label htmlFor="is_visible" className="text-sm font-semibold text-[hsla(210,30%,20%,1)] cursor-pointer">
              Visible sur le site public
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
              {editingSector ? 'Mettre à jour le Secteur' : 'Créer le Secteur'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Supprimer le Secteur"
        message="Êtes-vous sûr de vouloir supprimer ce secteur ? Cela pourrait affecter les services et projets associés."
      />
    </div>
  );
};

export default Sectors;
