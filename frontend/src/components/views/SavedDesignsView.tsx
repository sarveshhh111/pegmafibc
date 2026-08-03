import React, { useEffect, useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { fetchSavedConfigs } from '../../services/api';
import { SavedConfig } from '../../types';
import { FolderCheck, RotateCcw, Calendar, FileText, Sparkles } from 'lucide-react';

export const SavedDesignsView: React.FC = () => {
  const { setFullConfig, setActiveTab, showToast } = useConfigurator();
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);

  useEffect(() => {
    fetchSavedConfigs().then(setSavedConfigs);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          My Saved FIBC Projects
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Saved customer specification sheets and customized bag projects
        </p>
      </div>

      {savedConfigs.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <FolderCheck className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No saved projects yet
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            You can save custom FIBC configurations by clicking 'Save Configuration' in the Summary panel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedConfigs.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {item.config_json.bagType} • {item.config_json.capacity} Safe Working Load
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div>Fabric: {item.config_json.fabricColor} ({item.config_json.gsm})</div>
                <div>Top: {item.config_json.top}</div>
                <div>Bottom: {item.config_json.bottom}</div>
              </div>

              <button
                onClick={() => {
                  setFullConfig(item.config_json);
                  setActiveTab('configurator');
                  showToast(`Loaded saved project '${item.title}'`);
                }}
                className="w-full py-2.5 bg-pegma-red hover:bg-pegma-red-hover text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Open Project in Configurator</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
