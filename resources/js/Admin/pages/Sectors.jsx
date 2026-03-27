import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import { Input, Textarea } from '../../Components/ui/Input';
import { Card, CardHeader, CardContent } from '../../Components/ui/Card';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const Sectors = () => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
      setFormData({ name: sector.name, description: sector.description || '', icon: sector.icon || '' });
    } else {
      setEditingSector(null);
      setFormData({ name: '', description: '', icon: '' });
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
      if (editingSector) {
        await api.put(`/sectors/${editingSector.id}`, formData);
      } else {
        await api.post('/sectors', formData);
      }
      fetchSectors();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sector?')) return;
    try {
      await api.delete(`/sectors/${id}`);
      fetchSectors();
    } catch (error) {
      console.error('Failed to delete sector');
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
                  <TH>Nom</TH>
                  <TH>Description</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {sectors.map((sector) => (
                  <TR key={sector.id}>
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
                        onClick={() => handleDelete(sector.id)}
                        className="text-[#D64545] hover:bg-[#D64545]/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {sectors.length === 0 && (
                  <TR>
                    <TD colSpan={3} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
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
    </div>
  );
};

export default Sectors;

