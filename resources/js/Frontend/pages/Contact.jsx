import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight, Clock, Loader2 } from 'lucide-react';
import Button from '../../Components/ui/Button';
import { Input, Textarea } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';
import api from '../../utils/api';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    project_type: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);
        const response = await api.get('/settings');
        setSettings(response.data || null);
      } catch (e) {
        setSettings(null);
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const contactInfo = useMemo(() => {
    return {
      address: settings?.address || 'Quartier Almamya, Commune de Kaloum, Conakry, Guinée',
      phone: settings?.phone || '+224 628 xx xx xx',
      email: settings?.email || 'contact@guitraimgroupe.gn',
      working_hours: settings?.working_hours || 'Lun - Ven : 08h00 - 18h00\nSam : 09h00 - 13h00',
    };
  }, [settings]);

  const showToast = (type, message) => {
    window.dispatchEvent(
      new CustomEvent('app-toast', {
        detail: { type, message },
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await api.post('/contact', formData);
      showToast('success', 'Merci ! Votre message a été envoyé avec succès.');
      setFormData({ full_name: '', email: '', phone: '', project_type: '', message: '' });
    } catch (error) {
      if (error?.errors) {
        setErrors(error.errors);
        showToast('error', error.message || 'Veuillez corriger les erreurs du formulaire.');
      } else {
        showToast('error', 'Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Header Section */}
      <section className="relative h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?q=80&w=2000&auto=format&fit=crop"
            alt="Contactez-nous"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1A3A5C]/80 backdrop-blur-sm" />
        </div>
        <div className="container relative z-10 px-4 lg:px-8 text-center space-y-4">
          <div className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center justify-center gap-2">
            Accueil <ArrowRight size={14} /> Contact
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white">Contactez-Nous</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto font-medium">
            Nous sommes à votre écoute pour tous vos projets et questions
          </p>
        </div>
      </section>

      <section className="container px-4 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info Side */}
          <div className="lg:col-span-1 space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#1A3A5C]">Restons en Contact</h2>
              <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
                Vous avez un projet en tête ou besoin d'informations complémentaires ? Notre équipe est prête à vous répondre.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center shrink-0 group-hover:bg-[#1A3A5C] group-hover:text-white transition-all duration-300">
                  <MapPin size={24} />
                </div>
                <div className="space-y-1 pt-2">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Notre Bureau</h4>
                  <p className="text-base font-semibold text-[hsla(210,20%,40%,1)]">{contactInfo.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center shrink-0 group-hover:bg-[#1A3A5C] group-hover:text-white transition-all duration-300">
                  <Phone size={24} />
                </div>
                <div className="space-y-1 pt-2">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Téléphone</h4>
                  <p className="text-base font-semibold text-[hsla(210,20%,40%,1)]">{contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center shrink-0 group-hover:bg-[#1A3A5C] group-hover:text-white transition-all duration-300">
                  <Mail size={24} />
                </div>
                <div className="space-y-1 pt-2">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Email</h4>
                  <p className="text-base font-semibold text-[hsla(210,20%,40%,1)]">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center shrink-0 group-hover:bg-[#1A3A5C] group-hover:text-white transition-all duration-300">
                  <Clock size={24} />
                </div>
                <div className="space-y-1 pt-2">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Horaires</h4>
                  {settingsLoading ? (
                    <div className="flex items-center gap-2 text-sm font-bold text-[hsla(210,20%,50%,1)]">
                      <Loader2 size={16} className="animate-spin" />
                      Chargement...
                    </div>
                  ) : (
                    <p className="text-base font-semibold text-[hsla(210,20%,40%,1)] whitespace-pre-line">
                      {contactInfo.working_hours}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <Card className="rounded-[48px] border-[#E0E6ED] shadow-2xl p-8 lg:p-12">
              <CardContent className="p-0 space-y-10">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A3A5C]">Envoyez-nous un Message</h3>
                  <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nom Complet"
                      placeholder="votre nom"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                      error={errors?.full_name?.[0]}
                    />
                    <Input
                      label="Adresse Email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      error={errors?.email?.[0]}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Téléphone (optionnel)"
                      placeholder="+224 ..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      error={errors?.phone?.[0]}
                    />
                    <Input
                      label="Type de projet (optionnel)"
                      placeholder="ex: Construction, Immobilier..."
                      value={formData.project_type}
                      onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                      error={errors?.project_type?.[0]}
                    />
                  </div>
                  <Textarea
                    label="Message"
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="min-h-[200px]"
                    error={errors?.message?.[0]}
                  />

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="h-16 px-12 rounded-[24px] bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold text-lg shadow-xl shadow-[#1A3A5C]/20 gap-3 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                      {submitting ? 'Envoi...' : 'Envoyer le Message'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="container px-4 lg:px-8 pt-12">
        <div className="w-full h-[500px] bg-[hsla(210,25%,98%,1)] rounded-[48px] border border-[#E0E6ED] flex items-center justify-center text-[hsla(210,20%,60%,1)] relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000&auto=format&fit=crop" alt="Map" className="w-full h-full object-cover opacity-20 grayscale" />
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-[#4A8BC2] animate-bounce">
              <MapPin size={32} fill="currentColor" />
            </div>
            <p className="text-xl font-bold text-[#1A3A5C]">Conakry, Guinée</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
