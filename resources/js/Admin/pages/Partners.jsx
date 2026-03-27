import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Link as LinkIcon } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import { Input } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({ name: '', logo_path: '', website_url: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
      setFormData({ name: partner.name, logo_path: partner.logo_path || '', website_url: partner.website_url || '' });
    } else {
      setEditingPartner(null);
      setFormData({ name: '', logo_path: '', website_url: '' });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPartner(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      if (editingPartner) {
        await api.put(`/partners/${editingPartner.id}`, formData);
      } else {
        await api.post('/partners', formData);
      }
      fetchPartners();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return;
    try {
      await api.delete(`/partners/${id}`);
      fetchPartners();
    } catch (error) {
      console.error('Échec de la suppression du partenaire');
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
                  <TH>Partenaire</TH>
                  <TH>Site Web</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {partners.map((partner) => (
                  <TR key={partner.id}>
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
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(partner.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
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
    </div>
  );
};

export default Partners;
