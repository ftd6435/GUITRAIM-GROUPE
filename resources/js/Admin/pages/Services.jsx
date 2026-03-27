import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Wrench } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import { Input, Textarea, Select } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const Services = () => {
  const [services, setServices] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ sector_id: '', title: '', description: '', content: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
        content: service.content || ''
      });
    } else {
      setEditingService(null);
      setFormData({ sector_id: sectors[0]?.id || '', title: '', description: '', content: '' });
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete service');
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
                  <TH>Titre</TH>
                  <TH>Secteur</TH>
                  <TH>Description</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {services.map((service) => (
                  <TR key={service.id}>
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
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {services.length === 0 && (
                  <TR>
                    <TD colSpan={4} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
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
          <Textarea
            label="Contenu"
            placeholder="Description complète du service"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            error={errors.content?.[0]}
            rows={6}
          />
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
    </div>
  );
};

export default Services;

