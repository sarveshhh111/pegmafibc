import React, { useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { 
  Sparkles, 
  Download, 
  Maximize2, 
  Copy, 
  RefreshCw, 
  Check, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  X,
  Box,
  CheckCircle2,
  GitBranch,
  Wrench,
  FileCode
} from 'lucide-react';

export const ImagePreviewPanel: React.FC = () => {
  const { currentImage, isGenerating, config, generateImage, showToast } = useConfigurator();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<'render' | 'exploded'>('render');
  const [isCopiedPrompt, setIsCopiedPrompt] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);

  const downloadImage = (format: 'png' | 'jpg') => {
    if (!currentImage) return;
    const targetUrl = activeViewTab === 'exploded' && currentImage.exploded_image_url 
      ? currentImage.exploded_image_url 
      : currentImage.image_url;
      
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = `PEGMA_${config.bagType.replace(/\s+/g, '_')}_${activeViewTab.toUpperCase()}_SPEC.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${activeViewTab.toUpperCase()} view (${format.toUpperCase()})`);
  };

  const copyPromptToClipboard = () => {
    if (!currentImage) return;
    const promptText = activeViewTab === 'exploded' && currentImage.exploded_prompt 
      ? currentImage.exploded_prompt 
      : currentImage.prompt;

    navigator.clipboard.writeText(promptText);
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
              AI GENERATED VISUALIZER
            </h3>
            
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-pegma-red/20 text-pegma-red text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-pegma-red" />
              <span>Powered by Gemini</span>
            </div>
          </div>

          {/* Render Mode Toggle & Action Icons */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* View Mode Switcher Pills */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setActiveViewTab('render')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  activeViewTab === 'render'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                3D Product Render
              </button>
              <button
                onClick={() => setActiveViewTab('exploded')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center space-x-1 ${
                  activeViewTab === 'exploded'
                    ? 'bg-pegma-red text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <GitBranch className="w-3 h-3" />
                <span>Exploded CAD View</span>
              </button>
            </div>

            <div className="flex items-center space-x-1.5">
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

        </div>

        {/* Large Product Image Canvas Area */}
        <div className="relative my-4 flex items-center justify-center min-h-[460px] bg-slate-50/60 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-4">
          {currentImage ? (
            <img
              src={
                activeViewTab === 'exploded' && currentImage.exploded_image_url 
                  ? currentImage.exploded_image_url 
                  : currentImage.image_url
              }
              alt={`PEGMA ${config.bagType} FIBC ${activeViewTab === 'exploded' ? 'Exploded View' : 'Product Render'}`}
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
                  Select specifications on the left panel and click 'Generate Image' to render photorealistic product images & exploded CAD views via Gemini AI.
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
            <span>AI generated product visualizer & exploded assembly CAD rendering.</span>
          </div>
          {currentImage && (
            <div className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {currentImage.generation_time_sec}s • {currentImage.model_used}
            </div>
          )}
        </div>

      </div>

      {/* EXPLODED VIEW COMPONENT BREAKDOWN PANEL (Show when exploded view active or image generated) */}
      {currentImage && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-pegma-red" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                EXPLODED ASSEMBLY COMPONENT BREAKDOWN
              </h4>
            </div>
            <button
              onClick={() => setShowPromptModal(true)}
              className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 hover:text-pegma-red transition"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>View Exploded Prompt</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { num: '01', title: 'Top Closure', val: config.top || 'Duffle Top', desc: 'Drawstring gathered skirt' },
              { num: '02', title: 'Lifting Loops', val: `${config.loopType} (${config.loopColor})`, desc: 'Heavy duty woven webbing' },
              { num: '03', title: 'Inner Barrier', val: config.linerType || 'PE Liner', desc: 'Moisture barrier layer' },
              { num: '04', title: 'PP Shell', val: `${config.bagType} (${config.gsm})`, desc: 'Woven PP body fabric' },
              { num: '05', title: 'Bottom Spout', val: config.bottom || 'Discharge Spout', desc: 'Release tie spout' },
            ].map((comp) => (
              <div key={comp.num} className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-mono font-black text-pegma-red">{comp.num}</div>
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">{comp.title}</div>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate">{comp.val}</div>
                <div className="text-[10px] text-slate-400 truncate">{comp.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center space-x-3 shadow-soft">
          <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950 text-pegma-red">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-white">8K Resolution</div>
            <div className="text-[10px] text-slate-500">Gemini AI Synthesis</div>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center space-x-3 shadow-soft">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-white">Exploded CAD</div>
            <div className="text-[10px] text-slate-500">Assembly Diagram</div>
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

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center space-x-3 shadow-soft">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-white">ISO Certified</div>
            <div className="text-[10px] text-slate-500">Packaging Spec</div>
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
            src={
              activeViewTab === 'exploded' && currentImage.exploded_image_url 
                ? currentImage.exploded_image_url 
                : currentImage.image_url
            }
            alt="Fullscreen Product Visualizer"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />

          <div className="mt-4 flex items-center space-x-4">
            <span className="text-xs text-white font-mono bg-slate-800 px-3 py-1 rounded-xl">
              {config.bagType} • {config.capacity} ({activeViewTab.toUpperCase()} VIEW)
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

      {/* Exploded Prompt Modal */}
      {showPromptModal && currentImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Gemini Exploded View CAD Directive
              </h4>
              <button onClick={() => setShowPromptModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
                {currentImage.exploded_prompt || currentImage.prompt}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowPromptModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
