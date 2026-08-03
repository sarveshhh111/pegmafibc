import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-pegma-border dark:border-dark-border py-4 px-8 mt-auto text-xs text-slate-500 dark:text-dark-muted transition-colors">
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div>
          © {new Date().getFullYear()} <span className="font-bold text-pegma-dark dark:text-white">PEGMA Bulk Packaging Solutions</span>. All rights reserved. Powered by Google Gemini AI.
        </div>

        <div className="flex items-center space-x-6 font-medium">
          <a href="#privacy" className="hover:text-pegma-red transition">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-pegma-red transition">
            Terms of Service
          </a>
          <a href="#contact" className="hover:text-pegma-red transition">
            Contact Us
          </a>
        </div>

      </div>
    </footer>
  );
};
