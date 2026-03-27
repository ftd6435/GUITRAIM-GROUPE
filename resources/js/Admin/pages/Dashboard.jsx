import React from 'react';
import {
  Briefcase,
  FileText,
  Phone,
  Send,
  Plus,
  PenTool,
  Upload
} from 'lucide-react';
import { cn } from '../../utils/utils';

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

const QuickAction = ({ icon: Icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E0E6ED] hover:border-[#1A3A5C] hover:bg-[hsla(210,25%,98%,1)] transition-all group"
  >
    <div className={cn("p-2 rounded-lg bg-[hsla(210,25%,98%,1)] group-hover:bg-[#1A3A5C] group-hover:text-white transition-colors", color)}>
      <Icon size={18} />
    </div>
    <span className="text-sm font-semibold text-[hsla(210,30%,20%,1)]">{label}</span>
  </button>
);

const Dashboard = () => {
  return (
    <div className="space-y-8 page-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Briefcase} label="Total Projets" value="24" trend="+3 ce mois" />
        <StatCard icon={FileText} label="Total Articles" value="156" trend="+12 ce mois" />
        <StatCard icon={Phone} label="Nouveaux Contacts" value="8" trend="+2 depuis hier" />
        <StatCard icon={Send} label="Candidatures" value="42" trend="+5 cette semaine" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-[hsla(210,30%,20%,1)] mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-1 gap-3">
            <QuickAction icon={Plus} label="Ajouter un Projet" onClick={() => console.log('Add Project')} />
            <QuickAction icon={PenTool} label="Écrire un Article" onClick={() => console.log('Write Article')} />
            <QuickAction icon={Upload} label="Uploader un Média" onClick={() => console.log('Upload Media')} />
          </div>
        </div>

        {/* Recent Activity / Placeholder for Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-[#E0E6ED] hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[hsla(210,30%,20%,1)]">Aperçu</h2>
            <select className="text-xs font-semibold bg-[hsla(210,25%,98%,1)] border border-[#E0E6ED] rounded-lg px-2 py-1 outline-none hover:border-[#1A3A5C] transition-colors">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
            </select>
          </div>
          <div className="h-64 bg-[hsla(210,25%,98%,1)] rounded-xl flex items-center justify-center text-[hsla(210,15%,55%,1)] text-sm italic border border-dashed border-[#E0E6ED]">
            La visualisation des données sera implémentée ici
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
