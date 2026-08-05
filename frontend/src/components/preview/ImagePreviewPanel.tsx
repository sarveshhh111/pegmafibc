import React, { useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { 
  Sparkles, 
  Download, 
  Maximize2, 
  Copy, 
  RefreshCw, 
  Check, 
  Cpu, 
  ShieldCheck, 
  X,
  CheckCircle2
} from 'lucide-react';

export const ImagePreviewPanel: React.FC = () => {
  const { currentImage, isGenerating, config, generateImage, showToast } = useConfigurator();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopiedPrompt, setIsCopiedPrompt] = useState(false);

  const downloadImage = (format: 'png' | 'jpg') => {
    if (!currentImage) return;
    const targetUrl = currentImage.image_url;
      
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = `PEGMA_${config.bagType.replace(/\s+/g, '_')}_PRODUCT_RENDER.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded Product Render (${format.toUpperCase()})`);
  };

  const copyPromptToClipboard = () => {
    if (!currentImage) return;
    navigator.clipboard.writeText(currentImage.prompt);
    setIsCopiedPrompt(true);
    showToast("Backend prompt copied to clipboard");
    setTimeout(() => setIsCopiedPrompt(false), 2000);
  };

  return (
    <div className="flex flex-col space-y-4">
      
      {/* Primary Card */}
      <div className="relative w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden p-6 transition-colors">
        
        {/* Top Header Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          
          <div className="flex items-center space-x-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              AI GENERATED PRODUCT VISUALIZER
            </h3>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
              title="Fullscreen View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => downloadImage('png')}
              className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
              title="Download PNG"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={copyPromptToClipboard}
              className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
              title="Copy Backend Prompt"
            >
              {isCopiedPrompt ? <Check className="w-4 h-4 text-pegma-success" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={generateImage}
              disabled={isGenerating}
              className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition disabled:opacity-50"
              title="Regenerate Image"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>

        {/* Large Product Image Canvas Area */}
        <div className="relative my-4 flex items-center justify-center min-h-[460px] bg-slate-50/60 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-4">
          {currentImage ? (
            <img
              src={currentImage.image_url}
              alt={`PEGMA ${config.bagType} FIBC Product Render`}
              className="max-h-[520px] w-auto object-contain transition-transform duration-300 hover:scale-[1.01]"
            />
          ) : (
            <div className="text-center space-y-4 max-w-sm py-12 px-6">
              <div className="w-16 h-16 rounded-3xl bg-pegma-red/10 border border-pegma-red/20 text-pegma-red flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-800 dark:text-white">
                  Ready to Synthesize Product Image
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select specifications on the left panel and click 'Generate Image' to render photorealistic product images.
                </p>
              </div>
              <button
                onClick={generateImage}
                disabled={isGenerating}
                className="w-full py-3 px-6 bg-pegma-red hover:bg-pegma-red-hover text-white font-bold rounded-2xl text-xs shadow-glow transition transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Image</span>
              </button>
            </div>
          )}
        </div>

        {/* Disclaimers & Generation Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 text-[11px] text-slate-400 dark:text-slate-500 gap-2">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
            <span>AI generated photorealistic FIBC product visualizer.</span>
          </div>
          {currentImage && (
            <div className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {currentImage.generation_time_sec}s
            </div>
          )}
        </div>

      </div>

      {/* Feature Highlights Bar */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center space-x-3 shadow-soft">
          <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950 text-pegma-red">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-white">8K Resolution</div>
            <div className="text-[10px] text-slate-500">Photorealistic Synthesis</div>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center space-x-3 shadow-soft">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-white">Realistic Weave</div>
            <div className="text-[10px] text-slate-500">High-Density PP</div>
          </div>
        </div>
      </div>

      {/* Fullscreen Inspection Modal */}
      {isFullscreen && currentImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 text-white bg-slate-800 hover:bg-slate-700 rounded-2xl transition"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={currentImage.image_url}
            alt="Fullscreen Product Visualizer"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />

          <div className="mt-4 flex items-center space-x-4">
            <span className="text-xs text-white font-mono bg-slate-800 px-3 py-1 rounded-xl">
              {config.bagType} • {config.capacity}
            </span>
            <button
              onClick={() => downloadImage('png')}
              className="px-4 py-2 bg-pegma-red text-white text-xs font-bold rounded-xl flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
