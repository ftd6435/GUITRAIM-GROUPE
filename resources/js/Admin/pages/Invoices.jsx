import React, { useEffect, useMemo, useState } from 'react';
import { Download, Plus, Pencil, Trash2, X, FileText } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import Modal from '../../Components/ui/Modal';
import ConfirmModal from '../../Components/ui/ConfirmModal';
import { Input, Select, Textarea } from '../../Components/ui/Input';
import { Card, CardContent } from '../../Components/ui/Card';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import { cn } from '../../utils/utils';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const canDelete = currentUser?.role === 'super_admin';
  const [payments, setPayments] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    payment_method: 'cash',
    payment_date: '',
    reference_number: '',
    notes: '',
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [invoicePaymentSummary, setInvoicePaymentSummary] = useState({ total_amount: 0, amount_paid: 0, status: 'unpaid' });

  const [formData, setFormData] = useState({
    client_id: '',
    sector_id: '',
    quote_id: '',
    status: 'unpaid',
    issue_date: '',
    due_date: '',
    notes: '',
    items: [{ description: '', quantity: 1, unit: '', unit_price: 0 }],
  });

  const statusOptions = useMemo(() => ([
    { value: 'unpaid', label: 'Impayée' },
    { value: 'partial', label: 'Partielle' },
    { value: 'paid', label: 'Payée' },
    { value: 'cancelled', label: 'Annulée' },
  ]), []);

  const paymentMethodOptions = useMemo(() => ([
    { value: 'cash', label: 'Espèces' },
    { value: 'bank_transfer', label: 'Virement' },
    { value: 'check', label: 'Chèque' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'other', label: 'Autre' },
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

  const quoteOptions = useMemo(() => (
    [{ value: '', label: 'Aucun' }].concat(
      (quotes || []).map((q) => ({
        value: String(q.id),
        label: `${q.quote_number} · ${(q.client?.type === 'company'
          ? (q.client?.company_name || 'Entreprise')
          : `${q.client?.first_name || ''} ${q.client?.last_name || ''}`.trim() || 'Client')}`,
      }))
    )
  ), [quotes]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crm/invoices');
      setInvoices(response.data || []);
    } catch (e) {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [clientsRes, sectorsRes, quotesRes] = await Promise.all([
        api.get('/crm/clients'),
        api.get('/sectors'),
        api.get('/crm/quotes'),
      ]);
      setClients(clientsRes.data || []);
      setSectors(sectorsRes.data || []);
      setQuotes(quotesRes.data || []);
    } catch (e) {
      setClients([]);
      setSectors([]);
      setQuotes([]);
    }
  };

  useEffect(() => {
    fetchMeta();
    fetchInvoices();
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

  const handleOpenModal = async (invoice = null) => {
    setErrors({});
    setPaymentErrors({});
    if (!invoice) {
      setEditingInvoiceId(null);
      setFormData({
        client_id: String(clients[0]?.id || ''),
        sector_id: String(sectors[0]?.id || ''),
        quote_id: '',
        status: 'unpaid',
        issue_date: '',
        due_date: '',
        notes: '',
        items: [{ description: '', quantity: 1, unit: '', unit_price: 0 }],
      });
      setPayments([]);
      setInvoicePaymentSummary({ total_amount: 0, amount_paid: 0, status: 'unpaid' });
      setPaymentForm({
        amount: '',
        payment_method: 'cash',
        payment_date: '',
        reference_number: '',
        notes: '',
      });
      setIsModalOpen(true);
      return;
    }

    setEditingInvoiceId(invoice.id);
    setIsModalOpen(true);
    setLoadingInvoice(true);
    try {
      const full = await api.get(`/crm/invoices/${invoice.id}`);
      const inv = full.data;
      setFormData({
        client_id: String(inv.client_id || inv.client?.id || ''),
        sector_id: String(inv.sector_id || inv.sector?.id || ''),
        quote_id: String(inv.quote_id || ''),
        status: inv.status || 'unpaid',
        issue_date: inv.issue_date || '',
        due_date: inv.due_date || '',
        notes: inv.notes || '',
        items: (inv.items || []).length
          ? (inv.items || []).map((it) => ({
              description: it.description || '',
              quantity: Number(it.quantity || 1),
              unit: it.unit || '',
              unit_price: Number(it.unit_price || 0),
            }))
          : [{ description: '', quantity: 1, unit: '', unit_price: 0 }],
      });
      setPayments(inv.payments || []);
      setInvoicePaymentSummary({
        total_amount: Number(inv.total_amount || 0),
        amount_paid: Number(inv.amount_paid || 0),
        status: inv.status || 'unpaid',
      });
      if (!paymentForm.payment_date) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setPaymentForm((p) => ({ ...p, payment_date: `${yyyy}-${mm}-${dd}` }));
      }
    } catch (e) {
    } finally {
      setLoadingInvoice(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingInvoiceId(null);
  };

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

  const itemsSubtotal = useMemo(() => {
    return (formData.items || []).reduce((sum, it) => {
      const qty = Number(it.quantity || 0);
      const pu = Number(it.unit_price || 0);
      return sum + qty * pu;
    }, 0);
  }, [formData.items]);

  const handleQuoteSelect = async (quoteId) => {
    setFormData((p) => ({ ...p, quote_id: quoteId }));
    if (!quoteId) return;
    try {
      const full = await api.get(`/crm/quotes/${quoteId}`);
      const q = full.data;
      setFormData((p) => ({
        ...p,
        quote_id: String(q.id),
        client_id: String(q.client_id || ''),
        sector_id: String(q.sector_id || ''),
        notes: q.notes || '',
        items: (q.items || []).length
          ? (q.items || []).map((it) => ({
              description: it.description || '',
              quantity: Number(it.quantity || 1),
              unit: it.unit || '',
              unit_price: Number(it.unit_price || 0),
            }))
          : p.items,
      }));
    } catch (e) {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const payload = {
        client_id: Number(formData.client_id),
        sector_id: Number(formData.sector_id),
        quote_id: formData.quote_id ? Number(formData.quote_id) : null,
        status: formData.status,
        issue_date: formData.issue_date,
        due_date: formData.due_date || null,
        notes: formData.notes || null,
        items: (formData.items || []).map((it) => ({
          description: it.description,
          quantity: Number(it.quantity),
          unit: it.unit || null,
          unit_price: Number(it.unit_price),
        })),
      };

      if (editingInvoiceId) {
        await api.put(`/crm/invoices/${editingInvoiceId}`, payload);
      } else {
        await api.post('/crm/invoices', payload);
      }

      await fetchInvoices();
      handleCloseModal();
    } catch (error) {
      if (error.errors) setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setInvoiceToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/crm/invoices/${invoiceToDelete}`);
      await fetchInvoices();
      setIsConfirmOpen(false);
      setInvoiceToDelete(null);
    } catch (e) {
    } finally {
      setDeleting(false);
    }
  };

  const downloadPdf = async (invoiceId, invoiceNumber) => {
    try {
      const blob = await api.get(`/crm/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
      if (!(blob instanceof Blob)) {
        throw new Error('Téléchargement impossible: réponse invalide.');
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber || 'facture'}.pdf`;
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

  const refreshPaymentsAndSummary = async (invoiceId) => {
    try {
      const full = await api.get(`/crm/invoices/${invoiceId}`);
      const inv = full.data;
      setPayments(inv.payments || []);
      setInvoicePaymentSummary({
        total_amount: Number(inv.total_amount || 0),
        amount_paid: Number(inv.amount_paid || 0),
        status: inv.status || 'unpaid',
      });
    } catch (e) {
    }
  };

  const addPayment = async () => {
    if (!editingInvoiceId) return;
    setPaymentSubmitting(true);
    setPaymentErrors({});
    try {
      const payload = {
        amount: Number(paymentForm.amount),
        payment_method: paymentForm.payment_method || null,
        payment_date: paymentForm.payment_date,
        reference_number: paymentForm.reference_number || null,
        notes: paymentForm.notes || null,
      };
      await api.post(`/crm/invoices/${editingInvoiceId}/payments`, payload);
      setPaymentForm((p) => ({ ...p, amount: '', reference_number: '', notes: '' }));
      await refreshPaymentsAndSummary(editingInvoiceId);
      await fetchInvoices();
    } catch (error) {
      if (error.errors) setPaymentErrors(error.errors);
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const deletePayment = async (paymentId) => {
    if (!paymentId) return;
    try {
      await api.delete(`/crm/payments/${paymentId}`);
      if (editingInvoiceId) {
        await refreshPaymentsAndSummary(editingInvoiceId);
      }
      await fetchInvoices();
    } catch (e) {
    }
  };

  const downloadReceipt = async (paymentId, invoiceNumber) => {
    try {
      const blob = await api.get(`/crm/payments/${paymentId}/receipt`, { responseType: 'blob' });
      if (!(blob instanceof Blob)) {
        throw new Error('Téléchargement impossible: réponse invalide.');
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recu-${invoiceNumber || 'facture'}-${paymentId}.pdf`;
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
      unpaid: 'bg-red-50 text-red-700',
      partial: 'bg-[#4A8BC2]/10 text-[#1A3A5C]',
      paid: 'bg-green-50 text-green-700',
      cancelled: 'bg-[hsla(210,25%,98%,1)] text-[hsla(210,20%,40%,1)]',
    };
    return map[status] || map.unpaid;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Factures</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Créez et gérez vos factures</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 w-full sm:w-auto">
          <Plus size={18} />
          Nouvelle facture
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
                  <TH className="text-right">Payé</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {invoices.map((inv) => (
                  <TR key={inv.id}>
                    <TD className="font-semibold text-[hsla(210,30%,20%,1)]">{inv.invoice_number}</TD>
                    <TD className="text-sm">
                      {inv.client?.type === 'company'
                        ? (inv.client?.company_name || 'Entreprise')
                        : `${inv.client?.first_name || ''} ${inv.client?.last_name || ''}`.trim() || 'Client'}
                    </TD>
                    <TD className="text-sm">{inv.sector?.name || '—'}</TD>
                    <TD>
                      <span className={cn('px-3 py-1 rounded-full text-xs font-bold', statusBadge(inv.status))}>
                        {statusOptions.find((s) => s.value === inv.status)?.label || 'Impayée'}
                      </span>
                    </TD>
                    <TD className="text-sm">{formatDateFr(inv.issue_date)}</TD>
                    <TD className="text-right font-semibold">{formatMoney(inv.total_amount)} GNF</TD>
                    <TD className="text-right font-semibold">{formatMoney(inv.amount_paid)} GNF</TD>
                    <TD className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadPdf(inv.id, inv.invoice_number)}
                        className="text-[#1A3A5C] hover:bg-[#1A3A5C]/10"
                        title="Télécharger PDF"
                      >
                        <Download size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(inv)}
                        className="text-[#4A8BC2] hover:bg-[#4A8BC2]/10"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </Button>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(inv.id)}
                          className="text-[#D64545] hover:bg-[#D64545]/10"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </TD>
                  </TR>
                ))}
                {invoices.length === 0 && (
                  <TR>
                    <TD colSpan={8} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucune facture trouvée.
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
        title={editingInvoiceId ? 'Modifier la facture' : 'Créer une facture'}
      >
        {loadingInvoice ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Devis (optionnel)"
                value={formData.quote_id}
                options={quoteOptions}
                onChange={(e) => handleQuoteSelect(e.target.value)}
                error={errors.quote_id?.[0]}
              />
              <Select
                label="Statut"
                value={formData.status}
                options={statusOptions}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                error={errors.status?.[0]}
              />
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                label="Échéance"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                error={errors.due_date?.[0]}
              />
            </div>

            <div>
              <div className="text-sm font-semibold text-[hsla(210,30%,20%,1)] ml-1 mb-2">
                Lignes de la facture
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

            {editingInvoiceId && (
              <div className="rounded-2xl border border-[#E0E6ED] bg-[hsla(210,25%,99%,1)] p-4 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Paiements</div>
                    <div className="text-xs font-medium text-[hsla(210,20%,40%,1)]">
                      Total: {formatMoney(invoicePaymentSummary.total_amount)} GNF · Payé: {formatMoney(invoicePaymentSummary.amount_paid)} GNF · Solde:{' '}
                      {formatMoney(Number(invoicePaymentSummary.total_amount || 0) - Number(invoicePaymentSummary.amount_paid || 0))} GNF
                    </div>
                  </div>
                  <span className={cn('px-3 py-1 rounded-full text-xs font-bold', statusBadge(invoicePaymentSummary.status))}>
                    {statusOptions.find((s) => s.value === invoicePaymentSummary.status)?.label || 'Impayée'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    label="Montant"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))}
                    error={paymentErrors.amount?.[0]}
                  />
                  <Input
                    type="date"
                    label="Date de paiement"
                    value={paymentForm.payment_date}
                    onChange={(e) => setPaymentForm((p) => ({ ...p, payment_date: e.target.value }))}
                    error={paymentErrors.payment_date?.[0]}
                  />
                  <Select
                    label="Méthode"
                    value={paymentForm.payment_method}
                    options={paymentMethodOptions}
                    onChange={(e) => setPaymentForm((p) => ({ ...p, payment_method: e.target.value }))}
                    error={paymentErrors.payment_method?.[0]}
                  />
                  <Input
                    label="Référence"
                    value={paymentForm.reference_number}
                    onChange={(e) => setPaymentForm((p) => ({ ...p, reference_number: e.target.value }))}
                    error={paymentErrors.reference_number?.[0]}
                  />
                </div>

                <Textarea
                  label="Notes paiement"
                  rows={2}
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, notes: e.target.value }))}
                  error={paymentErrors.notes?.[0]}
                />

                <div className="flex justify-end">
                  <Button type="button" disabled={paymentSubmitting} onClick={addPayment}>
                    {paymentSubmitting ? <LoadingSpinner size="sm" /> : 'Ajouter le paiement'}
                  </Button>
                </div>

                <div className="border-t border-[#E0E6ED]" />

                <div className="space-y-2">
                  {payments.length ? (
                    payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#E0E6ED] bg-white px-3 py-2">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[hsla(210,30%,20%,1)]">
                            {formatDateFr(p.payment_date)} · {formatMoney(p.amount)} GNF
                          </div>
                          <div className="text-xs font-medium text-[hsla(210,20%,40%,1)] truncate">
                            {(p.payment_method || '—')}{p.reference_number ? ` · ${p.reference_number}` : ''}{p.notes ? ` · ${p.notes}` : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadReceipt(p.id, invoices.find((x) => x.id === editingInvoiceId)?.invoice_number)}
                            className="text-[#1A3A5C] hover:bg-[#1A3A5C]/10"
                            title="Télécharger reçu"
                          >
                            <FileText size={16} />
                          </Button>
                          {canDelete && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePayment(p.id)}
                              className="text-[#D64545] hover:bg-[#D64545]/10"
                              title="Supprimer paiement"
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm font-medium text-[hsla(210,15%,55%,1)]">Aucun paiement enregistré.</div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <LoadingSpinner size="sm" /> : editingInvoiceId ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la facture"
        message="Cette action est irréversible. Supprimer cette facture ?"
        confirmText={deleting ? 'Suppression...' : 'Supprimer'}
        cancelText="Annuler"
      />
    </div>
  );
};

export default Invoices;
