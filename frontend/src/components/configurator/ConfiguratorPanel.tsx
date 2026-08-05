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
  CheckSquare, 
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
  X
} from 'lucide-react';
import { FIBCBagConfig } from '../../types';

export const ConfiguratorPanel: React.FC = () => {
  const { config, updateConfig, generateImage, isGenerating, resetConfig } = useConfigurator();

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

  const [customLinerInput, setCustomLinerInput] = useState('');
  const [isCustomLiner, setIsCustomLiner] = useState(false);

  const [customTopInput, setCustomTopInput] = useState('');
  const [isCustomTop, setIsCustomTop] = useState(false);

  const [customBottomInput, setCustomBottomInput] = useState('');
  const [isCustomBottom, setIsCustomBottom] = useState(false);

  const [customLoopTypeInput, setCustomLoopTypeInput] = useState('');
  const [isCustomLoopType, setIsCustomLoopType] = useState(false);

  const [customLoopColorInput, setCustomLoopColorInput] = useState('');
  const [isCustomLoopColor, setIsCustomLoopColor] = useState(false);

  const [customPrintInput, setCustomPrintInput] = useState('');
  const [isCustomPrint, setIsCustomPrint] = useState(false);

  const [customAccessoryInput, setCustomAccessoryInput] = useState('');
  const [extraNotesInput, setExtraNotesInput] = useState('');

  // Toggle/Unselect Helper function
  const toggleOption = (field: keyof FIBCBagConfig, value: string, resetCustomFn?: () => void) => {
    if (resetCustomFn) resetCustomFn();
    if (config[field] === value) {
      updateConfig(field, 'None');
    } else {
      updateConfig(field, value);
    }
  };

  // Helper for multi-select accessories
  const toggleAccessory = (accName: string) => {
    const current = config.accessories || [];
    let updated: string[];
    if (current.includes(accName)) {
      updated = current.filter(a => a !== accName);
    } else {
      updated = [...current, accName];
    }
    updateConfig('accessories', updated);
  };

  const handleAddCustomAccessory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAccessoryInput.trim()) return;
    const current = config.accessories || [];
    if (!current.includes(customAccessoryInput.trim())) {
      updateConfig('accessories', [...current, customAccessoryInput.trim()]);
    }
    setCustomAccessoryInput('');
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

  const allAccessories = [
    { name: 'Food Grade', icon: <Award className="w-3.5 h-3.5 text-amber-500" />, desc: 'Pharma & Food certified clean room' },
    { name: 'UN Certified', icon: <ShieldAlert className="w-3.5 h-3.5 text-red-500" />, desc: 'Hazardous materials packaging standard' },
    { name: 'Document Pouch', icon: <FileText className="w-3.5 h-3.5 text-emerald-500" />, desc: 'Stitched A4 transparent document sleeve' },
    { name: 'Barcode Tag', icon: <Tag className="w-3.5 h-3.5 text-slate-500" />, desc: 'Serialized barcode inventory tag' },
  ];

  const customAddedAccessories = (config.accessories || []).filter(
    a => !allAccessories.some(preset => preset.name === a)
  );

  return (
    <div className="flex flex-col space-y-4 font-sans">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            CONFIGURE YOUR FIBC BAG
          </h2>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            8-Step Industrial CAD Configurator
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

      {/* 8 MASTER ACCORDION SECTIONS */}
      <div className="space-y-3">
        
        {/* STEP 1: BAG CONSTRUCTION & BAFFLES */}
        <AccordionCard
          stepNumber={1}
          title="BAG CONSTRUCTION & BAFFLES"
          valueDisplay={config.bagType || 'None'}
          icon={<Box className="w-4 h-4 text-pegma-red" />}
        >
          <div className="grid grid-cols-1 gap-2">
            
            {/* Deselect / Clear Card */}
            <button
              type="button"
              onClick={() => {
                setIsCustomBagType(false);
                updateConfig('bagType', 'None');
              }}
              className={`p-2 rounded-xl border flex items-center justify-between text-xs font-bold transition ${
                !config.bagType || config.bagType === 'None'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-500 dark:text-slate-400'
              }`}
            >
              <span>Unselect (No Specific Bag Type)</span>
              <X className="w-3.5 h-3.5" />
            </button>

            {[
              { label: 'U-Panel', desc: 'Single U-shaped body panel, two vertical side seams' },
              { label: '4-Panel', desc: 'Heavy duty, four separate side panels for maximum cubic form' },
              { label: 'Circular / Tubular', desc: 'Seamless circular woven body, zero vertical side seams' },
              { label: 'Baffle Bag (Q-Bag)', desc: 'Internal fabric baffles across four corners preventing side bulging' },
              { label: 'Circular Baffle', desc: 'Seamless tubular outer body fitted with internal corner baffles' },
              { label: 'Net Baffle Bag', desc: 'Internal heavy-duty polypropylene net-mesh baffles for free flow' },
              { label: 'Tie Baffle', desc: 'Internal fabric tie-strap baffles securing corner shape' },
              { label: '2-Panel Bag', desc: 'Two main fabric panels forming front, back, and base' },
              { label: 'Single Loop / Double Loop', desc: 'Overhead single or dual continuous lifting loop construction' },
              { label: 'Asbestos Plate Bag', desc: 'Flat rectangular heavy duty bag for asbestos sheet disposal' },
              { label: 'Drum Bag', desc: 'Cylindrical round-base bulk bag for standard drum insertion' },
              { label: 'Fabric (PP Woven)', desc: 'High-tenacity woven polypropylene fabric rolls' },
            ].map((type) => {
              const isSelected = !isCustomBagType && config.bagType === type.label;
              return (
                <label
                  key={type.label}
                  onClick={() => toggleOption('bagType', type.label, () => setIsCustomBagType(false))}
                  className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10 text-pegma-dark dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="bagType"
                    checked={isSelected}
                    onChange={() => {}}
                    className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                  />
                  <div>
                    <div className="text-xs font-bold">{type.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{type.desc}</div>
                  </div>
                </label>
              );
            })}

            <div className={`p-2.5 rounded-xl border transition ${
              isCustomBagType ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
            }`}>
              <label className="flex items-center space-x-2 cursor-pointer mb-1.5">
                <input
                  type="radio"
                  name="bagType"
                  checked={isCustomBagType}
                  onChange={() => {
                    setIsCustomBagType(true);
                    if (customBagTypeInput.trim()) updateConfig('bagType', customBagTypeInput.trim());
                  }}
                  className="text-pegma-red focus:ring-pegma-red"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Custom Construction / Baffle Spec...</span>
                </span>
              </label>
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

        {/* STEP 2: CAPACITY & FABRIC SPECS */}
        <AccordionCard
          stepNumber={2}
          title="CAPACITY & FABRIC SPECS"
          valueDisplay={`${config.capacity || 'None'} • ${config.fabricColor || 'White'} • ${config.gsm || '180 GSM'}`}
          icon={<Weight className="w-4 h-4 text-blue-500" />}
        >
          <div className="space-y-4">
            
            {/* SWL Capacity */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Safe Working Load (SWL)
                </label>
                <button
                  type="button"
                  onClick={() => updateConfig('capacity', 'None')}
                  className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Clear Capacity
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {['500 kg', '1000 kg', '1250 kg', '1500 kg', '2000 kg'].map((cap) => {
                  const isSelected = !isCustomCapacity && config.capacity === cap;
                  return (
                    <label
                      key={cap}
                      onClick={() => toggleOption('capacity', cap, () => setIsCustomCapacity(false))}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
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
                        onChange={() => {}}
                        className="text-pegma-red focus:ring-pegma-red"
                      />
                    </label>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomCapacity ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <label className="flex items-center space-x-2 cursor-pointer mb-1">
                    <input
                      type="radio"
                      name="capacity"
                      checked={isCustomCapacity}
                      onChange={() => {
                        setIsCustomCapacity(true);
                        if (customCapacityInput.trim()) updateConfig('capacity', customCapacityInput.trim());
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Capacity (SWL)...</span>
                    </span>
                  </label>
                  {isCustomCapacity && (
                    <input
                      type="text"
                      placeholder="Type custom SWL..."
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

            {/* Fabric Color */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Fabric Color
                </label>
                <button
                  type="button"
                  onClick={() => updateConfig('fabricColor', 'White')}
                  className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Clear (Default White)
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {['White', 'Beige / Tan', 'Black', 'Blue', 'Green'].map((col) => {
                  const isSelected = !isCustomFabricColor && config.fabricColor === col;
                  return (
                    <label
                      key={col}
                      onClick={() => toggleOption('fabricColor', col, () => setIsCustomFabricColor(false))}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
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
                        onChange={() => {}}
                        className="text-pegma-red focus:ring-pegma-red"
                      />
                    </label>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomFabricColor ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <label className="flex items-center space-x-2 cursor-pointer mb-1">
                    <input
                      type="radio"
                      name="fabricColor"
                      checked={isCustomFabricColor}
                      onChange={() => {
                        setIsCustomFabricColor(true);
                        if (customFabricColorInput.trim()) updateConfig('fabricColor', customFabricColorInput.trim());
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Fabric Color...</span>
                    </span>
                  </label>
                  {isCustomFabricColor && (
                    <input
                      type="text"
                      placeholder="Type custom color..."
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

            {/* Fabric GSM */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Fabric Density (GSM)
                </label>
                <button
                  type="button"
                  onClick={() => updateConfig('gsm', '180 GSM')}
                  className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Clear (Default 180 GSM)
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {['140 GSM', '160 GSM', '180 GSM', '200 GSM', '220 GSM'].map((gsmVal) => {
                  const isSelected = !isCustomGsm && config.gsm === gsmVal;
                  return (
                    <label
                      key={gsmVal}
                      onClick={() => toggleOption('gsm', gsmVal, () => setIsCustomGsm(false))}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
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
                        onChange={() => {}}
                        className="text-pegma-red focus:ring-pegma-red"
                      />
                    </label>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomGsm ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <label className="flex items-center space-x-2 cursor-pointer mb-1">
                    <input
                      type="radio"
                      name="gsm"
                      checked={isCustomGsm}
                      onChange={() => {
                        setIsCustomGsm(true);
                        if (customGsmInput.trim()) updateConfig('gsm', customGsmInput.trim());
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Fabric GSM...</span>
                    </span>
                  </label>
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

        {/* STEP 3: ELECTROSTATIC SAFETY RATING */}
        <AccordionCard
          stepNumber={3}
          title="ELECTROSTATIC SAFETY RATING"
          valueDisplay={config.electrostaticType || 'Type A'}
          icon={<Zap className="w-4 h-4 text-amber-500" />}
        >
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCustomElectro(false);
                updateConfig('electrostaticType', 'Type A');
              }}
              className={`p-2 rounded-xl border flex items-center justify-between text-xs font-bold transition ${
                !config.electrostaticType || config.electrostaticType === 'Type A' || config.electrostaticType === 'None'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-500 dark:text-slate-400'
              }`}
            >
              <span>Unselect (Default Type A Standard)</span>
              <X className="w-3.5 h-3.5" />
            </button>

            {[
              { label: 'Type A', desc: 'Standard non-conductive woven fabric without static protection' },
              { label: 'Type B', desc: 'Low breakdown voltage (<6kV) to prevent propagating brush discharges' },
              { label: 'Conductive Type C', desc: 'Interwoven black conductive carbon grid threads with yellow grounding tabs' },
            ].map((electro) => {
              const isSelected = !isCustomElectro && (config.electrostaticType || 'Type A') === electro.label;
              return (
                <label
                  key={electro.label}
                  onClick={() => toggleOption('electrostaticType', electro.label, () => setIsCustomElectro(false))}
                  className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10 text-pegma-dark dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="electrostaticType"
                    checked={isSelected}
                    onChange={() => {}}
                    className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                  />
                  <div>
                    <div className="text-xs font-bold">{electro.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{electro.desc}</div>
                  </div>
                </label>
              );
            })}

            <div className={`p-2.5 rounded-xl border transition ${
              isCustomElectro ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
            }`}>
              <label className="flex items-center space-x-2 cursor-pointer mb-1.5">
                <input
                  type="radio"
                  name="electrostaticType"
                  checked={isCustomElectro}
                  onChange={() => {
                    setIsCustomElectro(true);
                    if (customElectroInput.trim()) updateConfig('electrostaticType', customElectroInput.trim());
                  }}
                  className="text-pegma-red focus:ring-pegma-red"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Custom Electrostatic Spec...</span>
                </span>
              </label>
              {isCustomElectro && (
                <input
                  type="text"
                  placeholder="Type custom antistatic spec..."
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

        {/* STEP 4: TOP & BOTTOM MECHANISMS */}
        <AccordionCard
          stepNumber={4}
          title="TOP & BOTTOM MECHANISMS"
          valueDisplay={`${config.top || 'None'} • ${config.bottom || 'None'}`}
          icon={<Maximize2 className="w-4 h-4 text-emerald-500" />}
        >
          <div className="space-y-4">
            
            {/* Top Opening */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Top Opening Mechanism
                </label>
                <button
                  type="button"
                  onClick={() => updateConfig('top', 'Open Top')}
                  className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Unselect / Open Top
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'Duffle Top', desc: 'Drawstring tie closure skirt' },
                  { label: 'Filling Spout', desc: 'Cylindrical hopper loading spout' },
                  { label: 'Open Top', desc: 'Hemmed open top' },
                  { label: 'Discharge Spout Top', desc: 'Top spout mechanism' },
                ].map((tp) => {
                  const isSelected = !isCustomTop && config.top === tp.label;
                  return (
                    <label
                      key={tp.label}
                      onClick={() => toggleOption('top', tp.label, () => setIsCustomTop(false))}
                      className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="topType"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                      />
                      <div>
                        <div>{tp.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{tp.desc}</div>
                      </div>
                    </label>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomTop ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <label className="flex items-center space-x-2 cursor-pointer mb-1">
                    <input
                      type="radio"
                      name="topType"
                      checked={isCustomTop}
                      onChange={() => {
                        setIsCustomTop(true);
                        if (customTopInput.trim()) updateConfig('top', customTopInput.trim());
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Top Mechanism...</span>
                    </span>
                  </label>
                  {isCustomTop && (
                    <input
                      type="text"
                      placeholder="Type custom top..."
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Bottom Discharge Mechanism
                </label>
                <button
                  type="button"
                  onClick={() => updateConfig('bottom', 'Flat Bottom')}
                  className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Unselect / Flat Bottom
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'Discharge Spout', desc: 'Prominently extending discharge spout with closure tie' },
                  { label: 'Flat Bottom', desc: 'Completely closed flat base for pallet stability' },
                  { label: 'Discharge Spout with Petal Closure', desc: 'Discharge spout protected by star/petal cover flaps' },
                  { label: 'Full Bottom Open', desc: 'Drop-bottom release flap' },
                ].map((bt) => {
                  const isSelected = !isCustomBottom && config.bottom === bt.label;
                  return (
                    <label
                      key={bt.label}
                      onClick={() => toggleOption('bottom', bt.label, () => setIsCustomBottom(false))}
                      className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bottomType"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                      />
                      <div>
                        <div>{bt.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{bt.desc}</div>
                      </div>
                    </label>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomBottom ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <label className="flex items-center space-x-2 cursor-pointer mb-1">
                    <input
                      type="radio"
                      name="bottomType"
                      checked={isCustomBottom}
                      onChange={() => {
                        setIsCustomBottom(true);
                        if (customBottomInput.trim()) updateConfig('bottom', customBottomInput.trim());
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Bottom Mechanism...</span>
                    </span>
                  </label>
                  {isCustomBottom && (
                    <input
                      type="text"
                      placeholder="Type custom bottom..."
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

        {/* STEP 5: LIFTING LOOPS & WEBBING */}
        <AccordionCard
          stepNumber={5}
          title="LIFTING LOOPS & WEBBING"
          valueDisplay={`${config.loopType || 'None'} (${config.loopColor || 'Default'})`}
          icon={<Layers className="w-4 h-4 text-purple-500" />}
        >
          <div className="space-y-4">
            
            {/* Loop Style */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Loop Attachment Style
                </label>
                <button
                  type="button"
                  onClick={() => updateConfig('loopType', 'None')}
                  className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Unselect / Clear
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'Cross Corner', desc: 'Loops attached across corners for easy forklift loading' },
                  { label: 'Corner Loops', desc: 'Straps sewn along vertical corner seams' },
                  { label: 'Single Loop', desc: 'Central single loop for crane hook lifting' },
                  { label: 'Two Loops', desc: 'Dual overhead lifting straps' },
                ].map((lt) => {
                  const isSelected = !isCustomLoopType && config.loopType === lt.label;
                  return (
                    <label
                      key={lt.label}
                      onClick={() => toggleOption('loopType', lt.label, () => setIsCustomLoopType(false))}
                      className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="loopType"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                      />
                      <div>
                        <div>{lt.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{lt.desc}</div>
                      </div>
                    </label>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomLoopType ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <label className="flex items-center space-x-2 cursor-pointer mb-1">
                    <input
                      type="radio"
                      name="loopType"
                      checked={isCustomLoopType}
                      onChange={() => {
                        setIsCustomLoopType(true);
                        if (customLoopTypeInput.trim()) updateConfig('loopType', customLoopTypeInput.trim());
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Loop Style...</span>
                    </span>
                  </label>
                  {isCustomLoopType && (
                    <input
                      type="text"
                      placeholder="Type custom loop style..."
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

            {/* Loop Color */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Loop Strap Color
                </label>
                <button
                  type="button"
                  onClick={() => updateConfig('loopColor', 'None')}
                  className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Unselect / Clear Color
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {['Blue', 'White', 'Black', 'Red', 'Green'].map((lc) => {
                  const isSelected = !isCustomLoopColor && config.loopColor === lc;
                  return (
                    <label
                      key={lc}
                      onClick={() => toggleOption('loopColor', lc, () => setIsCustomLoopColor(false))}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
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
                        onChange={() => {}}
                        className="text-pegma-red focus:ring-pegma-red"
                      />
                    </label>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomLoopColor ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <label className="flex items-center space-x-2 cursor-pointer mb-1">
                    <input
                      type="radio"
                      name="loopColor"
                      checked={isCustomLoopColor}
                      onChange={() => {
                        setIsCustomLoopColor(true);
                        if (customLoopColorInput.trim()) updateConfig('loopColor', customLoopColorInput.trim());
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Loop Color...</span>
                    </span>
                  </label>
                  {isCustomLoopColor && (
                    <input
                      type="text"
                      placeholder="Type custom loop color..."
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

        {/* STEP 6: INNER LINERS & SIFT-PROOFING */}
        <AccordionCard
          stepNumber={6}
          title="INNER LINERS & SIFT-PROOFING"
          valueDisplay={config.linerType || 'No Liner'}
          icon={<Container className="w-4 h-4 text-indigo-500" />}
        >
          <div className="space-y-4">
            
            {/* Inner Liner */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Inner Barrier Liner
                </label>
                <button
                  type="button"
                  onClick={() => updateConfig('linerType', 'No Liner')}
                  className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Unselect / No Liner
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'No Liner', desc: 'Direct fabric containment' },
                  { label: 'Liner bag-Loose', desc: 'Clear PE liner inserted loosely' },
                  { label: 'Liner bag-Glued', desc: 'PE liner spot-glued to internal walls' },
                  { label: 'Liner bag-Tabbed', desc: 'Inner PE liner tied to corner tabs' },
                  { label: 'In House Liner Forming', desc: 'Custom 3D form-fitted PE liner' },
                  { label: 'Stranded Liner/Antistatic', desc: 'Static dissipative antistatic translucent liner' },
                  { label: 'Foil Liner', desc: 'Multi-layer aluminum foil moisture & gas barrier' },
                  { label: 'Black Conductive Liner', desc: 'Carbon-black conductive PE liner' },
                  { label: 'Baffle Liner', desc: 'Baffled form-fit inner liner' },
                  { label: 'Suspended Liner', desc: 'Inner liner suspended from top loops' },
                  { label: 'Bulk Container Liner', desc: 'Large 20ft/40ft shipping container liner' },
                ].map((lnr) => {
                  const isSelected = !isCustomLiner && (config.linerType || 'No Liner') === lnr.label;
                  return (
                    <label
                      key={lnr.label}
                      onClick={() => toggleOption('linerType', lnr.label, () => setIsCustomLiner(false))}
                      className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="linerType"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                      />
                      <div>
                        <div>{lnr.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{lnr.desc}</div>
                      </div>
                    </label>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomLiner ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <label className="flex items-center space-x-2 cursor-pointer mb-1">
                    <input
                      type="radio"
                      name="linerType"
                      checked={isCustomLiner}
                      onChange={() => {
                        setIsCustomLiner(true);
                        if (customLinerInput.trim()) updateConfig('linerType', customLinerInput.trim());
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Inner Liner...</span>
                    </span>
                  </label>
                  {isCustomLiner && (
                    <input
                      type="text"
                      placeholder="Type custom liner spec..."
                      value={customLinerInput}
                      onChange={(e) => {
                        setCustomLinerInput(e.target.value);
                        if (e.target.value.trim()) updateConfig('linerType', e.target.value.trim());
                      }}
                      className="w-full px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-pegma-red dark:text-white"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Sift-Proofing */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Seam Sealing & Sift-Proofing
                </label>
                <button
                  type="button"
                  onClick={() => updateConfig('siftProofing', 'None')}
                  className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Unselect / Clear
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'Standard Stitching', desc: 'Standard multi-row structural seam stitching' },
                  { label: 'Sift Proof Single', desc: 'Single felt cord stitched along vertical seams' },
                  { label: 'Sift Proof Double', desc: 'Double felt filler cord along all seams' },
                  { label: 'Sift Proof Triple', desc: 'Triple-sealed seams with filler cords & lamination' },
                  { label: 'Dust Proof Stitching', desc: 'Felt seam sealing tape stitched along structural seams' },
                ].map((sft) => {
                  const isSelected = !isCustomSift && (config.siftProofing || 'Standard Stitching') === sft.label;
                  return (
                    <label
                      key={sft.label}
                      onClick={() => toggleOption('siftProofing', sft.label, () => setIsCustomSift(false))}
                      className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="siftProofing"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                      />
                      <div>
                        <div>{sft.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{sft.desc}</div>
                      </div>
                    </label>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomSift ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <label className="flex items-center space-x-2 cursor-pointer mb-1">
                    <input
                      type="radio"
                      name="siftProofing"
                      checked={isCustomSift}
                      onChange={() => {
                        setIsCustomSift(true);
                        if (customSiftInput.trim()) updateConfig('siftProofing', customSiftInput.trim());
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Seam Sealing...</span>
                    </span>
                  </label>
                  {isCustomSift && (
                    <input
                      type="text"
                      placeholder="Type custom seam sealing..."
                      value={customSiftInput}
                      onChange={(e) => {
                        setCustomSiftInput(e.target.value);
                        if (e.target.value.trim()) updateConfig('siftProofing', e.target.value.trim());
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

        {/* STEP 7: BRANDING & CERTIFICATIONS */}
        <AccordionCard
          stepNumber={7}
          title="BRANDING & CERTIFICATIONS"
          valueDisplay={config.printing || 'No Printing'}
          icon={<Printer className="w-4 h-4 text-amber-500" />}
        >
          <div className="space-y-4">
            
            {/* Brand Printing */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Brand Printing & Logos
                </label>
                <button
                  type="button"
                  onClick={() => updateConfig('printing', 'No Printing')}
                  className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Unselect / No Printing
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'PEGMA', desc: 'PEGMA official logo & SWL rating' },
                  { label: 'PEGMA Heavy Duty', desc: 'Heavy industrial specs & hazardous warnings' },
                  { label: 'PEGMA Pharma Standard', desc: 'Food & Pharma clean room certified print' },
                  { label: 'No Printing', desc: 'Plain fabric surface with no logos or text' },
                ].map((pr) => {
                  const isSelected = !isCustomPrint && config.printing === pr.label;
                  return (
                    <label
                      key={pr.label}
                      onClick={() => toggleOption('printing', pr.label, () => setIsCustomPrint(false))}
                      className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                        isSelected
                          ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="printing"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                      />
                      <div>
                        <div>{pr.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{pr.desc}</div>
                      </div>
                    </label>
                  );
                })}

                <div className={`p-2 rounded-xl border transition ${isCustomPrint ? 'border-pegma-red bg-pegma-red/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                  <label className="flex items-center space-x-2 cursor-pointer mb-1">
                    <input
                      type="radio"
                      name="printing"
                      checked={isCustomPrint}
                      onChange={() => {
                        setIsCustomPrint(true);
                        if (customPrintInput.trim()) updateConfig('printing', customPrintInput.trim());
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Brand Text / Logo...</span>
                    </span>
                  </label>
                  {isCustomPrint && (
                    <input
                      type="text"
                      placeholder="Type custom brand text..."
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

            {/* Certifications & Add-ons */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Add-on Certifications & Features
              </label>
              <div className="space-y-1.5">
                {allAccessories.map((acc) => {
                  const isChecked = (config.accessories || []).includes(acc.name);
                  return (
                    <label
                      key={acc.name}
                      onClick={() => toggleAccessory(acc.name)}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition ${
                        isChecked
                          ? 'border-pegma-red bg-pegma-red/10 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700">
                          {acc.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{acc.name}</div>
                          <div className="text-[10px] text-slate-500">{acc.desc}</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-pegma-red focus:ring-pegma-red"
                      />
                    </label>
                  );
                })}

                {customAddedAccessories.map((cAcc) => (
                  <label
                    key={cAcc}
                    onClick={() => toggleAccessory(cAcc)}
                    className="flex items-center justify-between p-2 rounded-xl border border-pegma-red bg-pegma-red/10 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Edit3 className="w-3.5 h-3.5 text-pegma-red" />
                      <span className="text-xs font-bold">{cAcc} (Custom)</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => {}}
                      className="rounded text-pegma-red focus:ring-pegma-red"
                    />
                  </label>
                ))}

                <form onSubmit={handleAddCustomAccessory} className="pt-1 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type custom accessory / feature..."
                    value={customAccessoryInput}
                    onChange={(e) => setCustomAccessoryInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pegma-red dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-pegma-red hover:bg-pegma-red-hover text-white font-bold rounded-xl text-xs flex items-center space-x-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </AccordionCard>

        {/* STEP 8: ADDS / EXTRA SPECIFICATIONS */}
        <AccordionCard
          stepNumber={8}
          title="ADDS / EXTRA SPECIFICATIONS"
          valueDisplay={
            (config.accessories || []).length > 0
              ? `${(config.accessories || []).length} Active Extra(s)`
              : 'Extra Engineering Notes'
          }
          icon={<FileSpreadsheet className="w-4 h-4 text-emerald-500" />}
        >
          <div className="space-y-3">
            
            {/* Active Added Extras List with Delete X buttons */}
            {(config.accessories || []).length > 0 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    ACTIVE EXTRAS & SPECIFICATIONS ({(config.accessories || []).length})
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
                        onClick={() => toggleAccessory(item)}
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
                Add Custom Notes & Technical Specifications
              </label>
              <form onSubmit={handleAddExtraNotes} className="space-y-2">
                <textarea
                  rows={3}
                  placeholder="Type any extra information, custom dimensions (e.g. 90x90x120 cm), special handling notes, thread matching specs..."
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
                Quick Add Presets
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
                      onClick={() => toggleAccessory(tag)}
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
