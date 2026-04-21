import React, { useRef, useState, useEffect } from 'react';
import { Save, Loader2, Phone, Mail, MapPin, Clock } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Input, Textarea } from '../../Components/ui/Input';
import { Card, CardHeader, CardContent } from '../../Components/ui/Card';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const Settings = () => {
  const [settings, setSettings] = useState({
    site_name: '',
    logo: '',
    address: '',
    phone: '',
    email: '',
    working_hours: '',
    legal_rccm: '',
    legal_nif: '',
    bank_account_number: '',
    facebook_url: '',
    linkedin_url: '',
    x_url: '',
    instagram_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const logoInputRef = useRef(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/settings');
        const data = response?.data || {};
        setSettings((prev) => ({
          ...prev,
          site_name: data.site_name || '',
          logo: data.logo || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          working_hours: data.working_hours || '',
          legal_rccm: data.legal_rccm || '',
          legal_nif: data.legal_nif || '',
          bank_account_number: data.bank_account_number || '',
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

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    };
  }, [logoPreviewUrl]);

  const handlePickLogo = () => {
    if (logoInputRef.current) logoInputRef.current.click();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const payload =
        logoFile
          ? (() => {
              const data = new FormData();
              data.append('_method', 'PUT');
              data.append('site_name', settings.site_name || '');
              data.append('address', settings.address || '');
              data.append('phone', settings.phone || '');
              data.append('email', settings.email || '');
              data.append('working_hours', settings.working_hours || '');
              data.append('legal_rccm', settings.legal_rccm || '');
              data.append('legal_nif', settings.legal_nif || '');
              data.append('bank_account_number', settings.bank_account_number || '');
              data.append('facebook_url', settings.facebook_url || '');
              data.append('linkedin_url', settings.linkedin_url || '');
              data.append('x_url', settings.x_url || '');
              data.append('instagram_url', settings.instagram_url || '');
              data.append('logo', logoFile);
              return data;
            })()
          : settings;

      const response = logoFile
        ? await api.post('/settings', payload, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await api.put('/settings', payload);

      if (response?.data) {
        setSettings((prev) => ({
          ...prev,
          site_name: response.data.site_name || '',
          logo: response.data.logo || '',
          address: response.data.address || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
          working_hours: response.data.working_hours || '',
          legal_rccm: response.data.legal_rccm || '',
          legal_nif: response.data.legal_nif || '',
          bank_account_number: response.data.bank_account_number || '',
          facebook_url: response.data.facebook_url || '',
          linkedin_url: response.data.linkedin_url || '',
          x_url: response.data.x_url || '',
          instagram_url: response.data.instagram_url || '',
        }));
      }
      if (logoFile) {
        setLogoFile(null);
        if (logoInputRef.current) logoInputRef.current.value = '';
        if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
        setLogoPreviewUrl(null);
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

  const currentLogoUrl = logoPreviewUrl || (settings.logo ? `/storage/images/settings/${settings.logo}` : null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Paramètres</h2>
        <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez la configuration globale et les informations du site</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
        <Card className="col-span-12 lg:col-span-6">
          <CardHeader title="Identité du Site" subtitle="Nom et éléments de marque" />
          <CardContent className="space-y-6">
            <Input
              label="Nom du Site"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              error={errors.site_name?.[0]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[hsla(210,30%,20%,1)]">Logo Sombre</p>
                <div className="aspect-video rounded-xl bg-[hsla(210,25%,98%,1)] border-2 border-dashed border-[#E0E6ED] flex flex-col items-center justify-center p-4 transition-all hover:border-[#1A3A5C]">
                  {currentLogoUrl ? (
                    <img src={currentLogoUrl} alt="Logo" className="h-12 object-contain mb-2" />
                  ) : (
                    <img src="/img/dark_logo.png" alt="Logo" className="h-12 object-contain mb-2" />
                  )}
                  <Button type="button" onClick={handlePickLogo} variant="ghost" size="sm" className="text-xs h-8">
                    Modifier
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[hsla(210,30%,20%,1)]">Logo Blanc</p>
                <div className="aspect-video rounded-xl bg-[#1A3A5C] border-2 border-dashed border-[#1A3A5C]/20 flex flex-col items-center justify-center p-4 transition-all hover:border-white/40">
                  {currentLogoUrl ? (
                    <img src={currentLogoUrl} alt="Logo" className="h-12 object-contain mb-2" />
                  ) : (
                    <img src="/img/white_logo.png" alt="Logo" className="h-12 object-contain mb-2" />
                  )}
                  <Button
                    type="button"
                    onClick={handlePickLogo}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            </div>
            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            {errors.logo?.[0] ? <p className="text-sm font-medium text-[#D64545]">{errors.logo?.[0]}</p> : null}
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-6">
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

        <Card className="col-span-12 lg:col-span-6">
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

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader title="Informations Légales" subtitle="Informations RCCM, NIF et compte bancaire" />
          <CardContent className="flex flex-col gap-4">
            <Input
              label="RCCM"
              value={settings.legal_rccm}
              onChange={(e) => setSettings({ ...settings, legal_rccm: e.target.value })}
              error={errors.legal_rccm?.[0]}
            />
            <Input
              label="NIF"
              value={settings.legal_nif}
              onChange={(e) => setSettings({ ...settings, legal_nif: e.target.value })}
              error={errors.legal_nif?.[0]}
            />
            <Input
              label="Compte Bancaire"
              value={settings.bank_account_number}
              onChange={(e) => setSettings({ ...settings, bank_account_number: e.target.value })}
              error={errors.bank_account_number?.[0]}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end col-span-12">
          <Button type="submit" disabled={submitting} className="gap-2">
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Enregistrer les Paramètres
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
