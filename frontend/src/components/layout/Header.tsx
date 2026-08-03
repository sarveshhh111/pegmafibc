import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { useAuth } from '../../context/AuthContext';
import { PegmaLogo } from '../common/PegmaLogo';
import { Sun, Moon, Bookmark, Share2, Sparkles, Check, Copy, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { saveCurrentConfig, showToast, config } = useConfigurator();
  const { user, logout } = useAuth();
  const [isCopied, setIsCopied] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    showToast("Shareable link copied to clipboard");
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveTitle.trim()) return;
    await saveCurrentConfig(saveTitle);
    setSaveTitle('');
    setIsSaveModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-pegma-border dark:border-dark-border px-6 py-3 transition-colors">
      <div className="flex items-center justify-between max-w-[1800px] mx-auto">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {/* Official PEGMA Red Pebble Logo */}
            <PegmaLogo size="md" />
            <div className="h-7 w-px bg-pegma-border dark:bg-dark-border" />
          </div>
          <div>
            <h1 className="text-base font-bold text-pegma-dark dark:text-dark-text tracking-tight leading-none">
              FIBC Bag Configurator
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-dark-muted mt-0.5">
              AI-Powered Industrial Product Visualizer
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Save Config */}
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            <span>Save</span>
          </button>

          {/* Share Link */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-pegma-success" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{isCopied ? "Copied!" : "Share"}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <div className="h-6 w-px bg-pegma-border dark:bg-dark-border" />

          {/* User Profile Pill & Logout */}
          <div className="flex items-center space-x-2 pl-1">
            <div className="w-7 h-7 rounded-full bg-pegma-red text-white text-xs font-bold flex items-center justify-center shadow-sm">
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'PA'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-none">
                {user?.username || 'pegmaadmin'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Admin
              </span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 ml-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Save Config Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Save FIBC Configuration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Give this specification setup a title to easily reload or share later.
            </p>
            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Configuration Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1000kg Food Grade Skirt Top"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pegma-red dark:text-white"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-pegma-red hover:bg-pegma-red-hover rounded-xl shadow-md transition"
                >
                  Save Specification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
