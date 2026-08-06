import React, { useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { clearHistory } from '../../services/api';
import { 
  Search, 
  Heart, 
  Trash2, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Filter 
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { history, toggleFavorite, removeHistoryItem, setFullConfig, setActiveTab, loadHistory, showToast } = useConfigurator();
  const [searchTerm, setSearchTerm] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filteredHistory = history.filter(item => {
    const term = searchTerm.trim().toLowerCase();
    if (!term && !favoritesOnly) return true;
    
    const promptMatch = term ? item.generated_prompt?.toLowerCase().includes(term) : true;
    const typeMatch = (term && typeof item.config_json === 'object' && item.config_json?.bagType) 
      ? item.config_json.bagType.toLowerCase().includes(term) 
      : false;
    const favMatch = favoritesOnly ? Boolean(item.is_favorite) : true;
    
    return (term ? (promptMatch || typeMatch) : true) && favMatch;
  });

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear all generation history?")) {
      await clearHistory();
      await loadHistory();
      showToast("Cleared generation history");
    }
  };

  const handleDownload = (imageUrl: string, bagType: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `PEGMA_${bagType.replace(/\s+/g, '_')}_History.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Generation History & Archive
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse previous FIBC bag configurations and generated Gemini product images
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search specifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pegma-red text-slate-800 dark:text-white w-60"
            />
          </div>

          {/* Favorites Filter Toggle */}
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition ${
              favoritesOnly
                ? 'bg-pegma-red text-white border-pegma-red'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-white' : ''}`} />
            <span>Favorites</span>
          </button>

          {/* Clear History */}
          <button
            onClick={handleClearAll}
            className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 rounded-xl transition text-xs font-semibold"
            title="Clear all history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History Grid */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No history records found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try tweaking your search term or generate a new FIBC bag product image in the Configurator tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-soft flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
                <img
                  src={item.image_url}
                  alt={item.config_json?.bagType}
                  className="max-h-44 object-contain"
                />
                
                {/* Favorite Badge */}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm hover:scale-110 transition"
                >
                  <Heart className={`w-4 h-4 ${item.is_favorite ? 'fill-pegma-red text-pegma-red' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Specs & Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <span>{item.model_used}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.config_json?.bagType} • {item.config_json?.capacity}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Fabric: {item.config_json?.fabricColor} ({item.config_json?.gsm}) • Loops: {item.config_json?.loopType} ({item.config_json?.loopColor})
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setFullConfig(item.config_json);
                      setActiveTab('configurator');
                    }}
                    className="flex-1 py-2 bg-pegma-red hover:bg-pegma-red-hover text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reload Spec</span>
                  </button>

                  <button
                    onClick={() => handleDownload(item.image_url, item.config_json?.bagType || 'FIBC')}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition"
                    title="Download Image"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => removeHistoryItem(item.id)}
                    className="p-2 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 rounded-xl transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
