import React, { useEffect, useMemo, useState } from 'react';
import { CreditCard, FileText, RefreshCcw, TrendingUp, Users, Wallet } from 'lucide-react';
import api from '../../utils/api';
import { Card, CardContent, CardHeader } from '../../Components/ui/Card';
import Button from '../../Components/ui/Button';
import { Input, Select } from '../../Components/ui/Input';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import { cn } from '../../utils/utils';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, hint, tone }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E0E6ED] transition-all hover:shadow-md">
    <div className="flex items-start justify-between">
      <div className={cn('p-3 rounded-xl bg-[#4A8BC2]/10 text-[#1A3A5C]', tone)}>
        <Icon size={22} />
      </div>
      {hint ? (
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[hsla(210,25%,98%,1)] text-[hsla(210,20%,40%,1)] border border-[#E0E6ED]">
          {hint}
        </span>
      ) : null}
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">{label}</p>
      <h3 className="text-3xl font-bold mt-1 text-[hsla(210,30%,20%,1)]">{value}</h3>
    </div>
  </div>
);

const MiniLineChart = ({ points, color = '#1A3A5C' }) => {
  const width = 560;
  const height = 140;
  const padding = 8;

  const safePoints = Array.isArray(points) ? points : [];
  const max = Math.max(1, ...safePoints.map((p) => Number(p.value || 0)));

  const d = safePoints
    .map((p, idx) => {
      const x = padding + (safePoints.length <= 1 ? 0 : (idx * (width - padding * 2)) / (safePoints.length - 1));
      const y = height - padding - ((Number(p.value || 0) / max) * (height - padding * 2));
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
      <path d={`M ${padding} ${height - padding} L ${width - padding} ${height - padding}`} stroke="#E0E6ED" strokeWidth="2" fill="none" />
      <path d={d} stroke={color} strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const MiniBarChart = ({ bars }) => {
  const safeBars = Array.isArray(bars) ? bars : [];
  const max = Math.max(1, ...safeBars.map((b) => Number(b.value || 0)));
  return (
    <div className="flex items-end gap-3 h-32">
      {safeBars.map((b) => (
        <div key={b.key} className="flex-1">
          <div
            className={cn('w-full rounded-lg border border-[#E0E6ED]', b.className)}
            style={{ height: `${Math.max(6, (Number(b.value || 0) / max) * 120)}px` }}
            title={`${b.label}: ${b.value}`}
          />
          <div className="text-[11px] font-semibold text-[hsla(210,20%,40%,1)] text-center mt-2 truncate">
            {b.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const toDateInputValue = (d) => {
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return '';
  }
};

const addDays = (dateStr, days) => {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toDateInputValue(d);
};

const addMonths = (yearMonth, months) => {
  const [y, m] = String(yearMonth || '').split('-').map((x) => Number(x));
  if (!y || !m) return '';
  const d = new Date(y, m - 1, 1);
  d.setMonth(d.getMonth() + months);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
};

const CrmDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [clients, setClients] = useState([]);
  const [data, setData] = useState(null);

  const [preset, setPreset] = useState('30');
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return toDateInputValue(d);
  });
  const [to, setTo] = useState(() => toDateInputValue(new Date()));
  const [sectorId, setSectorId] = useState('');
  const [clientId, setClientId] = useState('');

  const presetOptions = useMemo(() => ([
    { value: '7', label: '7 jours' },
    { value: '30', label: '30 jours' },
    { value: '90', label: '90 jours' },
    { value: 'custom', label: 'Personnalisé' },
  ]), []);

  const sectorOptions = useMemo(() => (
    [{ value: '', label: 'Tous secteurs' }].concat((sectors || []).map((s) => ({ value: String(s.id), label: s.name })))
  ), [sectors]);

  const clientOptions = useMemo(() => (
    [{ value: '', label: 'Tous clients' }].concat((clients || []).map((c) => ({
      value: String(c.id),
      label: c.type === 'company'
        ? (c.company_name || 'Entreprise')
        : `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Client',
    })))
  ), [clients]);

  const formatMoney = (amount) => {
    try {
      return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Number(amount || 0));
    } catch {
      return String(amount || 0);
    }
  };

  const parseDateValue = (value) => {
    if (!value) return null;
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

    const str = String(value).trim();
    if (!str) return null;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [dd, mm, yyyy] = str.split('/').map((x) => Number(x));
      const d = new Date(yyyy, (mm || 1) - 1, dd || 1);
      return Number.isNaN(d.getTime()) ? null : d;
    }

    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(str)) {
      const normalized = str.replace(' ', 'T');
      const t = Date.parse(normalized);
      return Number.isFinite(t) ? new Date(t) : null;
    }

    const t = Date.parse(str);
    return Number.isFinite(t) ? new Date(t) : null;
  };

  const formatDateFr = (value) => {
    const d = parseDateValue(value);
    if (!d) return '—';
    try {
      return new Intl.DateTimeFormat('fr-FR').format(d);
    } catch {
      return '—';
    }
  };

  const applyPreset = (value) => {
    setPreset(value);
    if (value === 'custom') return;
    const days = Number(value);
    if (!days || days < 1) return;
    const end = toDateInputValue(new Date());
    const start = addDays(end, -(days - 1));
    setFrom(start);
    setTo(end);
  };

  const fetchMeta = async () => {
    try {
      const [sectorsRes, clientsRes] = await Promise.all([
        api.get('/sectors'),
        api.get('/crm/clients'),
      ]);
      const sectorsPayload = Array.isArray(sectorsRes?.data) ? sectorsRes.data : (Array.isArray(sectorsRes) ? sectorsRes : []);
      const clientsPayload = Array.isArray(clientsRes?.data) ? clientsRes.data : (Array.isArray(clientsRes) ? clientsRes : []);
      setSectors(sectorsPayload);
      setClients(clientsPayload);
    } catch {
      setSectors([]);
      setClients([]);
    }
  };

  const fetchDashboard = async (opts = { initial: false }) => {
    const isInitial = !!opts.initial;
    try {
      if (isInitial) setLoading(true);
      else setRefreshing(true);

      const params = {
        from: from || undefined,
        to: to || undefined,
        sector_id: sectorId ? Number(sectorId) : undefined,
        client_id: clientId ? Number(clientId) : undefined,
      };

      const res = await api.get('/crm/dashboard', { params });
      setData(res?.data || null);
    } catch {
      setData(null);
    } finally {
      if (isInitial) setLoading(false);
      else setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMeta();
    fetchDashboard({ initial: true });
  }, []);

  useEffect(() => {
    if (!from || !to) return;
    const t = setTimeout(() => {
      fetchDashboard({ initial: false });
    }, 300);
    return () => clearTimeout(t);
  }, [from, to, sectorId, clientId]);

  const series = data?.series || {};
  const filters = data?.filters || {};
  const summary = data?.summary || {};
  const groupBy = filters.group_by || 'day';

  const normalizeSeries = (rows, kind) => {
    const map = new Map((rows || []).map((r) => [String(r.period), Number(kind === 'count' ? r.count : r.amount) || 0]));

    if (groupBy === 'month') {
      const startYm = String(from || '').slice(0, 7);
      const endYm = String(to || '').slice(0, 7);
      if (!startYm || !endYm) return [];
      const out = [];
      let cursor = startYm;
      let guard = 0;
      while (cursor <= endYm && guard < 120) {
        out.push({ label: cursor, value: map.get(cursor) || 0 });
        cursor = addMonths(cursor, 1);
        guard += 1;
      }
      return out;
    }

    const out = [];
    let cursor = from;
    let guard = 0;
    while (cursor && cursor <= to && guard < 400) {
      out.push({ label: cursor.slice(5), value: map.get(cursor) || 0 });
      cursor = addDays(cursor, 1);
      guard += 1;
    }
    return out;
  };

  const billedPoints = useMemo(() => normalizeSeries(series.billed, 'amount'), [series.billed, from, to, groupBy]);
  const collectedPoints = useMemo(() => normalizeSeries(series.collected, 'amount'), [series.collected, from, to, groupBy]);
  const invoicesPoints = useMemo(() => normalizeSeries(series.invoices, 'count'), [series.invoices, from, to, groupBy]);
  const quotesPoints = useMemo(() => normalizeSeries(series.quotes, 'count'), [series.quotes, from, to, groupBy]);

  const statusBars = useMemo(() => ([
    { key: 'unpaid', label: 'Impayées', value: summary?.invoice_status_counts?.unpaid || 0, className: 'bg-red-50' },
    { key: 'partial', label: 'Partielles', value: summary?.invoice_status_counts?.partial || 0, className: 'bg-[#4A8BC2]/10' },
    { key: 'paid', label: 'Payées', value: summary?.invoice_status_counts?.paid || 0, className: 'bg-green-50' },
    { key: 'cancelled', label: 'Annulées', value: summary?.invoice_status_counts?.cancelled || 0, className: 'bg-[hsla(210,25%,98%,1)]' },
  ]), [summary]);

  const getClientLabel = (client) => {
    if (!client) return 'Client';
    if (client.type === 'company') return client.company_name || 'Entreprise';
    const label = `${client.first_name || ''} ${client.last_name || ''}`.trim();
    return label || 'Client';
  };

  const activity = useMemo(() => {
    const payments = (data?.recent?.payments || []).map((p) => ({
      id: `payment-${p.id}`,
      kind: 'payment',
      date: p.payment_date,
      title: 'Paiement reçu',
      subtitle: p.invoice?.invoice_number || `Facture #${p.invoice_id || '—'}`,
      amount: Number(p.amount || 0),
    }));

    const invoices = (data?.recent?.invoices || []).map((inv) => ({
      id: `invoice-${inv.id}`,
      kind: 'invoice',
      date: inv.issue_date,
      title: inv.invoice_number ? `Facture ${inv.invoice_number}` : `Facture #${inv.id}`,
      subtitle: getClientLabel(inv.client),
      amount: Number(inv.total_amount || 0),
      status: inv.status || null,
    }));

    const quotes = (data?.recent?.quotes || []).map((q) => ({
      id: `quote-${q.id}`,
      kind: 'quote',
      date: q.issue_date,
      title: q.quote_number ? `Devis ${q.quote_number}` : `Devis #${q.id}`,
      subtitle: getClientLabel(q.client),
      amount: Number(q.total_amount || 0),
      status: q.status || null,
    }));

    const all = payments.concat(invoices, quotes);
    const score = (value) => {
      const d = parseDateValue(value);
      return d ? d.getTime() : 0;
    };
    return all.sort((a, b) => score(b.date) - score(a.date)).slice(0, 12);
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-6 page-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">CRM · Tableau de bord</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Chiffres clés, suivi des encaissements et activité</p>
        </div>
        <Button type="button" variant="ghost" onClick={() => fetchDashboard({ initial: false })} className="gap-2">
          {refreshing ? <LoadingSpinner size="sm" /> : <RefreshCcw size={16} />}
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader title="Filtres" subtitle="Affinez les statistiques par période et périmètre" />
        <CardContent className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-3">
            <Select
              label="Période"
              value={preset}
              options={presetOptions}
              onChange={(e) => applyPreset(e.target.value)}
            />
          </div>
          <div className="col-span-6 md:col-span-3">
            <Input
              type="date"
              label="Du"
              value={from}
              onChange={(e) => { setPreset('custom'); setFrom(e.target.value); }}
            />
          </div>
          <div className="col-span-6 md:col-span-3">
            <Input
              type="date"
              label="Au"
              value={to}
              onChange={(e) => { setPreset('custom'); setTo(e.target.value); }}
            />
          </div>
          <div className="col-span-12 md:col-span-3">
            <Select
              label="Secteur"
              value={sectorId}
              options={sectorOptions}
              onChange={(e) => setSectorId(e.target.value)}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Select
              label="Client"
              value={clientId}
              options={clientOptions}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <div className="col-span-12 md:col-span-6 flex items-end">
            <div className="text-xs font-medium text-[hsla(210,20%,40%,1)]">
              Groupe: <span className="font-bold text-[hsla(210,30%,20%,1)]">{groupBy === 'month' ? 'Mois' : 'Jour'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={FileText} label="Factures" value={String(summary.invoices_count || 0)} hint={`${summary.quotes_count || 0} devis`} />
        <StatCard icon={Wallet} label="Total facturé" value={`${formatMoney(summary.total_billed)} GNF`} hint="période" />
        <StatCard icon={CreditCard} label="Encaissements" value={`${formatMoney(summary.total_collected)} GNF`} hint={`${summary.payments_count || 0} paiements`} />
        <StatCard icon={TrendingUp} label="Taux de recouvrement" value={`${Number(summary.collection_rate || 0).toFixed(2)}%`} hint={`Solde: ${formatMoney(summary.total_outstanding)} GNF`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2">
          <CardHeader title="Évolution" subtitle="Facturé vs encaissé" />
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[#E0E6ED] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Facturé</div>
                  <div className="text-xs font-semibold text-[hsla(210,20%,40%,1)]">{formatMoney(summary.total_billed)} GNF</div>
                </div>
                <MiniLineChart points={billedPoints} color="#1A3A5C" />
              </div>
              <div className="rounded-2xl border border-[#E0E6ED] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Encaissé</div>
                  <div className="text-xs font-semibold text-[hsla(210,20%,40%,1)]">{formatMoney(summary.total_collected)} GNF</div>
                </div>
                <MiniLineChart points={collectedPoints} color="#4CAF8D" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Statut factures" subtitle="Répartition sur la période" />
          <CardContent>
            <MiniBarChart bars={statusBars} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2">
          <CardHeader title="Volume" subtitle="Nombre de devis et factures émises" />
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[#E0E6ED] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Factures émises</div>
                  <div className="text-xs font-semibold text-[hsla(210,20%,40%,1)]">{summary.invoices_count || 0}</div>
                </div>
                <MiniLineChart points={invoicesPoints} color="#1A3A5C" />
              </div>
              <div className="rounded-2xl border border-[#E0E6ED] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Devis émis</div>
                  <div className="text-xs font-semibold text-[hsla(210,20%,40%,1)]">{summary.quotes_count || 0}</div>
                </div>
                <MiniLineChart points={quotesPoints} color="#4A8BC2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Raccourcis" subtitle="Accès direct aux écrans CRM" />
          <CardContent className="space-y-3">
            <Link to="/admin/crm/clients" className="flex items-center justify-between rounded-xl border border-[#E0E6ED] px-4 py-3 hover:border-[#1A3A5C] hover:bg-[hsla(210,25%,98%,1)] transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <Users size={18} className="text-[hsla(210,20%,40%,1)]" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)] truncate">Clients</div>
                  <div className="text-xs font-medium text-[hsla(210,20%,40%,1)]">Gérer et rechercher des clients</div>
                </div>
              </div>
              <div className="text-xs font-bold text-[hsla(210,30%,20%,1)]">{summary.clients_count || 0}</div>
            </Link>
            <Link to="/admin/crm/quotes" className="flex items-center justify-between rounded-xl border border-[#E0E6ED] px-4 py-3 hover:border-[#1A3A5C] hover:bg-[hsla(210,25%,98%,1)] transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={18} className="text-[hsla(210,20%,40%,1)]" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)] truncate">Devis</div>
                  <div className="text-xs font-medium text-[hsla(210,20%,40%,1)]">Suivre les propositions commerciales</div>
                </div>
              </div>
              <div className="text-xs font-bold text-[hsla(210,30%,20%,1)]">{summary.quotes_count || 0}</div>
            </Link>
            <Link to="/admin/crm/invoices" className="flex items-center justify-between rounded-xl border border-[#E0E6ED] px-4 py-3 hover:border-[#1A3A5C] hover:bg-[hsla(210,25%,98%,1)] transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <Wallet size={18} className="text-[hsla(210,20%,40%,1)]" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)] truncate">Factures</div>
                  <div className="text-xs font-medium text-[hsla(210,20%,40%,1)]">Émettre, encaisser, relancer</div>
                </div>
              </div>
              <div className="text-xs font-bold text-[hsla(210,30%,20%,1)]">{summary.invoices_count || 0}</div>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2">
          <CardHeader title="Top clients" subtitle="Classement par facturation" />
          <CardContent className="space-y-3">
            {(data?.top_clients || []).length ? (
              (data?.top_clients || []).map((c) => (
                <div key={c.client_id} className="flex items-center justify-between gap-4 rounded-xl border border-[#E0E6ED] bg-white px-4 py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[hsla(210,30%,20%,1)] truncate">{c.label}</div>
                    <div className="text-xs font-medium text-[hsla(210,20%,40%,1)]">
                      {c.invoices_count || 0} factures · Payé: {formatMoney(c.paid)} GNF
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-[hsla(210,30%,20%,1)]">{formatMoney(c.billed)} GNF</div>
                    <div className="text-xs font-medium text-[hsla(210,20%,40%,1)]">Facturé</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm font-medium text-[hsla(210,15%,55%,1)]">Aucune donnée sur la période.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Activité" subtitle="Derniers événements" />
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-[#E0E6ED] bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[hsla(210,20%,40%,1)]" />
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Nouveaux clients</div>
                </div>
                <div className="text-sm font-extrabold text-[hsla(210,30%,20%,1)]">{summary.new_clients_count || 0}</div>
              </div>
              <div className="text-xs font-medium text-[hsla(210,20%,40%,1)] mt-2">Total clients: {summary.clients_count || 0}</div>
            </div>

            <div className="rounded-xl border border-[#E0E6ED] bg-white p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Journal d'activité</div>
                <div className="text-xs font-semibold text-[hsla(210,20%,40%,1)] flex items-center gap-2">
                  <RefreshCcw size={14} />
                  Dernières opérations
                </div>
              </div>
              {activity.length ? (
                activity.map((e) => (
                  <div key={e.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[hsla(210,20%,40%,1)] truncate">
                        {formatDateFr(e.date)} · {e.title}
                      </div>
                      <div className="text-[11px] font-medium text-[hsla(210,20%,40%,1)] truncate">{e.subtitle}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-[hsla(210,30%,20%,1)]">{formatMoney(e.amount)} GNF</div>
                      {e.status ? (
                        <div className="text-[11px] font-semibold text-[hsla(210,20%,40%,1)]">{String(e.status)}</div>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm font-medium text-[hsla(210,15%,55%,1)]">Aucune activité sur la période.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrmDashboard;
