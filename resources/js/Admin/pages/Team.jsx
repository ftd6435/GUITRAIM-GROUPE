import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, User } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import { Input, Textarea } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({ name: '', position: '', bio: '', image_path: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await api.get('/team');
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

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({ name: member.name, position: member.position, bio: member.bio || '', image_path: member.image_path || '' });
    } else {
      setEditingMember(null);
      setFormData({ name: '', position: '', bio: '', image_path: '' });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      if (editingMember) {
        await api.put(`/team/${editingMember.id}`, formData);
      } else {
        await api.post('/team', formData);
      }
      fetchTeam();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce membre de l\'équipe ?')) return;
    try {
      await api.delete(`/team/${id}`);
      fetchTeam();
    } catch (error) {
      console.error('Échec de la suppression du membre');
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
                  <TH>Membre</TH>
                  <TH>Poste</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {team.map((member) => (
                  <TR key={member.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[hsla(210,25%,98%,1)] flex items-center justify-center border border-[#E0E6ED] overflow-hidden">
                          {member.image_path ? (
                            <img src={member.image_path} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-[hsla(210,15%,55%,1)]" size={20} />
                          )}
                        </div>
                        <span className="font-semibold text-[hsla(210,30%,20%,1)]">{member.name}</span>
                      </div>
                    </TD>
                    <TD>{member.position}</TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(member)} className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {team.length === 0 && (
                  <TR>
                    <TD colSpan={3} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
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
          <Textarea
            label="Bio"
            placeholder="Courte biographie"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            error={errors.bio?.[0]}
            rows={3}
          />
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
    </div>
  );
};

export default Team;
