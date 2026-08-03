import React, { createContext, useContext, useState, useEffect } from 'react';
import { FIBCBagConfig, GenerationResponse, HistoryItem, ActiveTab, SavedConfig } from '../types';
import { generateBagImage, fetchHistory, toggleFavoriteItem, deleteHistoryItem, saveConfiguration } from '../services/api';

const DEFAULT_CONFIG: FIBCBagConfig = {
  bagType: "U-Panel",
  capacity: "1000 kg",
  fabricColor: "White",
  gsm: "180 GSM",
  top: "Duffle Top",
  bottom: "Discharge Spout",
  loopType: "Cross Corner",
  loopColor: "Blue",
  printing: "PEGMA",
  printingColor: "Red",
  printingPosition: "Center Front",
  accessories: ["PE Liner", "Document Pouch", "Dust Proof Stitching"],
  foodGrade: false,
  unCertified: false,
  baffle: false,
  peLiner: true,
  documentPouch: true,
  dustProofStitching: true,
  barcodeLabel: false
};

interface ConfiguratorContextType {
  config: FIBCBagConfig;
  updateConfig: (key: keyof FIBCBagConfig, value: any) => void;
  setFullConfig: (newConfig: FIBCBagConfig) => void;
  resetConfig: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Generation states
  isGenerating: boolean;
  currentImage: GenerationResponse | null;
  generateImage: () => Promise<void>;
  
  // History & saved states
  history: HistoryItem[];
  loadHistory: () => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  removeHistoryItem: (id: number) => Promise<void>;
  saveCurrentConfig: (title: string, description?: string) => Promise<boolean>;
  
  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(undefined);

export const ConfiguratorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<FIBCBagConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<ActiveTab>('configurator');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<GenerationResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const updateConfig = (key: keyof FIBCBagConfig, value: any) => {
    setConfig(prev => {
      const updated = { ...prev, [key]: value };
      
      // Keep boolean accessory flags synchronized with accessories array
      if (key === 'accessories' && Array.isArray(value)) {
        updated.foodGrade = value.includes('Food Grade');
        updated.unCertified = value.includes('UN Certified');
        updated.baffle = value.includes('Baffle');
        updated.peLiner = value.includes('PE Liner');
        updated.documentPouch = value.includes('Document Pouch');
        updated.dustProofStitching = value.includes('Dust Proof Stitching');
        updated.barcodeLabel = value.includes('Barcode');
      }
      return updated;
    });
  };

  const setFullConfig = (newConfig: FIBCBagConfig) => {
    setConfig(newConfig);
    showToast("Loaded configuration template");
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    showToast("Reset to default specifications");
  };

  const loadHistory = async () => {
    const items = await fetchHistory();
    setHistory(items);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      const res = await generateBagImage(config);
      setCurrentImage(res);
      await loadHistory();
      showToast("FIBC Product render generated via Gemini AI");
    } catch (error) {
      showToast("Error generating image");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFavorite = async (id: number) => {
    await toggleFavoriteItem(id);
    await loadHistory();
    showToast("Updated favorites");
  };

  const removeHistoryItem = async (id: number) => {
    await deleteHistoryItem(id);
    await loadHistory();
    showToast("Deleted history record");
  };

  const saveCurrentConfig = async (title: string, description: string = "") => {
    const success = await saveConfiguration(title, description, config);
    if (success) {
      showToast(`Saved configuration '${title}'`);
    }
    return success;
  };

  return (
    <ConfiguratorContext.Provider
      value={{
        config,
        updateConfig,
        setFullConfig,
        resetConfig,
        activeTab,
        setActiveTab,
        isGenerating,
        currentImage,
        generateImage,
        history,
        loadHistory,
        toggleFavorite,
        removeHistoryItem,
        saveCurrentConfig,
        toastMessage,
        showToast
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
};

export const useConfigurator = () => {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error('useConfigurator must be used within ConfiguratorProvider');
  }
  return context;
};
