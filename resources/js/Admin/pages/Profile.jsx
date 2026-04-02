import React, { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Mail, Upload, Loader2, Shield, Calendar } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Input } from '../../Components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../Components/ui/Card';

const Profile = () => {
  const [searchParams] = useSearchParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(searchParams.get('edit') === 'true');
  }, [searchParams]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    current_password: '',
    avatar: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      setUser(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        password: '',
        password_confirmation: '',
        current_password: '',
        avatar: null
      });
      setPreviewUrl(response.data.avatar ? `/storage/images/avatars/${response.data.avatar}` : null);
    } catch (error) {
      console.error('Échec de la récupération du profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }
    data.append('_method', 'PUT');

    try {
      const response = await api.post(`/users/${user.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update local storage user info
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      setIsEditing(false);
      setFormData({ ...formData, password: '', password_confirmation: '', current_password: '' });
      // Refresh page to update layout
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-[#1A3A5C]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Mon Profil</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez vos informations personnelles et votre sécurité</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Modifier le Profil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[hsla(210,25%,98%,1)] relative group">
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#1A3A5C]">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                )}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Upload size={24} />
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
              <div>
                <h3 className="text-lg font-bold text-[hsla(210,30%,20%,1)]">{user?.name}</h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] text-xs font-bold mt-1">
                  <Shield size={12} />
                  {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Administrateur' : 'Éditeur'}
                </span>
              </div>

              <div className="w-full pt-4 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-[hsla(210,20%,40%,1)]">
                  <Mail size={16} className="text-[#1A3A5C]" />
                  {user?.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-[hsla(210,20%,40%,1)]">
                  <Calendar size={16} className="text-[#1A3A5C]" />
                  Inscrit le {new Date(user?.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{isEditing ? 'Modifier mes informations' : 'Informations personnelles'}</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nom Complet"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name?.[0]}
                  required
                />
                <Input
                  label="Adresse Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email?.[0]}
                  required
                />

                <div className="pt-4 border-t border-[#E0E6ED] mt-6">
                  <h4 className="font-bold text-sm mb-4 text-[#1A3A5C]">Changer le mot de passe</h4>
                  <div className="space-y-4">
                    <Input
                      label="Nouveau Mot de passe"
                      type="password"
                      placeholder="Laisser vide pour conserver l'actuel"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      error={errors.password?.[0]}
                    />

                    {formData.password && (
                      <>
                        <Input
                          label="Confirmer le nouveau mot de passe"
                          type="password"
                          value={formData.password_confirmation}
                          onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                          error={errors.password_confirmation?.[0]}
                          required
                        />
                        <Input
                          label="Ancien Mot de passe"
                          type="password"
                          placeholder="Obligatoire pour changer le mot de passe"
                          value={formData.current_password}
                          onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                          error={errors.current_password?.[0]}
                          required
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="animate-spin mr-2" size={16} />}
                    Enregistrer les modifications
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-wider mb-1">Nom Complet</div>
                    <div className="text-sm font-medium text-[hsla(210,30%,20%,1)]">{user?.name}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-wider mb-1">Adresse Email</div>
                    <div className="text-sm font-medium text-[hsla(210,30%,20%,1)]">{user?.email}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-wider mb-1">Rôle</div>
                    <div className="text-sm font-medium text-[hsla(210,30%,20%,1)]">
                      {user?.role === 'super_admin' ? 'Super Administrateur' : user?.role === 'admin' ? 'Administrateur' : 'Éditeur'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[hsla(210,20%,60%,1)] uppercase tracking-wider mb-1">Statut du compte</div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      Actif
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
