import React, { useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { RecentGenerations } from './RecentGenerations';
import { 
  Download, 
  Bookmark, 
  Share2, 
  Box, 
  Weight, 
  Palette, 
  Maximize2, 
  Minimize2, 
  Printer, 
  CheckSquare, 
  Check,
  FileSpreadsheet
} from 'lucide-react';

export const SummaryPanel: React.FC = () => {
  const { config, currentImage, saveCurrentConfig, showToast } = useConfigurator();
  const [isCopied, setIsCopied] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = () => {
    if (!currentImage?.image_url) {
      showToast("Please generate an image first");
      return;
    }
    const link = document.createElement('a');
    link.href = currentImage.image_url;
    link.download = `PEGMA_FIBC_${config.bagType.replace(/\s+/g, '_')}_${config.capacity}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded FIBC Image");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    showToast("Configuration link copied to clipboard");
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveTitle.trim()) return;
    await saveCurrentConfig(saveTitle);
    setSaveTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col space-y-5">
      
      {/* Configuration Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft p-5 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            CONFIGURATION SUMMARY
          </h3>
          <span className="text-[10px] font-bold text-pegma-red bg-pegma-red/10 px-2 py-0.5 rounded-md">
            Live Spec
          </span>
        </div>

        {/* Spec Rows */}
        <div className="space-y-2.5 text-xs">
          
          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
              <Box className="w-3.5 h-3.5" />
              <span>Bag Type</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{config.bagType}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
              <Weight className="w-3.5 h-3.5" />
              <span>Capacity</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{config.capacity}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
              <Palette className="w-3.5 h-3.5" />
              <span>Fabric</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{config.fabricColor}, {config.gsm}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Top</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{config.top}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Bottom</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{config.bottom}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
              <Box className="w-3.5 h-3.5" />
              <span>Loops</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{config.loopType}, {config.loopColor}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
              <Printer className="w-3.5 h-3.5" />
              <span>Printing</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px] text-right">
              {config.printing || 'None'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Accessories</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {config.accessories?.length || 0} Selected
            </span>
          </div>

        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 space-y-2">
          
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-pegma-red hover:bg-pegma-red-hover text-white font-bold rounded-2xl shadow-md transition transform active:scale-[0.99] text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Image</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold rounded-2xl transition text-xs"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span>Save Configuration</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold rounded-2xl transition text-xs"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-pegma-success" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isCopied ? "Link Copied!" : "Share Configuration"}</span>
          </button>

        </div>

      </div>

      {/* Embedded Recent Generations Gallery */}
      <RecentGenerations />

      {/* Save Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Save Specification Project
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter a name for this custom FIBC bag setup.
            </p>
            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chemical Grade 1250kg Q-Bag"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pegma-red dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-pegma-red hover:bg-pegma-red-hover rounded-xl shadow-md"
                >
                  Save Spec
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
