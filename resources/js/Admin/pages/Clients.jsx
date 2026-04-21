import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';
import { Input, Select, Textarea } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const canDelete = currentUser?.role === 'super_admin';

  const typeOptions = useMemo(() => ([
    { value: 'individual', label: 'Particulier' },
    { value: 'company', label: 'Entreprise' },
  ]), []);

  const [formData, setFormData] = useState({
    type: 'individual',
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
    phone: '',
    address: '',
    tax_id: '',
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crm/clients');
      setClients(response.data || []);
    } catch (e) {
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        type: client.type || 'individual',
        first_name: client.first_name || '',
        last_name: client.last_name || '',
        company_name: client.company_name || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        tax_id: client.tax_id || '',
      });
    } else {
      setEditingClient(null);
      setFormData({
        type: 'individual',
        first_name: '',
        last_name: '',
        company_name: '',
        email: '',
        phone: '',
        address: '',
        tax_id: '',
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      if (editingClient) {
        await api.put(`/crm/clients/${editingClient.id}`, formData);
      } else {
        await api.post('/crm/clients', formData);
      }
      await fetchClients();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setClientToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/crm/clients/${clientToDelete}`);
      await fetchClients();
      setIsConfirmOpen(false);
      setClientToDelete(null);
    } catch (e) {
    } finally {
      setDeleting(false);
    }
  };

  const getClientLabel = (client) => {
    if (!client) return '';
    if (client.type === 'company') return client.company_name || 'Entreprise';
    const fullName = `${client.first_name || ''} ${client.last_name || ''}`.trim();
    return fullName || 'Client';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Clients</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez vos clients</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 w-full sm:w-auto">
          <Plus size={18} />
          Ajouter un client
        </Button>
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
                  <TH>Type</TH>
                  <TH>Nom</TH>
                  <TH>Contact</TH>
                  <TH>Identifiant</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {clients.map((client) => (
                  <TR key={client.id}>
                    <TD className="font-semibold">
                      {client.type === 'company' ? 'Entreprise' : 'Particulier'}
                    </TD>
                    <TD className="font-semibold text-[hsla(210,30%,20%,1)]">
                      {getClientLabel(client)}
                    </TD>
                    <TD className="text-sm text-[hsla(210,20%,40%,1)]">
                      <div>{client.phone || '—'}</div>
                      <div className="truncate max-w-[280px]">{client.email || '—'}</div>
                    </TD>
                    <TD className="text-sm text-[hsla(210,20%,40%,1)]">
                      {client.tax_id || '—'}
                    </TD>
                    <TD className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(client)}
                        className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10"
                      >
                        <Pencil size={16} />
                      </Button>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(client.id)}
                          className="text-[#D64545] hover:bg-[#D64545]/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </TD>
                  </TR>
                ))}
                {clients.length === 0 && (
                  <TR>
                    <TD colSpan={5} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun client trouvé.
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
        title={editingClient ? 'Modifier le client' : 'Ajouter un client'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Type"
            value={formData.type}
            options={typeOptions}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            error={errors.type?.[0]}
          />

          {formData.type === 'company' ? (
            <Input
              label="Nom de la société"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              error={errors.company_name?.[0]}
              required
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Prénom"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                error={errors.first_name?.[0]}
                required
              />
              <Input
                label="Nom"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                error={errors.last_name?.[0]}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Téléphone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone?.[0]}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email?.[0]}
            />
          </div>

          <Input
            label="Adresse"
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={errors.address?.[0]}
          />

          <Input
            label="Identifiant (NIF/RCCM...)"
            value={formData.tax_id}
            onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
            error={errors.tax_id?.[0]}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <LoadingSpinner size="sm" /> : editingClient ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le client"
        message="Cette action est irréversible. Supprimer ce client ?"
        confirmText={deleting ? 'Suppression...' : 'Supprimer'}
        cancelText="Annuler"
      />
    </div>
  );
};

export default Clients;
