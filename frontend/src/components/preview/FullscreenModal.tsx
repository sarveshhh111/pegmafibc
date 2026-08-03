import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Download, Sparkles } from 'lucide-react';

interface FullscreenModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onDownloadPNG: () => void;
}

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
  imageUrl,
  isOpen,
  onClose,
  onDownloadPNG
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.3, 0.8));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-between p-6">
        
        {/* Top Control Bar */}
        <div className="w-full max-w-6xl flex items-center justify-between z-10 text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-pegma-red px-3 py-1 rounded-full text-xs font-black tracking-tight">
              PEGMA AI
            </div>
            <span className="text-sm font-semibold text-slate-300">
              High Resolution FIBC Product Inspection
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-slate-300 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-400 w-12 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-slate-300 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-slate-700" />

            <button
              onClick={onDownloadPNG}
              className="flex items-center space-x-1.5 px-4 py-2 bg-pegma-red hover:bg-pegma-red-hover text-white rounded-xl text-xs font-bold shadow-lg transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download HD</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-slate-300 transition"
              title="Close Fullscreen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Image Container */}
        <div className="flex-1 w-full flex items-center justify-center overflow-auto p-4">
          <motion.img
            src={imageUrl}
            alt="PEGMA FIBC Bag High Res Inspection"
            animate={{ scale: zoomLevel }}
            transition={{ duration: 0.2 }}
            className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl bg-white p-4"
          />
        </div>

        {/* Bottom Info Bar */}
        <div className="text-xs font-medium text-slate-400">
          Scroll or click zoom buttons to inspect texture weave, loops, and printing quality.
        </div>

      </div>
    </AnimatePresence>
  );
};
