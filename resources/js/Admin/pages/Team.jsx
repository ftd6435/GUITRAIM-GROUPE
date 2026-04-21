import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Loader2, User, Upload, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';
import { Input, Select, Textarea } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';
import { cn } from '../../utils/utils';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectors, setSectors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    is_management: true,
    bio: '',
    avatar: null,
    is_visible: true
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const canDelete = currentUser?.role === 'super_admin';

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await api.get('/team/all');
      setTeam(response.data);
    } catch (error) {
      console.error('Échec de la récupération de l\'équipe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await api.get('/sectors');
        setSectors(response.data || []);
      } catch (e) {
        setSectors([]);
      }
    };
    fetchSectors();
  }, []);

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        position: member.position,
        department: member.department || '',
        is_management: !!member.is_management,
        bio: member.bio || '',
        avatar: null,
        is_visible: !!member.is_visible
      });
      setPreviewUrl(member.avatar ? `/storage/images/avatars/${member.avatar}` : null);
    } else {
      setEditingMember(null);
      setFormData({ name: '', position: '', department: '', is_management: true, bio: '', avatar: null, is_visible: true });
      setPreviewUrl(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const data = new FormData();
    data.append('name', formData.name);
    data.append('position', formData.position);
    data.append('department', formData.department || '');
    data.append('is_management', formData.is_management ? 1 : 0);
    data.append('bio', formData.bio);
    data.append('is_visible', formData.is_visible ? 1 : 0);
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    // Add _method: PUT for Laravel to handle multipart/form-data with PUT
    if (editingMember) {
      data.append('_method', 'PUT');
    }

    try {
      if (editingMember) {
        await api.post(`/team/${editingMember.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/team', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchTeam();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    if (!canDelete) return;
    setMemberToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/team/${memberToDelete}`);
      fetchTeam();
      setIsConfirmOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error('Échec de la suppression du membre');
    } finally {
      setDeleting(false);
    }
  };

  const toggleVisibility = async (member) => {
    try {
      await api.put(`/team/${member.id}`, { is_visible: !member.is_visible });
      fetchTeam();
    } catch (error) {
      console.error('Échec de la mise à jour de la visibilité');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Membres de l'Équipe</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez votre équipe professionnelle</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} />
          Ajouter un Membre
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
                  <TH>Membre</TH>
                  <TH>Catégorie</TH>
                  <TH>Poste</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {team.map((member) => (
                  <TR key={member.id}>
                    <TD>
                      <button
                        onClick={() => toggleVisibility(member)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          member.is_visible
                            ? "text-green-600 bg-green-50 hover:bg-green-100"
                            : "text-[hsla(210,15%,55%,1)] bg-[hsla(210,25%,98%,1)] hover:bg-[hsla(210,25%,94%,1)]"
                        )}
                        title={member.is_visible ? "Visible sur le site" : "Masqué sur le site"}
                      >
                        {member.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[hsla(210,25%,98%,1)] flex items-center justify-center border border-[#E0E6ED] overflow-hidden">
                          {member.avatar ? (
                            <img src={`/storage/images/avatars/${member.avatar}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-[hsla(210,15%,55%,1)]" size={20} />
                          )}
                        </div>
                        <span className="font-semibold text-[hsla(210,30%,20%,1)]">{member.name}</span>
                      </div>
                    </TD>
                    <TD>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold",
                        member.is_management ? "bg-[#E8F5F0] text-[#4CAF8D]" : "bg-[#4A8BC2]/10 text-[#1A3A5C]"
                      )}>
                        {member.is_management ? 'Direction Générale' : 'Responsable Sectoriel'}
                      </span>
                      {!member.is_management && member.department ? (
                        <div className="text-xs font-medium text-[hsla(210,20%,45%,1)] mt-1">
                          {member.department}
                        </div>
                      ) : null}
                    </TD>
                    <TD>{member.position}</TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(member)} className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10">
                        <Pencil size={16} />
                      </Button>
                      {canDelete ? (
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(member.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                          <Trash2 size={16} />
                        </Button>
                      ) : null}
                    </TD>
                  </TR>
                ))}
                {team.length === 0 && (
                  <TR>
                    <TD colSpan={4} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun membre trouvé.
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
        title={editingMember ? 'Modifier le Membre' : 'Ajouter un Membre'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#E0E6ED] flex items-center justify-center overflow-hidden bg-[hsla(210,25%,98%,1)] relative group">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-[hsla(210,15%,55%,1)]" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Upload size={20} />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <p className="text-xs font-medium text-[hsla(210,20%,40%,1)]">Cliquez pour changer l'avatar</p>
            {errors.avatar && <p className="text-xs font-medium text-[#D64545]">{errors.avatar[0]}</p>}
          </div>

          <Input
            label="Nom Complet"
            placeholder="ex: Jean Dupont"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name?.[0]}
            required
          />
          <Input
            label="Poste"
            placeholder="ex: Architecte Senior"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            error={errors.position?.[0]}
            required
          />

          <Select
            label="Catégorie"
            value={formData.is_management ? 'management' : 'sector'}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'management') {
                setFormData((prev) => ({ ...prev, is_management: true, department: '' }));
              } else {
                setFormData((prev) => ({ ...prev, is_management: false }));
              }
            }}
            options={[
              { value: 'management', label: 'Direction Générale' },
              { value: 'sector', label: 'Responsable Sectoriel' },
            ]}
            error={errors.is_management?.[0]}
          />

          {!formData.is_management ? (
            <Select
              label="Département / Secteur"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={[
                { value: '', label: 'Sélectionner un secteur' },
                ...[
                  ...sectors.map((s) => ({ value: s.name, label: s.name })),
                  ...(formData.department && !sectors.some((s) => s.name === formData.department)
                    ? [{ value: formData.department, label: formData.department }]
                    : []),
                ],
              ]}
              error={errors.department?.[0]}
              required
            />
          ) : null}

          <Textarea
            label="Bio"
            placeholder="Courte biographie"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            error={errors.bio?.[0]}
            rows={3}
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
              {editingMember ? 'Mettre à jour le Membre' : 'Créer le Membre'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Supprimer le Membre"
        message="Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ?"
      />
    </div>
  );
};

export default Team;
