import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ConfiguratorProvider, useConfigurator } from './context/ConfiguratorContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/layout/Header';
import { SidebarNav } from './components/layout/SidebarNav';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';

import { ConfiguratorPanel } from './components/configurator/ConfiguratorPanel';
import { ImagePreviewPanel } from './components/preview/ImagePreviewPanel';
import { SummaryPanel } from './components/summary/SummaryPanel';

import { DashboardView } from './components/views/DashboardView';
import { HistoryView } from './components/views/HistoryView';
import { TemplatesView } from './components/views/TemplatesView';
import { SavedDesignsView } from './components/views/SavedDesignsView';
import { AdminPromptLogsView } from './components/views/AdminPromptLogsView';
import { SettingsView } from './components/views/SettingsView';
import { HelpView } from './components/views/HelpView';

import { ProductReferenceLibraryView } from './components/views/ProductReferenceLibraryView';

const MainContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activeTab, toastMessage } = useConfigurator();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'references':
        return <ProductReferenceLibraryView />;
      case 'history':
      case 'favorites':
        return <HistoryView />;
      case 'templates':
        return <TemplatesView />;
      case 'saved':
        return <SavedDesignsView />;
      case 'admin':
        return <AdminPromptLogsView />;
      case 'settings':
        return <SettingsView />;
      case 'help':
        return <HelpView />;
      case 'configurator':
      default:
        return (
          /* Three Column Layout matching user requirement */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-[1800px] mx-auto">
            {/* LEFT COLUMN: Configurator Panel */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-4">
              <ConfiguratorPanel />
            </div>

            {/* CENTER COLUMN: Large AI Image Preview */}
            <div className="lg:col-span-8 xl:col-span-6 space-y-4">
              <ImagePreviewPanel />
            </div>

            {/* RIGHT COLUMN: Summary + Actions + Recent */}
            <div className="lg:col-span-12 xl:col-span-3 space-y-4">
              <SummaryPanel />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pegma-bg dark:bg-dark-bg text-pegma-dark dark:text-dark-text transition-colors">
      
      {/* Top Navigation Header */}
      <Header />

      {/* Main Workspace Body with Sidebar */}
      <div className="flex-1 flex max-w-[1800px] w-full mx-auto p-4 md:p-6 gap-6">
        
        {/* Persistent Left Sidebar Navigation */}
        <SidebarNav />

        {/* Dynamic Center/Right Workspace Area */}
        <main className="flex-1 overflow-x-hidden">
          {renderActiveView()}
        </main>

      </div>

      {/* Global Bottom Footer */}
      <Footer />

      {/* Notification Toast */}
      <Toast message={toastMessage} />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ConfiguratorProvider>
          <MainContent />
        </ConfiguratorProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
