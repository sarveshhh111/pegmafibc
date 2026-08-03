import React from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { ActiveTab } from '../../types';
import { PegmaLogo } from '../common/PegmaLogo';
import { 
  Sliders, 
  LayoutDashboard, 
  BookOpen,
  History, 
  Grid, 
  Heart, 
  FolderCheck, 
  Terminal, 
  Settings, 
  HelpCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const SidebarNav: React.FC = () => {
  const { activeTab, setActiveTab } = useConfigurator();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'configurator', label: 'CONFIGURATOR', icon: <Sliders className="w-4 h-4" /> },
    { id: 'dashboard', label: 'DASHBOARD', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'references', label: 'REFERENCE LIBRARY', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'history', label: 'HISTORY', icon: <History className="w-4 h-4" /> },
    { id: 'templates', label: 'TEMPLATES', icon: <Grid className="w-4 h-4" /> },
    { id: 'favorites', label: 'FAVORITES', icon: <Heart className="w-4 h-4" /> },
    { id: 'saved', label: 'MY PROJECTS', icon: <FolderCheck className="w-4 h-4" /> },
    { id: 'admin', label: 'PROMPT LOGS', icon: <Terminal className="w-4 h-4" /> },
    { id: 'settings', label: 'SETTINGS', icon: <Settings className="w-4 h-4" /> },
    { id: 'help', label: 'HELP & SUPPORT', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col justify-between border-r border-pegma-border dark:border-dark-border bg-white/50 dark:bg-slate-900/50 p-4 transition-colors min-h-[calc(100vh-65px)]">
      
      {/* Primary Navigation List */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-150 ${
                isActive
                  ? 'bg-pegma-red text-white shadow-md shadow-pegma-red/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom PEGMA Brand Card */}
      <div className="mt-8 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-soft text-center space-y-3">
        <div className="flex justify-center">
          <PegmaLogo size="lg" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Pegma Bulk Packaging Solutions
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Smart. Strong. Sustainable.
          </p>
        </div>
        <div className="flex justify-center items-center space-x-1.5 text-[11px] text-slate-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-pegma-success" />
          <span>ISO 9001:2015 Certified</span>
        </div>
        <a
          href="https://pegma.in"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <span>Visit Website</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </aside>
  );
};
