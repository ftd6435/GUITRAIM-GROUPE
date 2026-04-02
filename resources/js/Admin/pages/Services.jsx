import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, X } from 'lucide-react';
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
    is_visible: true,
    image: null,
    images: []
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clientErrors, setClientErrors] = useState({});
  const [mainPreview, setMainPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const MB_2 = 2 * 1024 * 1024;

  const readImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ width: 0, height: 0 });
      };
      img.src = url;
    });
  };

  const handleMainImageChange = async (file) => {
    if (!file) {
      setFormData(prev => ({ ...prev, image: null }));
      setMainPreview(null);
      setClientErrors(prev => ({ ...prev, image: undefined }));
      return;
    }
    if (file.size > MB_2) {
      setClientErrors(prev => ({ ...prev, image: 'L’image dépasse 2 Mo.' }));
      setFormData(prev => ({ ...prev, image: null }));
      setMainPreview(null);
      return;
    }
    const { width, height } = await readImageDimensions(file);
    if (width < 800 || height < 600) {
      setClientErrors(prev => ({ ...prev, image: 'Dimensions minimales requises: 800×600 px.' }));
      setFormData(prev => ({ ...prev, image: null }));
      setMainPreview(null);
      return;
    }
    setClientErrors(prev => ({ ...prev, image: undefined }));
    setFormData(prev => ({ ...prev, image: file }));
    setMainPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleGalleryChange = async (files) => {
    const selected = Array.from(files || []).slice(0, 4);
    const validFiles = [];
    const previews = [];
    let galleryError;
    for (const f of selected) {
      if (f.size > MB_2) {
        galleryError = 'Chaque image doit être ≤ 2 Mo.';
        continue;
      }
      const { width, height } = await readImageDimensions(f);
      if (width < 600 || height < 600) {
        galleryError = 'Chaque image doit faire au moins 600×600 px.';
        continue;
      }
      validFiles.push(f);
      previews.push(URL.createObjectURL(f));
    }
    setFormData(prev => ({ ...prev, images: validFiles.slice(0, 4) }));
    setGalleryPreviews((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return previews.slice(0, 4);
    });
    setClientErrors(prev => ({ ...prev, images: galleryError }));
  };

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
        is_visible: !!service.is_visible,
        image: null,
        images: []
      });
      setMainPreview(null);
      setGalleryPreviews([]);
      setClientErrors({});
    } else {
      setEditingService(null);
      setFormData({
        sector_id: sectors[0]?.id || '',
        title: '',
        description: '',
        content: '',
        is_visible: true,
        image: null,
        images: []
      });
      setMainPreview(null);
      setGalleryPreviews([]);
      setClientErrors({});
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setErrors({});
    setClientErrors({});
    setGalleryPreviews((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return [];
    });
    setMainPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    if (clientErrors.image || clientErrors.images) {
      window.dispatchEvent(
        new CustomEvent('app-toast', {
          detail: { type: 'error', message: 'Veuillez corriger les erreurs des images avant de soumettre.' },
        })
      );
      setSubmitting(false);
      return;
    }
    try {
      const data = new FormData();
      data.append('sector_id', formData.sector_id);
      data.append('title', formData.title || '');
      data.append('description', formData.description || '');
      data.append('content', formData.content || '');
      data.append('is_visible', formData.is_visible ? 1 : 0);
      if (formData.image) data.append('image', formData.image);
      (formData.images || []).forEach((file, idx) => {
        if (file) data.append(`images[${idx}]`, file);
      });

      if (editingService) {
        data.append('_method', 'PUT');
        await api.post(`/services/${editingService.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/services', data, {
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[hsla(210,30%,20%,1)]">Image Principale (max 2 Mo, 1200x800 recommandé)</label>
              <div className="border border-[#E0E6ED] rounded-xl p-4 bg-[hsla(210,25%,98%,1)]">
                <div className="flex items-center gap-4">
                  <label className="px-3 py-2 rounded-lg border border-[#E0E6ED] bg-white text-sm font-semibold cursor-pointer hover:border-[#1A3A5C]">
                    Choisir une image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleMainImageChange(e.target.files?.[0])}
                    />
                  </label>
                  <span className="text-xs text-[hsla(210,20%,50%,1)]">≥ 800×600 px, ≤ 2 Mo</span>
                  {mainPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setMainPreview((prev) => {
                          if (prev) URL.revokeObjectURL(prev);
                          return null;
                        });
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="ml-auto text-[hsla(210,20%,50%,1)] hover:text-[#1A3A5C]"
                      title="Retirer"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="mt-3">
                  {mainPreview ? (
                    <img src={mainPreview} alt="Aperçu" className="w-full max-h-48 object-cover rounded-lg border border-[#E0E6ED]" />
                  ) : editingService?.image_path ? (
                    <img src={editingService.image_path} alt="Aperçu" className="w-full max-h-48 object-cover rounded-lg border border-[#E0E6ED]" />
                  ) : null}
                </div>
              </div>
              {(clientErrors.image || errors.image?.[0]) && (
                <p className="text-xs font-medium text-[#D64545]">
                  {clientErrors.image || errors.image?.[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[hsla(210,30%,20%,1)]">Galerie (jusqu'à 4 images, max 2 Mo chacune, 800x1000/ carré)</label>
              <div className="border border-[#E0E6ED] rounded-xl p-4 bg-[hsla(210,25%,98%,1)]">
                <label className="inline-block px-3 py-2 rounded-lg border border-[#E0E6ED] bg-white text-sm font-semibold cursor-pointer hover:border-[#1A3A5C]">
                  Choisir des images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => { await handleGalleryChange(e.target.files); }}
                  />
                </label>
                <span className="ml-3 text-xs text-[hsla(210,20%,50%,1)]">Jusqu’à 4 images, ≥ 600×600 px chacune, ≤ 2 Mo</span>
                {galleryPreviews.length > 0 ? (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {galleryPreviews.map((src, idx) => (
                      <div key={idx} className="relative">
                        <img src={src} alt={"Aperçu " + (idx + 1)} className="w-full h-24 object-cover rounded-lg border border-[#E0E6ED]" />
                      </div>
                    ))}
                  </div>
                ) : (editingService?.images || []).length ? (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {editingService.images.slice(0, 4).map((img, idx) => (
                      <div key={img.id || idx} className="relative">
                        <img src={img.image_path} alt={"Image " + (idx + 1)} className="w-full h-24 object-cover rounded-lg border border-[#E0E6ED]" />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              {(clientErrors.images || errors['images']?.[0] || errors['images.*']?.[0]) && (
                <p className="text-xs font-medium text-[#D64545]">
                  {clientErrors.images || errors['images']?.[0] || errors['images.*']?.[0]}
                </p>
              )}
            </div>
          </div>

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
