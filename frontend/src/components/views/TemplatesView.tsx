import React, { useEffect, useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { fetchTemplates } from '../../services/api';
import { PresetTemplate } from '../../types';
import { Grid, ArrowRight, ShieldCheck, Award, Box, Sparkles } from 'lucide-react';

export const TemplatesView: React.FC = () => {
  const { setFullConfig, setActiveTab, showToast } = useConfigurator();
  const [templates, setTemplates] = useState<PresetTemplate[]>([]);

  useEffect(() => {
    fetchTemplates().then(setTemplates);
  }, []);

  const handleApplyTemplate = (tmpl: PresetTemplate) => {
    setFullConfig(tmpl.config_json);
    setActiveTab('configurator');
    showToast(`Applied '${tmpl.title}' template`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Industrial FIBC Templates Library
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Pre-configured ISO-compliant specifications tailored for various industries (Pharma, Mining, Chemicals, Agriculture).
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft hover:shadow-lg transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full">
                  {tmpl.category}
                </span>
                {tmpl.badge && (
                  <span className="text-[11px] font-extrabold text-pegma-red bg-pegma-red/10 px-3 py-1 rounded-full border border-pegma-red/20">
                    {tmpl.badge}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {tmpl.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {tmpl.description}
              </p>

              {/* Spec Highlights Pill List */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Construction:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{tmpl.config_json.bagType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Capacity:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{tmpl.config_json.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fabric & GSM:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{tmpl.config_json.fabricColor}, {tmpl.config_json.gsm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Top / Bottom:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{tmpl.config_json.top} / {tmpl.config_json.bottom}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleApplyTemplate(tmpl)}
              className="w-full py-3 bg-pegma-red hover:bg-pegma-red-hover text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Customize Template</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
