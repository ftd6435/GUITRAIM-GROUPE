import React from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight, MessageSquare, Clock } from 'lucide-react';
import Button from '../../Components/ui/Button';
import { Input, Textarea } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';

const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Merci ! Votre message a été envoyé avec succès.');
    setFormData({ name: '', email: '', subject: '', message: '' });
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
                  <p className="text-base font-semibold text-[hsla(210,20%,40%,1)]">
                    Quartier Almamya, Commune de Kaloum, Conakry, Guinée
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center shrink-0 group-hover:bg-[#1A3A5C] group-hover:text-white transition-all duration-300">
                  <Phone size={24} />
                </div>
                <div className="space-y-1 pt-2">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Téléphone</h4>
                  <p className="text-base font-semibold text-[hsla(210,20%,40%,1)]">
                    +224 628 xx xx xx
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center shrink-0 group-hover:bg-[#1A3A5C] group-hover:text-white transition-all duration-300">
                  <Mail size={24} />
                </div>
                <div className="space-y-1 pt-2">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Email</h4>
                  <p className="text-base font-semibold text-[hsla(210,20%,40%,1)]">
                    contact@guitraimgroupe.gn
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center shrink-0 group-hover:bg-[#1A3A5C] group-hover:text-white transition-all duration-300">
                  <Clock size={24} />
                </div>
                <div className="space-y-1 pt-2">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Horaires</h4>
                  <p className="text-base font-semibold text-[hsla(210,20%,40%,1)]">
                    Lun - Ven : 08h00 - 18h00<br />
                    Sam : 09h00 - 13h00
                  </p>
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
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                    <Input
                      label="Adresse Email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <Input
                    label="Sujet"
                    placeholder="objet de votre message"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                  <Textarea
                    label="Message"
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    className="min-h-[200px]"
                  />

                  <div className="pt-4">
                    <Button type="submit" className="h-16 px-12 rounded-[24px] bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold text-lg shadow-xl shadow-[#1A3A5C]/20 gap-3 w-full sm:w-auto">
                      <Send size={20} />
                      Envoyer le Message
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
