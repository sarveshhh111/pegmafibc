import React from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { Heart, Trash2, RotateCcw } from 'lucide-react';

export const RecentGenerations: React.FC = () => {
  const { history, toggleFavorite, removeHistoryItem, setFullConfig, setActiveTab } = useConfigurator();

  if (history.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        No recent generations yet. Select specs and click Generate!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          RECENT GENERATIONS
        </h4>
        <button
          onClick={() => setActiveTab('history')}
          className="text-xs font-bold text-pegma-red hover:underline"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {history.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-soft transition-all duration-200 hover:shadow-md"
          >
            <div className="aspect-square w-full bg-slate-50 dark:bg-slate-900 p-1 flex items-center justify-center">
              <img
                src={item.image_url}
                alt="FIBC Thumbnail"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Hover Overlay with Action Buttons */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 text-white">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="p-1 rounded-lg bg-white/20 hover:bg-white/40 transition"
                  title="Favorite"
                >
                  <Heart className={`w-3.5 h-3.5 ${item.is_favorite ? 'fill-pegma-red text-pegma-red' : 'text-white'}`} />
                </button>
                <button
                  onClick={() => removeHistoryItem(item.id)}
                  className="p-1 rounded-lg bg-white/20 hover:bg-rose-600 transition"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              <button
                onClick={() => setFullConfig(item.config_json)}
                className="w-full py-1 text-[10px] font-bold bg-pegma-red hover:bg-pegma-red-hover text-white rounded-lg flex items-center justify-center space-x-1"
                title="Reload this spec"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reload Spec</span>
              </button>
            </div>

            <div className="p-1.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate">
              {item.config_json?.bagType || 'Bag'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
