import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Loader2, Eye, Calendar, User, Phone, Briefcase } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import { Card, CardContent } from '../../Components/ui/Card';
import { cn } from '../../utils/utils';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contact');
      setContacts(response.data);
    } catch (error) {
      console.error('Échec de la récupération des messages de contact');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleOpenModal = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    try {
      await api.delete(`/contact/${id}`);
      fetchContacts();
    } catch (error) {
      console.error('Échec de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Messages de Contact</h2>
        <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Consultez et gérez les demandes du formulaire de contact</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-24">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Expéditeur</TH>
                  <TH>Sujet</TH>
                  <TH>Secteur</TH>
                  <TH>Date de Réception</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {contacts.map((contact) => (
                  <TR key={contact.id}>
                    <TD>
                      <div className="font-semibold text-[hsla(210,30%,20%,1)]">{contact.name}</div>
                      <div className="text-xs text-[hsla(210,20%,40%,1)]">{contact.email}</div>
                    </TD>
                    <TD className="max-w-xs truncate">{contact.subject || 'Aucun Sujet'}</TD>
                    <TD>
                      <span className="px-2 py-1 rounded-full bg-[#4A8BC2]/10 text-[#1A3A5C] text-xs font-bold">
                        {contact.sector?.name || 'Demande Générale'}
                      </span>
                    </TD>
                    <TD>{new Date(contact.created_at).toLocaleDateString()}</TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(contact)} className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(contact.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {contacts.length === 0 && (
                  <TR>
                    <TD colSpan={5} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun message dans votre boîte de réception.
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
        title="Détails du Message"
        className="max-w-3xl"
      >
        {selectedContact && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[hsla(210,30%,20%,1)]">{selectedContact.name}</h3>
                    <p className="text-sm font-medium text-[#4A8BC2]">{selectedContact.subject || 'Message de Contact'}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                    <Mail size={16} className="text-[hsla(210,15%,55%,1)]" />
                    {selectedContact.email}
                  </div>
                  {selectedContact.phone && (
                    <div className="flex items-center gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                      <Phone size={16} className="text-[hsla(210,15%,55%,1)]" />
                      {selectedContact.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                    <Calendar size={16} className="text-[hsla(210,15%,55%,1)]" />
                    Reçu le {new Date(selectedContact.created_at).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                    <Briefcase size={16} className="text-[hsla(210,15%,55%,1)]" />
                    Intérêt : {selectedContact.sector?.name || 'Demande Générale'}
                  </div>
                </div>
              </div>

              <div className="bg-[#1A3A5C]/5 p-6 rounded-2xl border border-[#1A3A5C]/10 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A3A5C]">Actions Rapides</h4>
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    className="w-full justify-start gap-3"
                    onClick={() => window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Votre demande'}`}
                  >
                    <Mail size={18} />
                    Répondre par Email
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full justify-start gap-3"
                    onClick={() => handleDelete(selectedContact.id).then(handleCloseModal)}
                  >
                    <Trash2 size={18} className="text-[#D64545]" />
                    Archiver / Supprimer
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Contenu du Message</h4>
              <div className="p-6 bg-[hsla(210,25%,98%,1)] rounded-2xl border border-[#E0E6ED] text-sm text-[hsla(210,30%,20%,1)] leading-relaxed whitespace-pre-wrap">
                {selectedContact.message || 'Aucun message fourni.'}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E0E6ED]">
              <Button variant="secondary" onClick={handleCloseModal}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Contacts;

