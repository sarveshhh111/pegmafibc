import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { setApiKey } from '../../services/api';
import { Key, Moon, Sun, ShieldCheck, Check, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { showToast } = useConfigurator();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    const ok = await setApiKey(apiKeyInput);
    if (ok) {
      setIsSaved(true);
      showToast("Gemini API Key updated successfully");
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          System & API Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage Google Gemini API credentials and application preferences
        </p>
      </div>

      {/* Gemini API Key Configuration Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-2xl bg-pegma-red/10 text-pegma-red">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Google Gemini Image API Key
            </h3>
            <p className="text-xs text-slate-500">
              Provide your API key to generate images directly via Google Imagen 3 / Gemini Nano Banana
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveKey} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pegma-red font-mono dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="flex items-center space-x-2 px-5 py-2.5 bg-pegma-red hover:bg-pegma-red-hover text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? "Saved!" : "Save Gemini Key"}</span>
          </button>
        </form>
      </div>

      {/* Theme Preference Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            {isDarkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-slate-600" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Interface Theme Mode
            </h3>
            <p className="text-xs text-slate-500">
              Switch between Industrial White Mode and Sleek Dark CAD Mode
            </p>
          </div>
        </div>

        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition"
        >
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>

    </div>
  );
};
