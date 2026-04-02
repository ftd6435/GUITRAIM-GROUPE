import React, { useState, useEffect } from 'react';
import { Save, Loader2, Phone, Mail, MapPin, Clock } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Input, Textarea } from '../../Components/ui/Input';
import { Card, CardHeader, CardContent, CardFooter } from '../../Components/ui/Card';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const Settings = () => {
  const [settings, setSettings] = useState({
    site_name: '',
    address: '',
    phone: '',
    email: '',
    working_hours: '',
    facebook_url: '',
    linkedin_url: '',
    x_url: '',
    instagram_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/settings');
        const data = response?.data || {};
        setSettings((prev) => ({
          ...prev,
          site_name: data.site_name || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          working_hours: data.working_hours || '',
          facebook_url: data.facebook_url || '',
          linkedin_url: data.linkedin_url || '',
          x_url: data.x_url || '',
          instagram_url: data.instagram_url || '',
        }));
      } catch (error) {
        console.error('Échec de la récupération des paramètres');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const response = await api.put('/settings', settings);
      if (response?.data) {
        setSettings((prev) => ({
          ...prev,
          site_name: response.data.site_name || '',
          address: response.data.address || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
          working_hours: response.data.working_hours || '',
          facebook_url: response.data.facebook_url || '',
          linkedin_url: response.data.linkedin_url || '',
          x_url: response.data.x_url || '',
          instagram_url: response.data.instagram_url || '',
        }));
      }
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Paramètres</h2>
        <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez la configuration globale et les informations du site</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Site Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Informations du Site" subtitle="Identité de base de votre site web" />
            <CardContent className="space-y-4">
              <Input
                label="Nom du Site"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                error={errors.site_name?.[0]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Logo & Favicon" subtitle="Téléchargez vos éléments de marque" />
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[hsla(210,30%,20%,1)]">Logo Sombre</p>
                  <div className="aspect-video rounded-xl bg-[hsla(210,25%,98%,1)] border-2 border-dashed border-[#E0E6ED] flex flex-col items-center justify-center p-4 transition-all hover:border-[#1A3A5C]">
                    <img src="/img/dark_logo.png" alt="Logo Sombre" className="h-12 object-contain mb-2" />
                    <Button variant="ghost" size="sm" className="text-xs h-8">Modifier</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[hsla(210,30%,20%,1)]">Logo Blanc</p>
                  <div className="aspect-video rounded-xl bg-[#1A3A5C] border-2 border-dashed border-[#1A3A5C]/20 flex flex-col items-center justify-center p-4 transition-all hover:border-white/40">
                    <img src="/img/white_logo.png" alt="Logo Blanc" className="h-12 object-contain mb-2" />
                    <Button variant="ghost" size="sm" className="text-xs h-8 text-white/80 hover:bg-white/10 hover:text-white">Modifier</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact & Social */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Informations de Contact" subtitle="Comment les visiteurs peuvent vous joindre" />
            <CardContent className="space-y-4">
              <Input
                label="Email de Contact"
                type="email"
                icon={Mail}
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                error={errors.email?.[0]}
              />
              <Input
                label="Numéro de Téléphone"
                icon={Phone}
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                error={errors.phone?.[0]}
              />
              <Textarea
                label="Adresse du Bureau"
                icon={MapPin}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                error={errors.address?.[0]}
                rows={2}
              />
              <Textarea
                label="Horaires"
                icon={Clock}
                value={settings.working_hours}
                onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                error={errors.working_hours?.[0]}
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Réseaux Sociaux" subtitle="Liens de vos profils sociaux" />
            <CardContent className="space-y-4">
              <Input
                label="Facebook"
                placeholder="https://facebook.com/..."
                value={settings.facebook_url}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                error={errors.facebook_url?.[0]}
              />
              <Input
                label="LinkedIn"
                placeholder="https://linkedin.com/..."
                value={settings.linkedin_url}
                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                error={errors.linkedin_url?.[0]}
              />
              <Input
                label="X"
                placeholder="https://x.com/..."
                value={settings.x_url}
                onChange={(e) => setSettings({ ...settings, x_url: e.target.value })}
                error={errors.x_url?.[0]}
              />
              <Input
                label="Instagram"
                placeholder="https://instagram.com/..."
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                error={errors.instagram_url?.[0]}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Enregistrer les Paramètres
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
