import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  const [progress, setProgress] = useState(15);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "Synthesizing 3D Polypropylene Mesh Geometry...",
    "Applying Loop Webbing & High-Tenacity Stitching...",
    "Rendering Printed PEGMA Logo & Specifications...",
    "Simulating Studio Lighting & Soft Ambient Shadows...",
    "Finalizing Gemini Image Generation Payload..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        return prev + Math.floor(Math.random() * 12) + 5;
      });
    }, 350);

    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden flex flex-col items-center justify-center p-8 text-center space-y-6">
      
      {/* Background Shimmer Pattern */}
      <div className="absolute inset-0 skeleton-shimmer opacity-40" />

      {/* Central Animated AI Pulsing Core */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-tr from-pegma-red via-rose-500 to-amber-400 p-1 shadow-glow flex items-center justify-center"
      >
        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[22px] flex items-center justify-center">
          <Cpu className="w-10 h-10 text-pegma-red animate-pulse" />
        </div>
      </motion.div>

      {/* Loading Title & Animated Step Description */}
      <div className="relative z-10 space-y-2 max-w-md">
        <div className="flex items-center justify-center space-x-2 text-xs font-black uppercase text-pegma-red tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>GEMINI AI IMAGE SYNTHESIS</span>
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">
          Generating Photorealistic Product Preview
        </h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 h-6">
          {steps[stepIndex]}
        </p>
      </div>

      {/* Dynamic Progress Bar */}
      <div className="relative z-10 w-full max-w-xs space-y-1.5">
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-pegma-red to-amber-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
          <span>Processing Prompt</span>
          <span>{progress}%</span>
        </div>
      </div>

    </div>
  );
};
