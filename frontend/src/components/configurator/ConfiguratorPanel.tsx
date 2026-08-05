import React, { useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { AccordionCard } from './AccordionCard';
import { 
  Box, 
  Weight, 
  Palette, 
  Layers, 
  Maximize2, 
  RotateCcw, 
  Printer, 
  ShieldAlert, 
  Sparkles,
  Award,
  FileText,
  Lock,
  Tag,
  Plus,
  Edit3,
  Zap,
  Shield,
  Container,
  FileSpreadsheet,
  X,
  Check,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { FIBCBagConfig } from '../../types';

export const ConfiguratorPanel: React.FC = () => {
  const { config, updateConfig, generateImage, isGenerating, resetConfig, showToast } = useConfigurator();

  // Custom Input State toggles
  const [customBagTypeInput, setCustomBagTypeInput] = useState('');
  const [isCustomBagType, setIsCustomBagType] = useState(false);

  const [customCapacityInput, setCustomCapacityInput] = useState('');
  const [isCustomCapacity, setIsCustomCapacity] = useState(false);

  const [customFabricColorInput, setCustomFabricColorInput] = useState('');
  const [isCustomFabricColor, setIsCustomFabricColor] = useState(false);

  const [customGsmInput, setCustomGsmInput] = useState('');
  const [isCustomGsm, setIsCustomGsm] = useState(false);

  const [customElectroInput, setCustomElectroInput] = useState('');
  const [isCustomElectro, setIsCustomElectro] = useState(false);

  const [customSiftInput, setCustomSiftInput] = useState('');
  const [isCustomSift, setIsCustomSift] = useState(false);

  const [customTopInput, setCustomTopInput] = useState('');
  const [isCustomTop, setIsCustomTop] = useState(false);

  const [customBottomInput, setCustomBottomInput] = useState('');
  const [isCustomBottom, setIsCustomBottom] = useState(false);

  const [customLoopTypeInput, setCustomLoopTypeInput] = useState('');
  const [isCustomLoopType, setIsCustomLoopType] = useState(false);

  const [customLoopColorInput, setCustomLoopColorInput] = useState('');
  const [isCustomLoopColor, setIsCustomLoopColor] = useState(false);

  const [customLinerConstInput, setCustomLinerConstInput] = useState('');
  const [isCustomLinerConst, setIsCustomLinerConst] = useState(false);

  const [customLinerMatInput, setCustomLinerMatInput] = useState('');
  const [isCustomLinerMat, setIsCustomLinerMat] = useState(false);

  const [customPrintInput, setCustomPrintInput] = useState('');
  const [isCustomPrint, setIsCustomPrint] = useState(false);

  const [extraNotesInput, setExtraNotesInput] = useState('');

  // Toggle single option on/off (clicking an active option unselects it to empty string)
  const toggleSingleConfig = (
    key: keyof FIBCBagConfig, 
    value: string, 
    setIsCustomState?: (val: boolean) => void
  ) => {
    if (setIsCustomState) setIsCustomState(false);
    if (config[key] === value) {
      updateConfig(key, '');
    } else {
      updateConfig(key, value);
    }
  };

  // Helper for multi-select extra items
  const toggleExtraItem = (item: string) => {
    const current = config.accessories || [];
    let updated: string[];
    if (current.includes(item)) {
      updated = current.filter(a => a !== item);
    } else {
      updated = [...current, item];
    }
    updateConfig('accessories', updated);
  };

  const handleAddExtraNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraNotesInput.trim()) return;
    const current = config.accessories || [];
    if (!current.includes(extraNotesInput.trim())) {
      updateConfig('accessories', [...current, extraNotesInput.trim()]);
    }
    setExtraNotesInput('');
  };

  // File Upload Handler for Logo Image
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size too large (max 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target?.result as string;
      updateConfig('logoImage', base64Data);
      updateConfig('logoFileName', file.name);
      showToast(`Uploaded custom logo: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const removeCustomLogo = () => {
    updateConfig('logoImage', '');
    updateConfig('logoFileName', '');
    showToast("Removed custom logo image");
  };

  const isLinerEnabled = (config.linerRequired || 'Yes').toLowerCase() === 'yes';

  return (
    <div className="flex flex-col space-y-4 font-sans">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            CONFIGURE YOUR FIBC BAG
          </h2>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            FIBC Bag Configurator
          </p>
        </div>
        <button
          onClick={resetConfig}
          className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-pegma-red transition rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Reset to default specs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Primary Generate Action Button */}
      <button
        onClick={generateImage}
        disabled={isGenerating}
        className="relative w-full overflow-hidden bg-pegma-red hover:bg-pegma-red-hover text-white font-bold py-3.5 px-6 rounded-2xl shadow-glow transition-all duration-200 transform active:scale-[0.99] disabled:opacity-60 flex items-center justify-center space-x-2 text-sm tracking-wide"
      >
        <Sparkles className={`w-4 h-4 text-amber-200 ${isGenerating ? 'animate-spin' : ''}`} />
        <span>{isGenerating ? 'Synthesizing with Gemini AI...' : 'Generate Image'}</span>
      </button>

      {/* CONFIGURATOR SECTIONS */}
      <div className="space-y-3">
        
        {/* 1. BASE BAG TYPE (Pruned to match reference folder images) */}
        <AccordionCard
          stepNumber={1}
          title="BASE BAG TYPE"
          valueDisplay={config.bagType || 'Not Selected'}
          icon={<Box className="w-4 h-4 text-pegma-red" />}
        >
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'U Panel', refFile: 'upanel.png', desc: 'Single U-shaped body panel, two vertical side seams' },
              { label: '4 Panel', refFile: '4panel.png', desc: 'Heavy duty, four separate side panels for maximum cubic form' },
              { label: 'Circular', refFile: 'circular.png', desc: 'Seamless circular woven body, zero vertical side seams' },
              { label: 'Baffle Bag', refFile: 'baffle.png', desc: 'Internal fabric baffles across four corners preventing side bulging' },
              { label: 'Net Baffle Bag', refFile: 'netbaffle.png', desc: 'Internal heavy-duty polypropylene net-mesh baffles for free flow' },
              { label: '2 Panel Bag', refFile: 'u+2panel.png', desc: 'Two main fabric panels forming front, back, and base' },
              { label: 'Drum Bag', refFile: 'drum.png', desc: 'Cylindrical round-base bulk bag for standard drum insertion' },
              { label: 'Asbestos Plate Bag', refFile: 'asbestos.png', desc: 'Flat rectangular heavy duty bag for asbestos sheet disposal' },
              { label: 'Food Grade Bag', refFile: 'foodgrade.png', desc: 'Pharma & Food Grade certified ultra-clean room manufacturing' },
              { label: 'UN Certified Bag', refFile: 'uncertified.png', desc: 'Certified hazardous materials transport packaging' },
            ].map((type) => {
              const isSelected = !isCustomBagType && config.bagType === type.label;
              return (
                <div
                  key={type.label}
                  onClick={() => toggleSingleConfig('bagType', type.label, setIsCustomBagType)}
                  className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                    isSelected
                      ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10 text-pegma-dark dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="bagType"
                    checked={isSelected}
                    readOnly
                    className="mt-0.5 text-pegma-red focus:ring-pegma-red pointer-events-none"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-bold">{type.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{type.desc}</div>
                  </div>
                </div>
              );
            })}

            <div className={`p-2.5 rounded-xl border transition ${
              isCustomBagType ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
            }`}>
              <div 
                onClick={() => {
                  if (isCustomBagType) {
                    setIsCustomBagType(false);
                    updateConfig('bagType', '');
                  } else {
                    setIsCustomBagType(true);
                    if (customBagTypeInput.trim()) updateConfig('bagType', customBagTypeInput.trim());
                  }
                }}
                className="flex items-center space-x-2 cursor-pointer mb-1.5 select-none"
              >
                <input
                  type="radio"
                  name="bagType"
                  checked={isCustomBagType}
                  readOnly
                  className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Custom Construction Spec...</span>
                </span>
              </div>
              {isCustomBagType && (
                <input
                  type="text"
                  placeholder="Type custom construction..."
                  value={customBagTypeInput}
                  onChange={(e) => {
                    setCustomBagTypeInput(e.target.value);
                    if (e.target.value.trim()) updateConfig('bagType', e.target.value.trim());
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                  autoFocus
                />
              )}
            </div>
          </div>
        </AccordionCard>

        {/* 2. CAPACITY, FABRIC COLOUR & FABRIC DENSITY */}
        <AccordionCard
          stepNumber={2}
          title="CAPACITY, FABRIC COLOUR & DENSITY"
          valueDisplay={`${config.capacity || 'None'} • ${config.fabricColor || 'None'} • ${config.gsm || 'None'}`}
          icon={<Weight className="w-4 h-4 text-blue-500" />}
        >
          <div className="space-y-4">
            
            {/* SWL Capacity */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Safe Working Load (SWL Capacity)
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {['250 kg', '500 kg', '750 kg', '1000 kg', '1250 kg', '1500 kg', '2000 kg'].map((cap) => {
                  const isSelected = !isCustomCapacity && config.capacity === cap;
                  return (
                    <div
                      key={cap}
                      onClick={() => toggleSingleConfig('capacity', cap, setIsCustomCapacity)}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition select-none ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{cap}</span>
                      <input
                        type="radio"
                        name="capacity"
                        checked={isSelected}
                        readOnly
                        className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                      />
                    </div>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomCapacity ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <div 
                    onClick={() => {
                      if (isCustomCapacity) {
                        setIsCustomCapacity(false);
                        updateConfig('capacity', '');
                      } else {
                        setIsCustomCapacity(true);
                        if (customCapacityInput.trim()) updateConfig('capacity', customCapacityInput.trim());
                      }
                    }}
                    className="flex items-center space-x-2 cursor-pointer mb-1 select-none"
                  >
                    <input
                      type="radio"
                      name="capacity"
                      checked={isCustomCapacity}
                      readOnly
                      className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Capacity (SWL)...</span>
                    </span>
                  </div>
                  {isCustomCapacity && (
                    <input
                      type="text"
                      placeholder="Type custom SWL (e.g. 3000 kg)..."
                      value={customCapacityInput}
                      onChange={(e) => {
                        setCustomCapacityInput(e.target.value);
                        if (e.target.value.trim()) updateConfig('capacity', e.target.value.trim());
                      }}
                      className="w-full px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Fabric Colour */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Fabric Colour
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {['White', 'Black', 'Beige', 'Blue', 'Green', 'Yellow', 'Red', 'Orange'].map((col) => {
                  const isSelected = !isCustomFabricColor && config.fabricColor === col;
                  return (
                    <div
                      key={col}
                      onClick={() => toggleSingleConfig('fabricColor', col, setIsCustomFabricColor)}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition select-none ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{col}</span>
                      <input
                        type="radio"
                        name="fabricColor"
                        checked={isSelected}
                        readOnly
                        className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                      />
                    </div>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomFabricColor ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <div 
                    onClick={() => {
                      if (isCustomFabricColor) {
                        setIsCustomFabricColor(false);
                        updateConfig('fabricColor', '');
                      } else {
                        setIsCustomFabricColor(true);
                        if (customFabricColorInput.trim()) updateConfig('fabricColor', customFabricColorInput.trim());
                      }
                    }}
                    className="flex items-center space-x-2 cursor-pointer mb-1 select-none"
                  >
                    <input
                      type="radio"
                      name="fabricColor"
                      checked={isCustomFabricColor}
                      readOnly
                      className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Colour...</span>
                    </span>
                  </div>
                  {isCustomFabricColor && (
                    <input
                      type="text"
                      placeholder="Type custom fabric colour..."
                      value={customFabricColorInput}
                      onChange={(e) => {
                        setCustomFabricColorInput(e.target.value);
                        if (e.target.value.trim()) updateConfig('fabricColor', e.target.value.trim());
                      }}
                      className="w-full px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Fabric Density (GSM) */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Fabric Density (GSM)
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {['130 GSM', '140 GSM', '150 GSM', '160 GSM', '170 GSM', '180 GSM', '190 GSM', '200 GSM'].map((gsmVal) => {
                  const isSelected = !isCustomGsm && config.gsm === gsmVal;
                  return (
                    <div
                      key={gsmVal}
                      onClick={() => toggleSingleConfig('gsm', gsmVal, setIsCustomGsm)}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition select-none ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{gsmVal}</span>
                      <input
                        type="radio"
                        name="gsm"
                        checked={isSelected}
                        readOnly
                        className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                      />
                    </div>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomGsm ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <div 
                    onClick={() => {
                      if (isCustomGsm) {
                        setIsCustomGsm(false);
                        updateConfig('gsm', '');
                      } else {
                        setIsCustomGsm(true);
                        if (customGsmInput.trim()) updateConfig('gsm', customGsmInput.trim());
                      }
                    }}
                    className="flex items-center space-x-2 cursor-pointer mb-1 select-none"
                  >
                    <input
                      type="radio"
                      name="gsm"
                      checked={isCustomGsm}
                      readOnly
                      className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom GSM...</span>
                    </span>
                  </div>
                  {isCustomGsm && (
                    <input
                      type="text"
                      placeholder="Type custom GSM..."
                      value={customGsmInput}
                      onChange={(e) => {
                        setCustomGsmInput(e.target.value);
                        if (e.target.value.trim()) updateConfig('gsm', e.target.value.trim());
                      }}
                      className="w-full px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

          </div>
        </AccordionCard>

        {/* 3. ELECTRICAL SAFETY TYPE */}
        <AccordionCard
          stepNumber={3}
          title="ELECTRICAL SAFETY TYPE"
          valueDisplay={config.electrostaticType || 'Not Selected'}
          icon={<Zap className="w-4 h-4 text-amber-500" />}
        >
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'Type A', desc: 'Standard non-conductive fabric without static protection' },
              { label: 'Type B', desc: 'Low breakdown voltage (<6kV) preventing propagating brush discharges' },
              { label: 'Conductive Type C', desc: 'Interwoven conductive carbon grid threads with grounding tabs' },
            ].map((electro) => {
              const isSelected = !isCustomElectro && config.electrostaticType === electro.label;
              return (
                <div
                  key={electro.label}
                  onClick={() => toggleSingleConfig('electrostaticType', electro.label, setIsCustomElectro)}
                  className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                    isSelected
                      ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10 text-pegma-dark dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="electrostaticType"
                    checked={isSelected}
                    readOnly
                    className="mt-0.5 text-pegma-red focus:ring-pegma-red pointer-events-none"
                  />
                  <div>
                    <div className="text-xs font-bold">{electro.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{electro.desc}</div>
                  </div>
                </div>
              );
            })}

            <div className={`p-2.5 rounded-xl border transition ${
              isCustomElectro ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
            }`}>
              <div 
                onClick={() => {
                  if (isCustomElectro) {
                    setIsCustomElectro(false);
                    updateConfig('electrostaticType', '');
                  } else {
                    setIsCustomElectro(true);
                    if (customElectroInput.trim()) updateConfig('electrostaticType', customElectroInput.trim());
                  }
                }}
                className="flex items-center space-x-2 cursor-pointer mb-1.5 select-none"
              >
                <input
                  type="radio"
                  name="electrostaticType"
                  checked={isCustomElectro}
                  readOnly
                  className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Custom Electrical Spec...</span>
                </span>
              </div>
              {isCustomElectro && (
                <input
                  type="text"
                  placeholder="Type custom electrical spec..."
                  value={customElectroInput}
                  onChange={(e) => {
                    setCustomElectroInput(e.target.value);
                    if (e.target.value.trim()) updateConfig('electrostaticType', e.target.value.trim());
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                  autoFocus
                />
              )}
            </div>
          </div>
        </AccordionCard>

        {/* 4. SIFT PROOF LEVEL */}
        <AccordionCard
          stepNumber={4}
          title="SIFT PROOF LEVEL"
          valueDisplay={config.siftProofing || 'Not Selected'}
          icon={<Shield className="w-4 h-4 text-emerald-500" />}
        >
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'None', desc: 'Standard multi-row structural seam stitching without cords' },
              { label: 'Single Sift Proof', desc: 'Single felt cord stitched along vertical seams' },
              { label: 'Double Sift Proof', desc: 'Double felt filler cord along all seams' },
              { label: 'Triple Sift Proof', desc: 'Triple-sealed seams with filler cords & lamination' },
              { label: 'Dust Proof Stitching', desc: 'Felt seam sealing tape stitched along structural seams' },
            ].map((sft) => {
              const isSelected = !isCustomSift && config.siftProofing === sft.label;
              return (
                <div
                  key={sft.label}
                  onClick={() => toggleSingleConfig('siftProofing', sft.label, setIsCustomSift)}
                  className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                    isSelected
                      ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10 text-pegma-dark dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="siftProofing"
                    checked={isSelected}
                    readOnly
                    className="mt-0.5 text-pegma-red focus:ring-pegma-red pointer-events-none"
                  />
                  <div>
                    <div className="text-xs font-bold">{sft.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{sft.desc}</div>
                  </div>
                </div>
              );
            })}

            <div className={`p-2.5 rounded-xl border transition ${
              isCustomSift ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
            }`}>
              <div 
                onClick={() => {
                  if (isCustomSift) {
                    setIsCustomSift(false);
                    updateConfig('siftProofing', '');
                  } else {
                    setIsCustomSift(true);
                    if (customSiftInput.trim()) updateConfig('siftProofing', customSiftInput.trim());
                  }
                }}
                className="flex items-center space-x-2 cursor-pointer mb-1.5 select-none"
              >
                <input
                  type="radio"
                  name="siftProofing"
                  checked={isCustomSift}
                  readOnly
                  className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Custom Sift Proof Spec...</span>
                </span>
              </div>
              {isCustomSift && (
                <input
                  type="text"
                  placeholder="Type custom seam sealing..."
                  value={customSiftInput}
                  onChange={(e) => {
                    setCustomSiftInput(e.target.value);
                    if (e.target.value.trim()) updateConfig('siftProofing', e.target.value.trim());
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                  autoFocus
                />
              )}
            </div>
          </div>
        </AccordionCard>

        {/* 5. LOOP CONFIGURATION & LOOP COLOUR (Pruned to match reference folder images) */}
        <AccordionCard
          stepNumber={5}
          title="LOOP CONFIGURATION & COLOUR"
          valueDisplay={`${config.loopType || 'None'} (${config.loopColor || 'None'})`}
          icon={<Layers className="w-4 h-4 text-purple-500" />}
        >
          <div className="space-y-4">
            
            {/* Loop Configuration */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Loop Design / Configuration
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'Single Loop', refFile: 'singleloop.png', desc: 'Central single loop for crane hook lifting' },
                  { label: 'Double Loop', refFile: 'doubleloop.png', desc: 'Dual overhead lifting straps' },
                  { label: 'Cross Corner Loops', refFile: 'crosscornerloop.png', desc: 'Loops attached across corners for easy forklift loading' },
                ].map((lt) => {
                  const isSelected = !isCustomLoopType && config.loopType === lt.label;
                  return (
                    <div
                      key={lt.label}
                      onClick={() => toggleSingleConfig('loopType', lt.label, setIsCustomLoopType)}
                      className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition select-none ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="loopType"
                        checked={isSelected}
                        readOnly
                        className="mt-0.5 text-pegma-red focus:ring-pegma-red pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-bold">{lt.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">{lt.desc}</div>
                      </div>
                    </div>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomLoopType ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <div 
                    onClick={() => {
                      if (isCustomLoopType) {
                        setIsCustomLoopType(false);
                        updateConfig('loopType', '');
                      } else {
                        setIsCustomLoopType(true);
                        if (customLoopTypeInput.trim()) updateConfig('loopType', customLoopTypeInput.trim());
                      }
                    }}
                    className="flex items-center space-x-2 cursor-pointer mb-1 select-none"
                  >
                    <input
                      type="radio"
                      name="loopType"
                      checked={isCustomLoopType}
                      readOnly
                      className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Loop Configuration...</span>
                    </span>
                  </div>
                  {isCustomLoopType && (
                    <input
                      type="text"
                      placeholder="Type custom loop config..."
                      value={customLoopTypeInput}
                      onChange={(e) => {
                        setCustomLoopTypeInput(e.target.value);
                        if (e.target.value.trim()) updateConfig('loopType', e.target.value.trim());
                      }}
                      className="w-full px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Loop Colour */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Loop Strap Colour
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {['Blue', 'White', 'Black', 'Red', 'Green', 'Yellow', 'Orange'].map((lc) => {
                  const isSelected = !isCustomLoopColor && config.loopColor === lc;
                  return (
                    <div
                      key={lc}
                      onClick={() => toggleSingleConfig('loopColor', lc, setIsCustomLoopColor)}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition select-none ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{lc}</span>
                      <input
                        type="radio"
                        name="loopColor"
                        checked={isSelected}
                        readOnly
                        className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                      />
                    </div>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomLoopColor ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <div 
                    onClick={() => {
                      if (isCustomLoopColor) {
                        setIsCustomLoopColor(false);
                        updateConfig('loopColor', '');
                      } else {
                        setIsCustomLoopColor(true);
                        if (customLoopColorInput.trim()) updateConfig('loopColor', customLoopColorInput.trim());
                      }
                    }}
                    className="flex items-center space-x-2 cursor-pointer mb-1 select-none"
                  >
                    <input
                      type="radio"
                      name="loopColor"
                      checked={isCustomLoopColor}
                      readOnly
                      className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Loop Colour...</span>
                    </span>
                  </div>
                  {isCustomLoopColor && (
                    <input
                      type="text"
                      placeholder="Type custom loop colour..."
                      value={customLoopColorInput}
                      onChange={(e) => {
                        setCustomLoopColorInput(e.target.value);
                        if (e.target.value.trim()) updateConfig('loopColor', e.target.value.trim());
                      }}
                      className="w-full px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

          </div>
        </AccordionCard>

        {/* 6. TOP OPENING & BOTTOM DISCHARGE (Pruned to match reference folder images) */}
        <AccordionCard
          stepNumber={6}
          title="TOP OPENING & BOTTOM DISCHARGE"
          valueDisplay={`${config.top || 'None'} • ${config.bottom || 'None'}`}
          icon={<Maximize2 className="w-4 h-4 text-emerald-500" />}
        >
          <div className="space-y-4">
            
            {/* Top Opening */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Top Opening Mechanism
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'Open Top', refFile: 'opentop.png', desc: 'Hemmed open top' },
                  { label: 'Filling Spout', refFile: 'fillingspout.png', desc: 'Cylindrical hopper loading spout' },
                  { label: 'Duffle Top', refFile: 'duffletop.png', desc: 'Drawstring tie closure skirt' },
                  { label: 'Skirt Top', refFile: 'skirttop.png', desc: 'Wide skirt top opening' },
                  { label: 'Conical Top', refFile: 'conicaltop.png', desc: 'Tapered conical inlet top' },
                ].map((tp) => {
                  const isSelected = !isCustomTop && config.top === tp.label;
                  return (
                    <div
                      key={tp.label}
                      onClick={() => toggleSingleConfig('top', tp.label, setIsCustomTop)}
                      className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition select-none ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="topType"
                        checked={isSelected}
                        readOnly
                        className="mt-0.5 text-pegma-red focus:ring-pegma-red pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-bold">{tp.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">{tp.desc}</div>
                      </div>
                    </div>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomTop ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <div 
                    onClick={() => {
                      if (isCustomTop) {
                        setIsCustomTop(false);
                        updateConfig('top', '');
                      } else {
                        setIsCustomTop(true);
                        if (customTopInput.trim()) updateConfig('top', customTopInput.trim());
                      }
                    }}
                    className="flex items-center space-x-2 cursor-pointer mb-1 select-none"
                  >
                    <input
                      type="radio"
                      name="topType"
                      checked={isCustomTop}
                      readOnly
                      className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Top Mechanism...</span>
                    </span>
                  </div>
                  {isCustomTop && (
                    <input
                      type="text"
                      placeholder="Type custom top mechanism..."
                      value={customTopInput}
                      onChange={(e) => {
                        setCustomTopInput(e.target.value);
                        if (e.target.value.trim()) updateConfig('top', e.target.value.trim());
                      }}
                      className="w-full px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Discharge */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Bottom Discharge Mechanism
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'Flat Bottom', refFile: 'flatbottom.png', desc: 'Completely closed flat base for pallet stability' },
                  { label: 'Discharge Spout', refFile: 'discharge spout.png', desc: 'Prominently extending discharge spout with closure tie' },
                  { label: 'Conical Bottom', refFile: 'conicalbottom.png', desc: 'Tapered conical discharge base' },
                  { label: 'Diaper Bottom', refFile: 'diaperbottom.png', desc: 'Protective bottom flap cover' },
                ].map((bt) => {
                  const isSelected = !isCustomBottom && config.bottom === bt.label;
                  return (
                    <div
                      key={bt.label}
                      onClick={() => toggleSingleConfig('bottom', bt.label, setIsCustomBottom)}
                      className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition select-none ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bottomType"
                        checked={isSelected}
                        readOnly
                        className="mt-0.5 text-pegma-red focus:ring-pegma-red pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-bold">{bt.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">{bt.desc}</div>
                      </div>
                    </div>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomBottom ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <div 
                    onClick={() => {
                      if (isCustomBottom) {
                        setIsCustomBottom(false);
                        updateConfig('bottom', '');
                      } else {
                        setIsCustomBottom(true);
                        if (customBottomInput.trim()) updateConfig('bottom', customBottomInput.trim());
                      }
                    }}
                    className="flex items-center space-x-2 cursor-pointer mb-1 select-none"
                  >
                    <input
                      type="radio"
                      name="bottomType"
                      checked={isCustomBottom}
                      readOnly
                      className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Bottom Mechanism...</span>
                    </span>
                  </div>
                  {isCustomBottom && (
                    <input
                      type="text"
                      placeholder="Type custom bottom mechanism..."
                      value={customBottomInput}
                      onChange={(e) => {
                        setCustomBottomInput(e.target.value);
                        if (e.target.value.trim()) updateConfig('bottom', e.target.value.trim());
                      }}
                      className="w-full px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

          </div>
        </AccordionCard>

        {/* 7. LINER REQUIRED */}
        <AccordionCard
          stepNumber={7}
          title="LINER REQUIRED"
          valueDisplay={config.linerRequired || 'Not Selected'}
          icon={<Container className="w-4 h-4 text-indigo-500" />}
        >
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Specify whether an internal plastic or barrier liner is required inside the FIBC bag.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {['Yes', 'No'].map((opt) => {
                const isSelected = config.linerRequired === opt;
                return (
                  <div
                    key={opt}
                    onClick={() => toggleSingleConfig('linerRequired', opt)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer font-bold transition select-none ${
                      isSelected
                        ? 'border-pegma-red bg-pegma-red/10 text-pegma-red shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-pegma-red bg-pegma-red text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm">{opt}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                      {opt === 'Yes' ? 'Enables Steps 8 & 9' : 'Direct Fabric'}
                    </span>
                  </div>
                );
              })}
            </div>

            {!isLinerEnabled && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center space-x-2 text-[11px] text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Selecting <b>'Yes'</b> will enable and unlock Steps 8 & 9 (Liner Construction & Material).</span>
              </div>
            )}
          </div>
        </AccordionCard>

        {/* 8. LINER CONSTRUCTION (Conditional on Liner Required = Yes) */}
        <AccordionCard
          stepNumber={8}
          title="LINER CONSTRUCTION"
          valueDisplay={isLinerEnabled ? (config.linerConstruction || 'Not Selected') : 'Requires Liner = Yes'}
          icon={<Layers className="w-4 h-4 text-sky-500" />}
        >
          {isLinerEnabled ? (
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Loose Liner', desc: 'Clear PE liner inserted loosely into the bag' },
                { label: 'Glued Liner', desc: 'PE liner spot-glued to internal bag walls' },
                { label: 'Tabbed Liner', desc: 'Inner PE liner tied securely to corner tabs' },
                { label: 'Suspended Liner', desc: 'Inner liner suspended from top loops' },
                { label: 'Baffle Liner', desc: 'Baffled form-fit inner liner maintaining square shape' },
                { label: 'Bulk Container Liner', desc: 'Large 20ft/40ft shipping container liner' },
                { label: 'In House Liner Forming', desc: 'Custom 3D form-fitted PE liner' },
              ].map((lnrConst) => {
                const isSelected = !isCustomLinerConst && config.linerConstruction === lnrConst.label;
                return (
                  <div
                    key={lnrConst.label}
                    onClick={() => toggleSingleConfig('linerConstruction', lnrConst.label, setIsCustomLinerConst)}
                    className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                      isSelected
                        ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10 text-pegma-dark dark:text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="linerConstruction"
                      checked={isSelected}
                      readOnly
                      className="mt-0.5 text-pegma-red focus:ring-pegma-red pointer-events-none"
                    />
                    <div>
                      <div className="text-xs font-bold">{lnrConst.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{lnrConst.desc}</div>
                    </div>
                  </div>
                );
              })}

              <div className={`p-2.5 rounded-xl border transition ${
                isCustomLinerConst ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}>
                <div 
                  onClick={() => {
                    if (isCustomLinerConst) {
                      setIsCustomLinerConst(false);
                      updateConfig('linerConstruction', '');
                    } else {
                      setIsCustomLinerConst(true);
                      if (customLinerConstInput.trim()) updateConfig('linerConstruction', customLinerConstInput.trim());
                    }
                  }}
                  className="flex items-center space-x-2 cursor-pointer mb-1.5 select-none"
                >
                  <input
                    type="radio"
                    name="linerConstruction"
                    checked={isCustomLinerConst}
                    readOnly
                    className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Custom Liner Construction...</span>
                  </span>
                </div>
                {isCustomLinerConst && (
                  <input
                    type="text"
                    placeholder="Type custom liner construction..."
                    value={customLinerConstInput}
                    onChange={(e) => {
                      setCustomLinerConstInput(e.target.value);
                      if (e.target.value.trim()) updateConfig('linerConstruction', e.target.value.trim());
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                    autoFocus
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <Lock className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Liner Specs Locked
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Select <b>'Yes'</b> in Step 7 (Liner Required) to enable liner construction configuration.
              </p>
            </div>
          )}
        </AccordionCard>

        {/* 9. LINER MATERIAL / TYPE (Conditional on Liner Required = Yes) */}
        <AccordionCard
          stepNumber={9}
          title="LINER MATERIAL / TYPE"
          valueDisplay={isLinerEnabled ? (config.linerMaterial || 'Not Selected') : 'Requires Liner = Yes'}
          icon={<FileText className="w-4 h-4 text-cyan-500" />}
        >
          {isLinerEnabled ? (
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Standard PE', desc: 'Standard clear polyethylene barrier liner' },
                { label: 'Stranded Liner', desc: 'High-strength stranded polyethylene film' },
                { label: 'Antistatic Liner', desc: 'Static dissipative antistatic translucent liner' },
                { label: 'Foil Liner', desc: 'Multi-layer aluminum foil moisture & gas barrier' },
                { label: 'Black Conductive Liner', desc: 'Carbon-black conductive PE liner' },
              ].map((lnrMat) => {
                const isSelected = !isCustomLinerMat && config.linerMaterial === lnrMat.label;
                return (
                  <div
                    key={lnrMat.label}
                    onClick={() => toggleSingleConfig('linerMaterial', lnrMat.label, setIsCustomLinerMat)}
                    className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                      isSelected
                        ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10 text-pegma-dark dark:text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="linerMaterial"
                      checked={isSelected}
                      readOnly
                      className="mt-0.5 text-pegma-red focus:ring-pegma-red pointer-events-none"
                    />
                    <div>
                      <div className="text-xs font-bold">{lnrMat.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{lnrMat.desc}</div>
                    </div>
                  </div>
                );
              })}

              <div className={`p-2.5 rounded-xl border transition ${
                isCustomLinerMat ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}>
                <div 
                  onClick={() => {
                    if (isCustomLinerMat) {
                      setIsCustomLinerMat(false);
                      updateConfig('linerMaterial', '');
                    } else {
                      setIsCustomLinerMat(true);
                      if (customLinerMatInput.trim()) updateConfig('linerMaterial', customLinerMatInput.trim());
                    }
                  }}
                  className="flex items-center space-x-2 cursor-pointer mb-1.5 select-none"
                >
                  <input
                    type="radio"
                    name="linerMaterial"
                    checked={isCustomLinerMat}
                    readOnly
                    className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Custom Liner Material...</span>
                  </span>
                </div>
                {isCustomLinerMat && (
                  <input
                    type="text"
                    placeholder="Type custom liner material..."
                    value={customLinerMatInput}
                    onChange={(e) => {
                      setCustomLinerMatInput(e.target.value);
                      if (e.target.value.trim()) updateConfig('linerMaterial', e.target.value.trim());
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                    autoFocus
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <Lock className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Material Specs Locked
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Select <b>'Yes'</b> in Step 7 (Liner Required) to enable liner material configuration.
              </p>
            </div>
          )}
        </AccordionCard>

        {/* 10. BRAND PRINTING & CUSTOM LOGO UPLOAD */}
        <AccordionCard
          stepNumber={10}
          title="BRAND PRINTING & CUSTOM LOGO UPLOAD"
          valueDisplay={config.logoFileName ? `Uploaded: ${config.logoFileName}` : (config.printing || 'Not Selected')}
          icon={<Printer className="w-4 h-4 text-amber-500" />}
        >
          <div className="space-y-4">
            
            {/* Custom Logo File Input Box */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>UPLOAD CUSTOM LOGO IMAGE</span>
                <span className="text-[10px] text-slate-400 font-normal">PNG, JPG, SVG (Max 5MB)</span>
              </label>

              {config.logoImage ? (
                <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-pegma-red/40 shadow-xs">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={config.logoImage} 
                      alt="Uploaded Logo Preview" 
                      className="w-10 h-10 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white p-1"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[180px]">
                        {config.logoFileName || 'Custom Logo File'}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Logo Uploaded & Attached</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCustomLogo}
                    className="p-1.5 text-slate-400 hover:text-pegma-red hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                    title="Remove custom logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-pegma-red cursor-pointer transition text-center group">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-pegma-red transition mb-1" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-pegma-red">
                    Click to Upload Custom Logo File
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Replaces default logo with your uploaded brand artwork
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Brand Printing Selection */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Brand Printing Text & Preset Logos
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'PEGMA', desc: 'PEGMA official logo & SWL rating' },
                  { label: 'No Printing', desc: 'Plain fabric surface with no logos or text' },
                ].map((pr) => {
                  const isSelected = !isCustomPrint && config.printing === pr.label;
                  return (
                    <div
                      key={pr.label}
                      onClick={() => toggleSingleConfig('printing', pr.label, setIsCustomPrint)}
                      className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition select-none ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="printing"
                        checked={isSelected}
                        readOnly
                        className="mt-0.5 text-pegma-red focus:ring-pegma-red pointer-events-none"
                      />
                      <div>
                        <div>{pr.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{pr.desc}</div>
                      </div>
                    </div>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomPrint ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <div 
                    onClick={() => {
                      if (isCustomPrint) {
                        setIsCustomPrint(false);
                        updateConfig('printing', '');
                      } else {
                        setIsCustomPrint(true);
                        if (customPrintInput.trim()) updateConfig('printing', customPrintInput.trim());
                      }
                    }}
                    className="flex items-center space-x-2 cursor-pointer mb-1 select-none"
                  >
                    <input
                      type="radio"
                      name="printing"
                      checked={isCustomPrint}
                      readOnly
                      className="text-pegma-red focus:ring-pegma-red pointer-events-none"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Brand Text / Logo...</span>
                    </span>
                  </div>
                  {isCustomPrint && (
                    <input
                      type="text"
                      placeholder="Type custom brand text or logo details..."
                      value={customPrintInput}
                      onChange={(e) => {
                        setCustomPrintInput(e.target.value);
                        if (e.target.value.trim()) updateConfig('printing', e.target.value.trim());
                      }}
                      className="w-full px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

          </div>
        </AccordionCard>

        {/* 11. EXTRA CUSTOMIZATION */}
        <AccordionCard
          stepNumber={11}
          title="EXTRA CUSTOMIZATION"
          valueDisplay={
            (config.accessories || []).length > 0
              ? `${(config.accessories || []).length} Active Specification(s)`
              : 'Notes & Extra Features'
          }
          icon={<FileSpreadsheet className="w-4 h-4 text-emerald-500" />}
        >
          <div className="space-y-3">
            
            {/* Active Added Extras List with Delete X buttons */}
            {(config.accessories || []).length > 0 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    ACTIVE EXTRA SPECIFICATIONS ({(config.accessories || []).length})
                  </span>
                  <button
                    onClick={() => updateConfig('accessories', [])}
                    className="text-[10px] text-pegma-red font-bold hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(config.accessories || []).map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-pegma-red/10 border border-pegma-red/30 text-pegma-red dark:text-red-400"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => toggleExtraItem(item)}
                        className="p-0.5 rounded-md hover:bg-pegma-red hover:text-white transition"
                        title={`Remove ${item}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Add Custom Notes & Extra Customization Specifications
              </label>
              <form onSubmit={handleAddExtraNotes} className="space-y-2">
                <textarea
                  rows={3}
                  placeholder="Type any extra customization information, custom dimensions (e.g. 90x90x120 cm), special handling notes, thread matching specs..."
                  value={extraNotesInput}
                  onChange={(e) => setExtraNotesInput(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pegma-red dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-3 bg-pegma-red hover:bg-pegma-red-hover text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Extra Specification Note</span>
                </button>
              </form>
            </div>

            {/* Quick Preset Extra Tags */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Quick Add Custom Presets
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Dimensions 90x90x120 cm',
                  'Double Layer Base',
                  'UV Stabilized 3000hrs',
                  'Tamper Evident Seal',
                  'Color Matched Threads',
                  'Stevedore Loop Combination'
                ].map((tag) => {
                  const isAdded = (config.accessories || []).includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleExtraItem(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition flex items-center space-x-1 ${
                        isAdded
                          ? 'border-pegma-red bg-pegma-red text-white'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span>{isAdded ? '✓' : '+'}</span>
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </AccordionCard>

      </div>

    </div>
  );
};
