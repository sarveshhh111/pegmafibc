import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PegmaLogo } from '../common/PegmaLogo';
import { Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, authError } = useAuth();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(usernameInput, passwordInput);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center bg-gradient-to-b from-pegma-bg via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 transition-colors font-sans">
      
      {/* Top Bar Badge */}
      <div className="w-full max-w-md pt-4 flex justify-center">
        <div className="inline-flex items-center space-x-2 bg-pegma-red/10 border border-pegma-red/20 px-3 py-1 rounded-full text-pegma-red text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PEGMA Enterprise Portal</span>
        </div>
      </div>

      {/* Center Glassmorphism Login Card */}
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <PegmaLogo size="xl" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              FIBC Bag Configurator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              AI-Powered Industrial Product Visualizer
            </p>
          </div>
        </div>

        {/* Auth Error Notification */}
        {authError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 text-xs font-semibold text-center">
            {authError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Enter username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pegma-red dark:text-white"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-pegma-red dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-pegma-red hover:bg-pegma-red-hover text-white font-bold rounded-2xl shadow-glow transition transform active:scale-95 text-xs flex items-center justify-center space-x-2"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} PEGMA Bulk Packaging Solutions. All rights reserved.
      </div>

    </div>
  );
};
