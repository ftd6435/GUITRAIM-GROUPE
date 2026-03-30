import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Wrench, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';
import { Input, Textarea, Select } from '../../Components/ui/Input';
import RichTextEditor from '../../Components/ui/RichTextEditor';
import { Card, CardContent } from '../../Components/ui/Card';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import { cn } from '../../utils/utils';

const Services = () => {
  const [services, setServices] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ 
    sector_id: '', 
    title: '', 
    description: '', 
    content: '',
    is_visible: true 
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, sectorsRes] = await Promise.all([
        api.get('/services'),
        api.get('/sectors')
      ]);
      setServices(servicesRes.data);
      setSectors(sectorsRes.data);
    } catch (error) {
      console.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        sector_id: service.sector_id || '',
        title: service.title,
        description: service.description || '',
        content: service.content || '',
        is_visible: !!service.is_visible
      });
    } else {
      setEditingService(null);
      setFormData({ 
        sector_id: sectors[0]?.id || '', 
        title: '', 
        description: '', 
        content: '',
        is_visible: true 
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, formData);
      } else {
        await api.post('/services', formData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVisibility = async (service) => {
    try {
      await api.put(`/services/${service.id}`, { ...service, is_visible: !service.is_visible });
      fetchData();
    } catch (error) {
      console.error('Échec de la mise à jour de la visibilité');
    }
  };

  const handleDeleteClick = (id) => {
    setServiceToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/services/${serviceToDelete}`);
      fetchData();
      setIsConfirmOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error('Échec de la suppression du service');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Services</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez les services que vous proposez</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} />
          Ajouter un Service
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
                  <TH>Secteur</TH>
                  <TH>Description</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {services.map((service) => (
                  <TR key={service.id}>
                    <TD>
                      <button
                        onClick={() => toggleVisibility(service)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          service.is_visible 
                            ? "text-green-600 bg-green-50 hover:bg-green-100" 
                            : "text-[hsla(210,15%,55%,1)] bg-[hsla(210,25%,98%,1)] hover:bg-[hsla(210,25%,94%,1)]"
                        )}
                        title={service.is_visible ? "Visible sur le site" : "Masqué sur le site"}
                      >
                        {service.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </TD>
                    <TD className="font-semibold text-[hsla(210,30%,20%,1)]">{service.title}</TD>
                    <TD>
                      <span className="px-2 py-1 rounded-full bg-[#4A8BC2]/10 text-[#1A3A5C] text-xs font-bold">
                        {service.sector?.name || 'Pas de Secteur'}
                      </span>
                    </TD>
                    <TD className="max-w-md truncate">{service.description || 'Pas de description'}</TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(service)} className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(service.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {services.length === 0 && (
                  <TR>
                    <TD colSpan={5} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun service trouvé.
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
        title={editingService ? 'Modifier le Service' : 'Ajouter un Nouveau Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Secteur"
            value={formData.sector_id}
            onChange={(e) => setFormData({ ...formData, sector_id: e.target.value })}
            options={sectors.map(s => ({ value: s.id, label: s.name }))}
            error={errors.sector_id?.[0]}
            required
          />
          <Input
            label="Titre du Service"
            placeholder="ex: Développement Web"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title?.[0]}
            required
          />
          <Textarea
            label="Description courte"
            placeholder="Brève description pour les listes"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description?.[0]}
            rows={3}
          />
          <RichTextEditor
            label="Contenu"
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            error={errors.content?.[0]}
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
              {editingService ? 'Mettre à jour le Service' : 'Créer le Service'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Supprimer le Service"
        message="Êtes-vous sûr de vouloir supprimer ce service ?"
      />
    </div>
  );
};

export default Services;

