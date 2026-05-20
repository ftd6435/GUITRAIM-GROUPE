import React, { useState, useEffect } from 'react';
import { Download, Trash2, Loader2, Mail, Phone, Calendar, User, Eye } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';
import { Card, CardContent } from '../../Components/ui/Card';
import { cn } from '../../utils/utils';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications');
      setApplications(response.data || []);
    } catch (error) {
      console.error('Échec de la récupération des candidatures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleOpenModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
  };

  const handleStatusChange = async (id, status) => {
    setUpdating(true);
    try {
      await api.put(`/applications/${id}`, { status });
      fetchApps();
      if (selectedApp) setSelectedApp({ ...selectedApp, status });
    } catch (error) {
      console.error('Échec de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (id) => {
    setApplicationToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!applicationToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/applications/${applicationToDelete}`);
      setIsConfirmOpen(false);
      setApplicationToDelete(null);
      fetchApps();
      if (selectedApp?.id === applicationToDelete) {
        handleCloseModal();
      }
    } catch (error) {
      console.error('Échec de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  const statusColors = {
    new: "bg-blue-100 text-blue-700",
    reviewed: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  };

  const statusLabels = {
    new: "Nouveau",
    reviewed: "Révisé",
    accepted: "Accepté",
    rejected: "Refusé"
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Candidatures</h2>
        <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Consultez les candidats et gérez le processus de recrutement</p>
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
                  <TH>Candidat</TH>
                  <TH>Poste</TH>
                  <TH>Date de Candidature</TH>
                  <TH>Statut</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {applications.map((app) => (
                  <TR key={app.id}>
                    <TD>
                      <div className="font-semibold text-[hsla(210,30%,20%,1)]">{app.full_name || `${app.first_name || ''} ${app.last_name || ''}`.trim()}</div>
                      <div className="text-xs text-[hsla(210,20%,40%,1)]">{app.email}</div>
                    </TD>
                    <TD>{app.job?.title || 'Candidature spontanée'}</TD>
                    <TD>{new Date(app.created_at).toLocaleDateString()}</TD>
                    <TD>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold",
                        statusColors[app.status] || "bg-gray-100 text-gray-700"
                      )}>
                        {statusLabels[app.status] || app.status}
                      </span>
                    </TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(app)} className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(app.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {applications.length === 0 && (
                  <TR>
                    <TD colSpan={5} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucune candidature reçue pour le moment.
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
        title="Détails de la Candidature"
        className="max-w-3xl"
      >
        {selectedApp && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[hsla(210,30%,20%,1)]">{selectedApp.full_name || `${selectedApp.first_name || ''} ${selectedApp.last_name || ''}`.trim()}</h3>
                    <p className="text-sm font-medium text-[#4A8BC2]">{selectedApp.job?.title || 'Candidature spontanée'}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                    <Mail size={16} className="text-[hsla(210,15%,55%,1)]" />
                    {selectedApp.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                    <Phone size={16} className="text-[hsla(210,15%,55%,1)]" />
                    {selectedApp.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-[hsla(210,20%,40%,1)]">
                    <Calendar size={16} className="text-[hsla(210,15%,55%,1)]" />
                    Postulé le {new Date(selectedApp.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-[hsla(210,25%,98%,1)] p-6 rounded-2xl border border-[#E0E6ED] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[hsla(210,15%,55%,1)]">Mettre à jour le statut</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(statusLabels).map(status => (
                    <button
                      key={status}
                      disabled={updating}
                      onClick={() => handleStatusChange(selectedApp.id, status)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                        selectedApp.status === status
                          ? statusColors[status] + " border-current"
                          : "bg-white text-[hsla(210,20%,40%,1)] border-[#E0E6ED] hover:border-[#1A3A5C]"
                      )}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
                <div className="pt-4 space-y-2">
                  {selectedApp.cv_path ? (
                    <Button
                      variant="primary"
                      className="w-full gap-2"
                      onClick={() => window.open(selectedApp.cv_path, '_blank')}
                    >
                      <Download size={18} />
                      Télécharger CV
                    </Button>
                  ) : null}
                  {selectedApp.cover_letter_path ? (
                    <Button
                      variant="secondary"
                      className="w-full gap-2"
                      onClick={() => window.open(selectedApp.cover_letter_path, '_blank')}
                    >
                      <Download size={18} />
                      Télécharger Lettre
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Message</h4>
              <div className="p-6 bg-[hsla(210,25%,98%,1)] rounded-2xl border border-[#E0E6ED] text-sm text-[hsla(210,30%,20%,1)] leading-relaxed whitespace-pre-wrap">
                {selectedApp.message || 'Aucun message fourni.'}
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

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la candidature"
        message="Cette action est irréversible. Supprimer cette candidature ?"
        confirmText={deleting ? 'Suppression...' : 'Supprimer'}
        cancelText="Annuler"
        loading={deleting}
      />
    </div>
  );
};

export default Applications;
