import React, { useEffect, useMemo, useState } from 'react';
import { Download, Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';
import { Input, Select, Textarea } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import { cn } from '../../utils/utils';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [editingQuoteId, setEditingQuoteId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const canDelete = currentUser?.role === 'super_admin';

  const [formData, setFormData] = useState({
    client_id: '',
    sector_id: '',
    status: 'draft',
    issue_date: '',
    valid_until: '',
    notes: '',
    items: [{ description: '', quantity: 1, unit: '', unit_price: 0 }],
  });

  const statusOptions = useMemo(() => ([
    { value: 'draft', label: 'Brouillon' },
    { value: 'sent', label: 'Envoyé' },
    { value: 'accepted', label: 'Accepté' },
    { value: 'rejected', label: 'Rejeté' },
  ]), []);

  const sectorOptions = useMemo(() => (
    (sectors || []).map((s) => ({ value: String(s.id), label: s.name }))
  ), [sectors]);

  const clientOptions = useMemo(() => (
    (clients || []).map((c) => ({
      value: String(c.id),
      label: c.type === 'company'
        ? (c.company_name || 'Entreprise')
        : `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Client',
    }))
  ), [clients]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crm/quotes');
      setQuotes(response.data || []);
    } catch (e) {
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [clientsRes, sectorsRes] = await Promise.all([
        api.get('/crm/clients'),
        api.get('/sectors'),
      ]);
      setClients(clientsRes.data || []);
      setSectors(sectorsRes.data || []);
    } catch (e) {
      setClients([]);
      setSectors([]);
    }
  };

  useEffect(() => {
    fetchMeta();
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    if (!formData.client_id && clients[0]?.id) {
      setFormData((p) => ({ ...p, client_id: String(clients[0].id) }));
    }
    if (!formData.sector_id && sectors[0]?.id) {
      setFormData((p) => ({ ...p, sector_id: String(sectors[0].id) }));
    }
    if (!formData.issue_date) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setFormData((p) => ({ ...p, issue_date: `${yyyy}-${mm}-${dd}` }));
    }
  }, [isModalOpen, clients, sectors]);

  const handleOpenModal = async (quote = null) => {
    setErrors({});
    if (!quote) {
      setEditingQuoteId(null);
      setFormData({
        client_id: String(clients[0]?.id || ''),
        sector_id: String(sectors[0]?.id || ''),
        status: 'draft',
        issue_date: '',
        valid_until: '',
        notes: '',
        items: [{ description: '', quantity: 1, unit: '', unit_price: 0 }],
      });
      setIsModalOpen(true);
      return;
    }

    setEditingQuoteId(quote.id);
    setIsModalOpen(true);
    setLoadingQuote(true);
    try {
      const full = await api.get(`/crm/quotes/${quote.id}`);
      const q = full.data;
      setFormData({
        client_id: String(q.client_id || q.client?.id || ''),
        sector_id: String(q.sector_id || q.sector?.id || ''),
        status: q.status || 'draft',
        issue_date: q.issue_date || '',
        valid_until: q.valid_until || '',
        notes: q.notes || '',
        items: (q.items || []).length
          ? (q.items || []).map((it) => ({
              description: it.description || '',
              quantity: Number(it.quantity || 1),
              unit: it.unit || '',
              unit_price: Number(it.unit_price || 0),
            }))
          : [{ description: '', quantity: 1, unit: '', unit_price: 0 }],
      });
    } catch (e) {
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuoteId(null);
  };

  const itemsSubtotal = useMemo(() => {
    return (formData.items || []).reduce((sum, it) => {
      const qty = Number(it.quantity || 0);
      const pu = Number(it.unit_price || 0);
      return sum + qty * pu;
    }, 0);
  }, [formData.items]);

  const handleItemChange = (index, patch) => {
    setFormData((prev) => {
      const nextItems = [...(prev.items || [])];
      nextItems[index] = { ...nextItems[index], ...patch };
      return { ...prev, items: nextItems };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), { description: '', quantity: 1, unit: '', unit_price: 0 }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => {
      const next = [...(prev.items || [])].filter((_, i) => i !== index);
      return { ...prev, items: next.length ? next : [{ description: '', quantity: 1, unit: '', unit_price: 0 }] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const payload = {
        client_id: Number(formData.client_id),
        sector_id: Number(formData.sector_id),
        status: formData.status,
        issue_date: formData.issue_date,
        valid_until: formData.valid_until || null,
        notes: formData.notes || null,
        items: (formData.items || []).map((it) => ({
          description: it.description,
          quantity: Number(it.quantity),
          unit: it.unit || null,
          unit_price: Number(it.unit_price),
        })),
      };

      if (editingQuoteId) {
        await api.put(`/crm/quotes/${editingQuoteId}`, payload);
      } else {
        await api.post('/crm/quotes', payload);
      }

      await fetchQuotes();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setQuoteToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!quoteToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/crm/quotes/${quoteToDelete}`);
      await fetchQuotes();
      setIsConfirmOpen(false);
      setQuoteToDelete(null);
    } catch (e) {
    } finally {
      setDeleting(false);
    }
  };

  const downloadPdf = async (quoteId, quoteNumber) => {
    try {
      const blob = await api.get(`/crm/quotes/${quoteId}/pdf`, { responseType: 'blob' });
      if (!(blob instanceof Blob)) {
        throw new Error('Téléchargement impossible: réponse invalide.');
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${quoteNumber || 'devis'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      let message =
        e?.original?.response?.data?.message ||
        e?.message ||
        'Téléchargement impossible. Veuillez réessayer.';

      const maybeBlob = e?.original?.response?.data;
      if (maybeBlob instanceof Blob) {
        try {
          const text = await maybeBlob.text();
          const parsed = JSON.parse(text);
          if (parsed?.message) message = parsed.message;
        } catch {
        }
      }

      window.dispatchEvent(
        new CustomEvent('app-toast', {
          detail: { type: 'error', message },
        })
      );
    }
  };

  const formatMoney = (amount) => {
    try {
      return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Number(amount || 0));
    } catch (e) {
      return String(amount || 0);
    }
  };

  const formatDateFr = (value) => {
    if (!value) return '—';
    const d = (() => {
      if (value instanceof Date) return value;
      if (typeof value === 'number') return new Date(value);
      if (typeof value === 'string') {
        const s = value.trim();
        const fr = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (fr) return new Date(`${fr[3]}-${fr[2]}-${fr[1]}T00:00:00`);
        const sql = s.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})$/);
        if (sql) return new Date(`${sql[1]}T${sql[2]}`);
        return new Date(s);
      }
      return new Date(NaN);
    })();
    if (Number.isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  };

  const statusBadge = (status) => {
    const map = {
      draft: 'bg-[hsla(210,25%,98%,1)] text-[hsla(210,20%,40%,1)]',
      sent: 'bg-[#4A8BC2]/10 text-[#1A3A5C]',
      accepted: 'bg-green-50 text-green-700',
      rejected: 'bg-red-50 text-red-700',
    };
    return map[status] || map.draft;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Devis</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Créez et gérez vos devis</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 w-full sm:w-auto">
          <Plus size={18} />
          Nouveau devis
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
                  <TH>Référence</TH>
                  <TH>Client</TH>
                  <TH>Secteur</TH>
                  <TH>Statut</TH>
                  <TH>Date</TH>
                  <TH className="text-right">Total</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {quotes.map((q) => (
                  <TR key={q.id}>
                    <TD className="font-semibold text-[hsla(210,30%,20%,1)]">{q.quote_number}</TD>
                    <TD className="text-sm">
                      {q.client?.type === 'company'
                        ? (q.client?.company_name || 'Entreprise')
                        : `${q.client?.first_name || ''} ${q.client?.last_name || ''}`.trim() || 'Client'}
                    </TD>
                    <TD className="text-sm">{q.sector?.name || '—'}</TD>
                    <TD>
                      <span className={cn('px-3 py-1 rounded-full text-xs font-bold', statusBadge(q.status))}>
                        {statusOptions.find((s) => s.value === q.status)?.label || 'Brouillon'}
                      </span>
                    </TD>
                    <TD className="text-sm">{formatDateFr(q.issue_date)}</TD>
                    <TD className="text-right font-semibold">{formatMoney(q.total_amount)} GNF</TD>
                    <TD className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadPdf(q.id, q.quote_number)}
                        className="text-[#1A3A5C] hover:bg-[#1A3A5C]/10"
                        title="Télécharger PDF"
                      >
                        <Download size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(q)}
                        className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </Button>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(q.id)}
                          className="text-[#D64545] hover:bg-[#D64545]/10"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </TD>
                  </TR>
                ))}
                {quotes.length === 0 && (
                  <TR>
                    <TD colSpan={7} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun devis trouvé.
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
        title={editingQuoteId ? 'Modifier le devis' : 'Créer un devis'}
      >
        {loadingQuote ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Client"
                value={formData.client_id}
                options={clientOptions.length ? clientOptions : [{ value: '', label: 'Aucun client' }]}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                error={errors.client_id?.[0]}
              />
              <Select
                label="Secteur"
                value={formData.sector_id}
                options={sectorOptions.length ? sectorOptions : [{ value: '', label: 'Aucun secteur' }]}
                onChange={(e) => setFormData({ ...formData, sector_id: e.target.value })}
                error={errors.sector_id?.[0]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Statut"
                value={formData.status}
                options={statusOptions}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                error={errors.status?.[0]}
              />
              <Input
                type="date"
                label="Date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                error={errors.issue_date?.[0]}
                required
              />
              <Input
                type="date"
                label="Valide jusqu'au"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                error={errors.valid_until?.[0]}
              />
            </div>

            <div>
              <div className="text-sm font-semibold text-[hsla(210,30%,20%,1)] ml-1 mb-2">
                Lignes du devis
              </div>

              <div className="space-y-3">
                {(formData.items || []).map((it, idx) => (
                  <div key={idx} className="rounded-xl border border-[#E0E6ED] bg-[hsla(210,25%,99%,1)] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-5">
                          <Input
                            placeholder="Description"
                            value={it.description}
                            onChange={(e) => handleItemChange(idx, { description: e.target.value })}
                            error={errors?.[`items.${idx}.description`]?.[0] || errors?.['items.*.description']?.[0]}
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Qté"
                            value={it.quantity}
                            onChange={(e) => handleItemChange(idx, { quantity: e.target.value })}
                            error={errors?.[`items.${idx}.quantity`]?.[0] || errors?.['items.*.quantity']?.[0]}
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            placeholder="Unité"
                            value={it.unit}
                            onChange={(e) => handleItemChange(idx, { unit: e.target.value })}
                            error={errors?.[`items.${idx}.unit`]?.[0]}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Prix unitaire"
                            value={it.unit_price}
                            onChange={(e) => handleItemChange(idx, { unit_price: e.target.value })}
                            error={errors?.[`items.${idx}.unit_price`]?.[0] || errors?.['items.*.unit_price']?.[0]}
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(idx)}
                        className="text-[#D64545] hover:bg-[#D64545]/10 mt-1"
                        title="Supprimer la ligne"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <div className="text-right text-sm font-semibold mt-2 text-[hsla(210,30%,20%,1)]">
                      Total ligne: {formatMoney(Number(it.quantity || 0) * Number(it.unit_price || 0))} GNF
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <Button type="button" variant="ghost" onClick={addItem} className="gap-2">
                  <Plus size={16} />
                  Ajouter une ligne
                </Button>
                <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">
                  Sous-total: {formatMoney(itemsSubtotal)} GNF
                </div>
              </div>
            </div>

            <Textarea
              label="Notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              error={errors.notes?.[0]}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <LoadingSpinner size="sm" /> : editingQuoteId ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le devis"
        message="Cette action est irréversible. Supprimer ce devis ?"
        confirmText={deleting ? 'Suppression...' : 'Supprimer'}
        cancelText="Annuler"
      />
    </div>
  );
};

export default Quotes;
