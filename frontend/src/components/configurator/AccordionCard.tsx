import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionCardProps {
  stepNumber: number;
  title: string;
  valueDisplay: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const AccordionCard: React.FC<AccordionCardProps> = ({
  stepNumber,
  title,
  valueDisplay,
  icon,
  defaultOpen = false,
  children
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shadow-soft overflow-hidden transition-all duration-200">
      
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/80 dark:hover:bg-slate-750 transition-colors"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 shadow-inner">
            {icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                {stepNumber}. {title}
              </span>
            </div>
            <div className="text-sm font-semibold text-pegma-dark dark:text-white leading-snug">
              {valueDisplay}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg transition-transform duration-200 ${isOpen ? 'rotate-180 bg-slate-100 dark:bg-slate-700' : ''}`}>
            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </button>

      {/* Accordion Content Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="p-4 pt-1 border-t border-slate-100 dark:border-slate-700/50 space-y-3 bg-slate-50/40 dark:bg-slate-800/40">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
