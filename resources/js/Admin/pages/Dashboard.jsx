import React, { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  FileText,
  Phone,
  Send,
  Plus,
  PenTool,
  Upload,
  RefreshCcw,
  Users,
  Wallet
} from 'lucide-react';
import { cn } from '../../utils/utils';
import api from '../../utils/api';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader } from '../../Components/ui/Card';
import Button from '../../Components/ui/Button';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E0E6ED] transition-all hover:shadow-md">
    <div className="flex items-start justify-between">
      <div className={cn("p-3 rounded-xl bg-[#4A8BC2]/10 text-[#1A3A5C]", color)}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={cn(
          "text-xs font-semibold px-2 py-1 rounded-full",
          trend.startsWith('+') ? "bg-[#E8F5F0] text-[#4CAF8D]" : "bg-[#FDEAEA] text-[#D64545]"
        )}>
          {trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">{label}</p>
      <h3 className="text-3xl font-bold mt-1 text-[hsla(210,30%,20%,1)]">{value}</h3>
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, label, to, color }) => (
  <Link
    to={to}
    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E0E6ED] hover:border-[#1A3A5C] hover:bg-[hsla(210,25%,98%,1)] transition-all group"
  >
    <div className={cn("p-2 rounded-lg bg-[hsla(210,25%,98%,1)] group-hover:bg-[#1A3A5C] group-hover:text-white transition-colors", color)}>
      <Icon size={18} />
    </div>
    <span className="text-sm font-semibold text-[hsla(210,30%,20%,1)]">{label}</span>
  </Link>
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

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payload, setPayload] = useState({
    projects: [],
    posts: [],
    contacts: [],
    applications: [],
    jobs: [],
    subscribers: [],
    crm: null,
  });
  const userJson = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userJson ? JSON.parse(userJson) : null;

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

  const startOfDay = (d) => {
    const out = new Date(d);
    out.setHours(0, 0, 0, 0);
    return out;
  };

  const addDays = (d, days) => {
    const out = new Date(d);
    out.setDate(out.getDate() + days);
    return out;
  };

  const safeArray = (res) => (Array.isArray(res?.data) ? res.data : []);

  const fetchDashboard = async (opts = { initial: false }) => {
    const isInitial = !!opts.initial;
    try {
      if (isInitial) setLoading(true);
      else setRefreshing(true);

      const results = await Promise.allSettled([
        api.get('/projects'),
        api.get('/blog'),
        api.get('/contact'),
        api.get('/applications'),
        api.get('/jobs/all'),
        api.get('/newsletter'),
        api.get('/crm/dashboard'),
      ]);

      const pick = (idx) => (results[idx]?.status === 'fulfilled' ? results[idx].value : null);
      const projectsRes = pick(0);
      const postsRes = pick(1);
      const contactsRes = pick(2);
      const applicationsRes = pick(3);
      const jobsRes = pick(4);
      const subscribersRes = pick(5);
      const crmRes = pick(6);

      setPayload({
        projects: safeArray(projectsRes),
        posts: safeArray(postsRes),
        contacts: safeArray(contactsRes),
        applications: safeArray(applicationsRes),
        jobs: safeArray(jobsRes),
        subscribers: safeArray(subscribersRes),
        crm: crmRes?.data || null,
      });
    } finally {
      if (isInitial) setLoading(false);
      else setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard({ initial: true });
  }, []);

  const now = useMemo(() => new Date(), [refreshing, loading]);
  const today = useMemo(() => startOfDay(now), [now]);
  const start7 = useMemo(() => startOfDay(addDays(today, -6)), [today]);
  const startPrev7 = useMemo(() => startOfDay(addDays(today, -13)), [today]);
  const endPrev7 = useMemo(() => addDays(start7, -1), [start7]);
  const start30 = useMemo(() => startOfDay(addDays(today, -29)), [today]);

  const countInRange = (items, key, start, end) => (items || []).reduce((acc, it) => {
    const d = parseDateValue(it?.[key]);
    if (!d) return acc;
    const ts = d.getTime();
    if (ts >= start.getTime() && ts <= end.getTime()) return acc + 1;
    return acc;
  }, 0);

  const trendDelta = (items, key) => {
    const current = countInRange(items, key, start7, today);
    const prev = countInRange(items, key, startPrev7, endPrev7);
    const delta = current - prev;
    return { current, prev, delta };
  };

  const buildDailySeries = (items, key, days) => {
    const start = startOfDay(addDays(today, -(days - 1)));
    const buckets = new Map();
    for (let i = 0; i < days; i += 1) {
      const d = addDays(start, i);
      const k = d.toISOString().slice(0, 10);
      buckets.set(k, 0);
    }
    (items || []).forEach((it) => {
      const d = parseDateValue(it?.[key]);
      if (!d) return;
      const k = startOfDay(d).toISOString().slice(0, 10);
      if (buckets.has(k)) buckets.set(k, (buckets.get(k) || 0) + 1);
    });
    return Array.from(buckets.entries()).map(([k, v]) => ({
      label: k.slice(5).replace('-', '/'),
      value: v,
    }));
  };

  const contactsTrend = useMemo(() => trendDelta(payload.contacts, 'created_at'), [payload.contacts, start7, today, startPrev7, endPrev7]);
  const applicationsTrend = useMemo(() => trendDelta(payload.applications, 'created_at'), [payload.applications, start7, today, startPrev7, endPrev7]);
  const postsCreated30 = useMemo(() => countInRange(payload.posts, 'created_at', start30, today), [payload.posts, start30, today]);
  const projectsCreated30 = useMemo(() => countInRange(payload.projects, 'created_at', start30, today), [payload.projects, start30, today]);

  const contactsSeries = useMemo(() => buildDailySeries(payload.contacts, 'created_at', 14), [payload.contacts, today]);
  const applicationsSeries = useMemo(() => buildDailySeries(payload.applications, 'created_at', 14), [payload.applications, today]);

  const recentContacts = useMemo(() => (payload.contacts || []).slice(0, 5), [payload.contacts]);
  const recentApplications = useMemo(() => (payload.applications || []).slice(0, 5), [payload.applications]);
  const recentPayments = useMemo(() => (payload.crm?.recent?.payments || []).slice(0, 5), [payload.crm]);

  const crmSummary = payload.crm?.summary || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-6 page-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Tableau de bord</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">
            {user?.name ? (
              <>Bon retour, <span className="text-[#1A3A5C] font-bold">{user.name}</span></>
            ) : (
              <>Aperçu de l'activité</>
            )}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => fetchDashboard({ initial: false })}
          className="gap-2 w-full sm:w-auto justify-center"
        >
          {refreshing ? <LoadingSpinner size="sm" /> : <RefreshCcw size={16} />}
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={Briefcase}
          label="Projets"
          value={String((payload.projects || []).length)}
          trend={`${projectsCreated30 >= 0 ? '+' : ''}${projectsCreated30} (30j)`}
        />
        <StatCard
          icon={FileText}
          label="Articles"
          value={String((payload.posts || []).length)}
          trend={`${postsCreated30 >= 0 ? '+' : ''}${postsCreated30} (30j)`}
        />
        <StatCard
          icon={Phone}
          label="Contacts (7j)"
          value={String(contactsTrend.current)}
          trend={`${contactsTrend.delta >= 0 ? '+' : ''}${contactsTrend.delta} vs 7j`}
        />
        <StatCard
          icon={Send}
          label="Candidatures (7j)"
          value={String(applicationsTrend.current)}
          trend={`${applicationsTrend.delta >= 0 ? '+' : ''}${applicationsTrend.delta} vs 7j`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-[hsla(210,30%,20%,1)]">Actions rapides</h2>
          <div className="grid grid-cols-1 gap-3">
            <QuickAction icon={Plus} label="Ajouter un Projet" to="/admin/projects" />
            <QuickAction icon={PenTool} label="Écrire un Article" to="/admin/blog/articles" />
            <QuickAction icon={Upload} label="Uploader un Média" to="/admin/media" />
            <QuickAction icon={Users} label="Analyse CRM" to="/admin/crm" />
          </div>

          <Card>
            <CardHeader title="CRM (30j)" subtitle="Encaissements et facturation" />
            <CardContent className="space-y-3">
              {crmSummary ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-[hsla(210,20%,40%,1)]">Total facturé</div>
                    <div className="text-sm font-extrabold text-[hsla(210,30%,20%,1)]">{formatMoney(crmSummary.total_billed)} GNF</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-[hsla(210,20%,40%,1)]">Encaissements</div>
                    <div className="text-sm font-extrabold text-[hsla(210,30%,20%,1)]">{formatMoney(crmSummary.total_collected)} GNF</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-[hsla(210,20%,40%,1)]">Solde restant</div>
                    <div className="text-sm font-extrabold text-[hsla(210,30%,20%,1)]">{formatMoney(crmSummary.total_outstanding)} GNF</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-[hsla(210,20%,40%,1)]">Taux de recouvrement</div>
                    <div className="text-sm font-extrabold text-[hsla(210,30%,20%,1)]">{Number(crmSummary.collection_rate || 0).toFixed(2)}%</div>
                  </div>
                </>
              ) : (
                <div className="text-sm font-medium text-[hsla(210,15%,55%,1)]">
                  Statistiques CRM indisponibles.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader title="Aperçu" subtitle="Activité sur 14 jours" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[#E0E6ED] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Contacts</div>
                  <div className="text-xs font-semibold text-[hsla(210,20%,40%,1)]">{contactsTrend.current} (7j)</div>
                </div>
                <MiniLineChart points={contactsSeries} color="#1A3A5C" />
              </div>
              <div className="rounded-2xl border border-[#E0E6ED] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Candidatures</div>
                  <div className="text-xs font-semibold text-[hsla(210,20%,40%,1)]">{applicationsTrend.current} (7j)</div>
                </div>
                <MiniLineChart points={applicationsSeries} color="#4CAF8D" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="rounded-2xl border border-[#E0E6ED] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Offres d'emploi</div>
                  <div className="text-sm font-extrabold text-[hsla(210,30%,20%,1)]">{(payload.jobs || []).length}</div>
                </div>
                <div className="text-xs font-medium text-[hsla(210,20%,40%,1)] mt-2">
                  Visibles: {(payload.jobs || []).filter((j) => !!j.is_visible).length}
                </div>
              </div>
              <div className="rounded-2xl border border-[#E0E6ED] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Newsletter</div>
                  <div className="text-sm font-extrabold text-[hsla(210,30%,20%,1)]">{(payload.subscribers || []).length}</div>
                </div>
                <div className="text-xs font-medium text-[hsla(210,20%,40%,1)] mt-2">
                  Actifs: {(payload.subscribers || []).filter((s) => !!s.is_active).length}
                </div>
              </div>
              <div className="rounded-2xl border border-[#E0E6ED] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">CRM</div>
                  <div className="text-sm font-extrabold text-[hsla(210,30%,20%,1)]">{formatMoney(crmSummary?.total_collected || 0)} GNF</div>
                </div>
                <div className="text-xs font-medium text-[hsla(210,20%,40%,1)] mt-2 flex items-center gap-2">
                  <Wallet size={14} />
                  Encaissé (période CRM)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader title="Derniers messages" subtitle="Contacts reçus" />
          <CardContent className="space-y-3">
            {recentContacts.length ? (
              recentContacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-4 rounded-xl border border-[#E0E6ED] bg-white px-4 py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[hsla(210,30%,20%,1)] truncate">{c.full_name || 'Contact'}</div>
                    <div className="text-xs font-medium text-[hsla(210,20%,40%,1)] truncate">{c.email || '—'}</div>
                  </div>
                  <div className="text-xs font-semibold text-[hsla(210,20%,40%,1)]">{formatDateFr(c.created_at)}</div>
                </div>
              ))
            ) : (
              <div className="text-sm font-medium text-[hsla(210,15%,55%,1)]">Aucun message.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Dernières opérations" subtitle="Candidatures et paiements" />
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-[#E0E6ED] bg-white p-4 space-y-2">
              <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Candidatures</div>
              {recentApplications.length ? (
                recentApplications.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[hsla(210,20%,40%,1)] truncate">
                        {`${a.first_name || ''} ${a.last_name || ''}`.trim() || 'Candidat'}
                      </div>
                      <div className="text-[11px] font-medium text-[hsla(210,20%,40%,1)] truncate">
                        {a.job?.title || '—'}
                      </div>
                    </div>
                    <div className="text-[11px] font-semibold text-[hsla(210,20%,40%,1)]">{formatDateFr(a.created_at)}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm font-medium text-[hsla(210,15%,55%,1)]">Aucune candidature.</div>
              )}
            </div>

            <div className="rounded-xl border border-[#E0E6ED] bg-white p-4 space-y-2">
              <div className="text-sm font-bold text-[hsla(210,30%,20%,1)]">Paiements (CRM)</div>
              {recentPayments.length ? (
                recentPayments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-[hsla(210,20%,40%,1)] truncate">
                      {formatDateFr(p.payment_date)} · {p.invoice?.invoice_number || `#${p.invoice_id || '—'}`}
                    </div>
                    <div className="text-xs font-extrabold text-[hsla(210,30%,20%,1)]">{formatMoney(p.amount)} GNF</div>
                  </div>
                ))
              ) : (
                <div className="text-sm font-medium text-[hsla(210,15%,55%,1)]">Aucun paiement.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
