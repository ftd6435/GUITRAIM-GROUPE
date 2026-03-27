import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Shield, User as UserIcon, Mail } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import { Input, Select } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Échec de la récupération des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role || 'admin' });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Échec de la suppression de l\'utilisateur');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Utilisateurs Admin</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez les administrateurs système et les permissions</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} />
          Ajouter un Utilisateur
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
                  <TH>Utilisateur</TH>
                  <TH>Rôle</TH>
                  <TH>Date d'Inscription</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {users.map((user) => (
                  <TR key={user.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[hsla(210,25%,98%,1)] flex items-center justify-center border border-[#E0E6ED] text-[#1A3A5C]">
                          <UserIcon size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-[hsla(210,30%,20%,1)]">{user.name}</div>
                          <div className="text-xs text-[hsla(210,20%,40%,1)] flex items-center gap-1">
                            <Mail size={10} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] text-xs font-bold w-fit">
                        <Shield size={12} />
                        {user.role === 'admin' ? 'Administrateur' : user.role === 'editor' ? 'Éditeur' : user.role || 'Admin'}
                      </span>
                    </TD>
                    <TD>{new Date(user.created_at).toLocaleDateString()}</TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(user)} className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom Complet"
            placeholder="ex: Utilisateur Admin"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name?.[0]}
            required
          />
          <Input
            label="Adresse Email"
            type="email"
            placeholder="ex: admin@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email?.[0]}
            required
          />
          <Input
            label={editingUser ? "Nouveau Mot de passe (laisser vide pour conserver)" : "Mot de passe"}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password?.[0]}
            required={!editingUser}
          />
          <Select
            label="Rôle"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: 'admin', label: 'Administrateur' },
              { value: 'editor', label: 'Éditeur' }
            ]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : null}
              {editingUser ? 'Mettre à jour l\'Utilisateur' : 'Créer l\'Utilisateur'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
