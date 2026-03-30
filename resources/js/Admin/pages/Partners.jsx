import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Loader2, Link as LinkIcon, Upload, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';
import { Input } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';
import { cn } from '../../utils/utils';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({ name: '', logo: null, website_url: '', is_visible: true });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await api.get('/partners');
      setPartners(response.data);
    } catch (error) {
      console.error('Échec de la récupération des partenaires');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleOpenModal = (partner = null) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({ 
        name: partner.name, 
        logo: null, 
        website_url: partner.website_url || '',
        is_visible: !!partner.is_visible
      });
      setPreviewUrl(partner.logo_path || null);
    } else {
      setEditingPartner(null);
      setFormData({ name: '', logo: null, website_url: '', is_visible: true });
      setPreviewUrl(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPartner(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const data = new FormData();
    data.append('name', formData.name);
    data.append('website_url', formData.website_url);
    data.append('is_visible', formData.is_visible ? 1 : 0);
    if (formData.logo) {
      data.append('logo', formData.logo);
    }
    
    if (editingPartner) {
      data.append('_method', 'PUT');
    }

    try {
      if (editingPartner) {
        await api.post(`/partners/${editingPartner.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/partners', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchPartners();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setPartnerToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!partnerToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/partners/${partnerToDelete}`);
      fetchPartners();
      setIsConfirmOpen(false);
      setPartnerToDelete(null);
    } catch (error) {
      console.error('Échec de la suppression du partenaire');
    } finally {
      setDeleting(false);
    }
  };

  const toggleVisibility = async (partner) => {
    try {
      await api.put(`/partners/${partner.id}`, { ...partner, is_visible: !partner.is_visible });
      fetchPartners();
    } catch (error) {
      console.error('Échec de la mise à jour de la visibilité');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Partenaires</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez vos partenariats commerciaux</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} />
          Ajouter un Partenaire
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
                  <TH>Statut</TH>
                  <TH>Partenaire</TH>
                  <TH>Site Web</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {partners.map((partner) => (
                  <TR key={partner.id}>
                    <TD>
                      <button
                        onClick={() => toggleVisibility(partner)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          partner.is_visible 
                            ? "text-green-600 bg-green-50 hover:bg-green-100" 
                            : "text-[hsla(210,15%,55%,1)] bg-[hsla(210,25%,98%,1)] hover:bg-[hsla(210,25%,94%,1)]"
                        )}
                        title={partner.is_visible ? "Visible sur le site" : "Masqué sur le site"}
                      >
                        {partner.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-lg bg-[hsla(210,25%,98%,1)] flex items-center justify-center border border-[#E0E6ED] overflow-hidden p-1">
                          {partner.logo_path ? (
                            <img src={partner.logo_path} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-[10px] font-bold text-[hsla(210,15%,55%,1)]">LOGO</span>
                          )}
                        </div>
                        <span className="font-semibold text-[hsla(210,30%,20%,1)]">{partner.name}</span>
                      </div>
                    </TD>
                    <TD>
                      {partner.website_url ? (
                        <a href={partner.website_url} target="_blank" className="flex items-center gap-1.5 text-[#2B5280] hover:underline">
                          <LinkIcon size={14} />
                          {new URL(partner.website_url).hostname}
                        </a>
                      ) : 'N/A'}
                    </TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(partner)} className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(partner.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {partners.length === 0 && (
                  <TR>
                    <TD colSpan={3} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun partenaire trouvé.
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
        title={editingPartner ? 'Modifier le Partenaire' : 'Ajouter un Partenaire'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-full h-32 rounded-2xl border-2 border-dashed border-[#E0E6ED] flex items-center justify-center overflow-hidden bg-[hsla(210,25%,98%,1)] relative group p-4">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center">
                  <Upload size={32} className="text-[hsla(210,15%,55%,1)] mx-auto mb-2" />
                  <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Logo du partenaire</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2 font-bold"
              >
                <Upload size={20} />
                Changer le logo
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            {errors.logo && <p className="text-xs font-medium text-[#D64545]">{errors.logo[0]}</p>}
          </div>

          <Input
            label="Nom du Partenaire"
            placeholder="ex: Acme Industries"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name?.[0]}
            required
          />
          <Input
            label="URL du Site Web"
            placeholder="ex: https://www.acme.com"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            error={errors.website_url?.[0]}
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
              {editingPartner ? 'Mettre à jour le Partenaire' : 'Créer le Partenaire'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Supprimer le Partenaire"
        message="Êtes-vous sûr de vouloir supprimer ce partenaire ?"
      />
    </div>
  );
};

export default Partners;
