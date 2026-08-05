import React, { useEffect, useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { fetchApiStats, fetchTemplates } from '../../services/api';
import { ApiUsageStats, PresetTemplate } from '../../types';
import { 
  Sparkles, 
  Cpu, 
  ArrowRight, 
  Sliders, 
  History, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { setActiveTab, setFullConfig } = useConfigurator();
  const [stats, setStats] = useState<ApiUsageStats | null>(null);
  const [templates, setTemplates] = useState<PresetTemplate[]>([]);

  useEffect(() => {
    fetchApiStats().then(setStats);
    fetchTemplates().then(setTemplates);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-pegma-dark rounded-3xl p-8 text-white shadow-2xl border border-slate-800">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-pegma-red/20 border border-pegma-red/40 px-3 py-1 rounded-full text-pegma-red text-xs font-extrabold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PEGMA INDUSTRIAL AI ENGINE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            FIBC Bag Specification & Visualizer
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Configure flexible intermediate bulk containers with millimeter accuracy. Generate high-fidelity 3D studio visual renders instantly.
          </p>
          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('configurator')}
              className="flex items-center space-x-2 px-5 py-2.5 bg-pegma-red hover:bg-pegma-red-hover text-white font-bold rounded-xl text-xs shadow-glow transition transform active:scale-95"
            >
              <Sliders className="w-4 h-4" />
              <span>Open Bag Configurator</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs backdrop-blur-md transition"
            >
              <History className="w-4 h-4" />
              <span>View Generation History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Renders</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{stats?.total_generations || 0}</div>
          <div className="text-[11px] text-slate-500">Synthesized product images</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Call Requests</div>
          <div className="text-2xl font-black text-pegma-red">{stats?.gemini_api_calls || 0}</div>
          <div className="text-[11px] text-slate-500">Photorealistic generations</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Vector Fallback</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats?.fallback_generations || 0}</div>
          <div className="text-[11px] text-slate-500">3D Vector fallback renders</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Engine Status</div>
          <div className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-1.5 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-pegma-success animate-pulse"></span>
            <span>{stats?.active_key ? 'Engine Active' : 'Procedural Ready'}</span>
          </div>
          <div className="text-[11px] text-slate-500">Fast visual response</div>
        </div>

      </div>

      {/* Preset Configurations Quick Load */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            POPULAR FIBC CONFIGURATIONS
          </h3>
          <button
            onClick={() => setActiveTab('configurator')}
            className="text-xs font-bold text-pegma-red hover:underline flex items-center space-x-1"
          >
            <span>Configure New Bag</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">
                    {tmpl.category}
                  </span>
                  {tmpl.badge && (
                    <span className="text-[10px] font-bold text-pegma-red bg-pegma-red/10 px-2 py-0.5 rounded-md">
                      {tmpl.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {tmpl.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {tmpl.description}
                </p>
              </div>

              <button
                onClick={() => {
                  setFullConfig(tmpl.config_json);
                  setActiveTab('configurator');
                }}
                className="w-full py-2 bg-slate-900 dark:bg-slate-800 hover:bg-pegma-red text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <span>Load Specification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
