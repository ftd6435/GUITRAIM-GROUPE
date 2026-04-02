import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Loader2, Shield, User as UserIcon, Mail, Upload, Power, PowerOff } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';
import { Input, Select } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';
import { cn } from '../../utils/utils';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToSwitchRole, setUserToSwitchRole] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    current_password: '',
    role: 'editor',
    avatar: null,
    is_active: true
  });
  const [selectedRole, setSelectedRole] = useState('editor');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  // Get current auth user
  const userJson = localStorage.getItem('user');
  const authUser = userJson ? JSON.parse(userJson) : {};
  const isSuperAdmin = authUser.role === 'super_admin';

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
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        current_password: '',
        role: user.role || 'editor',
        avatar: null,
        is_active: !!user.is_active
      });
      setPreviewUrl(user.avatar ? `/storage/images/avatars/${user.avatar}` : null);
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        current_password: '',
        role: 'editor',
        avatar: null,
        is_active: true
      });
      setPreviewUrl(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
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
    data.append('email', formData.email);
    if (formData.password) {
      data.append('password', formData.password);
      data.append('password_confirmation', formData.password_confirmation);
      data.append('current_password', formData.current_password);
    }
    data.append('role', formData.role);
    data.append('is_active', formData.is_active ? 1 : 0);
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    if (editingUser) {
      data.append('_method', 'PUT');
    }

    try {
      if (editingUser) {
        const response = await api.post(`/users/${editingUser.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        const response = await api.post('/users', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      const response = await api.delete(`/users/${userToDelete}`);
      fetchUsers();
      setIsConfirmOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Échec de la suppression de l\'utilisateur');
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (user) => {
    try {
      const response = await api.get(`/users/switch-status/${user.id}`);
      fetchUsers();
    } catch (error) {
      console.error('Échec de la mise à jour du statut');
    }
  };

  const handleRoleClick = (user) => {
    setUserToSwitchRole(user);
    setSelectedRole(user.role || 'editor');
    setIsRoleModalOpen(true);
  };

  const handleRoleConfirm = async (e) => {
    e.preventDefault();
    if (!userToSwitchRole) return;
    setSubmitting(true);
    try {
      const response = await api.post(`/users/switch-role/${userToSwitchRole.id}`, { role: selectedRole });
      fetchUsers();
      setIsRoleModalOpen(false);
      setUserToSwitchRole(null);
    } catch (error) {
      console.error('Échec du changement de rôle');
    } finally {
      setSubmitting(false);
    }
  };

  const isViewOnly = editingUser && !isSuperAdmin && editingUser.id !== authUser.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Utilisateurs Admin</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez les administrateurs système et les permissions</p>
        </div>
        {isSuperAdmin && (
          <Button onClick={() => handleOpenModal()} className="gap-2">
            <Plus size={18} />
            Ajouter un Utilisateur
          </Button>
        )}
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
                  <TH>Statut</TH>
                  <TH>Date d'Inscription</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {users.map((user) => (
                  <TR key={user.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[hsla(210,25%,98%,1)] flex items-center justify-center border border-[#E0E6ED] text-[#1A3A5C] overflow-hidden">
                          {user.avatar ? (
                            <img src={`/storage/images/avatars/${user.avatar}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon size={20} />
                          )}
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
                        {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Administrateur' : user.role === 'editor' ? 'Éditeur' : user.role}
                      </span>
                    </TD>
                    <TD>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </TD>
                    <TD>{new Date(user.created_at).toLocaleDateString()}</TD>
                    <TD className="text-right space-x-2">
                      {isSuperAdmin && authUser.id !== user.id && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRoleClick(user)}
                            className="text-[#1A3A5C] hover:bg-[#1A3A5C]/10"
                            title="Changer le rôle"
                          >
                            <Shield size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStatus(user)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              user.is_active
                                ? "text-green-600 bg-green-50 hover:bg-green-100"
                                : "text-[#D64545] bg-[#FDEAEA] hover:bg-[#FDEAEA]/80"
                            )}
                            title={user.is_active ? "Désactiver le compte" : "Activer le compte"}
                          >
                            {user.is_active ? <Power size={18} /> : <PowerOff size={18} />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(user.id)}
                            className="text-[#D64545] hover:bg-[#D64545]/10"
                            title="Supprimer l'utilisateur"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
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
        title={isViewOnly ? 'Profil de l\'Utilisateur' : editingUser ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#E0E6ED] flex items-center justify-center overflow-hidden bg-[hsla(210,25%,98%,1)] relative group">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={32} className="text-[hsla(210,15%,55%,1)]" />
              )}
              {!isViewOnly && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Upload size={20} />
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            {!isViewOnly && <p className="text-xs font-medium text-[hsla(210,20%,40%,1)]">Cliquez pour changer l'avatar</p>}
            {errors.avatar && <p className="text-xs font-medium text-[#D64545]">{errors.avatar[0]}</p>}
          </div>

          <Input
            label="Nom Complet"
            placeholder="ex: Utilisateur Admin"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name?.[0]}
            required
            disabled={isViewOnly}
          />
          <Input
            label="Adresse Email"
            type="email"
            placeholder="ex: admin@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email?.[0]}
            required
            disabled={isViewOnly}
          />

          {!isViewOnly && (
            <Input
              label={editingUser ? "Nouveau Mot de passe (laisser vide pour conserver)" : "Mot de passe"}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password?.[0]}
              required={!editingUser}
            />
          )}

          {!isViewOnly && formData.password && (
            <div className="space-y-4">
              <Input
                label="Confirmer le nouveau mot de passe"
                type="password"
                value={formData.password_confirmation}
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                error={errors.password_confirmation?.[0]}
                required
              />
            </div>
          )}

          <Select
            label="Rôle"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              ...(isSuperAdmin ? [{ value: 'super_admin', label: 'Super Admin' }] : []),
              { value: 'admin', label: 'Administrateur' },
              { value: 'editor', label: 'Éditeur' }
            ]}
            error={errors.role?.[0]}
            required
            disabled={!isSuperAdmin || isViewOnly}
          />

          {isSuperAdmin && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-[#1A3A5C] rounded border-[#E0E6ED] focus:ring-[#1A3A5C]/20"
                disabled={isViewOnly}
              />
              <label htmlFor="is_active" className="text-sm font-semibold text-[hsla(210,30%,20%,1)] cursor-pointer">
                Compte Actif (accès autorisé)
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              {isViewOnly ? 'Fermer' : 'Annuler'}
            </Button>
            {!isViewOnly && (
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : null}
                {editingUser ? 'Mettre à jour l\'Utilisateur' : 'Créer l\'Utilisateur'}
              </Button>
            )}
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Supprimer l'Utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
      />

      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Changer le rôle de l'utilisateur"
      >
        <form onSubmit={handleRoleConfirm} className="space-y-4">
          <Select
            label="Rôle"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            options={[
              { value: 'super_admin', label: 'Super Admin' },
              { value: 'admin', label: 'Administrateur' },
              { value: 'editor', label: 'Éditeur' }
            ]}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsRoleModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : null}
              Changer le rôle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
