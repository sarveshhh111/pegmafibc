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
          valueDisplay={config.bagType}
          icon={<Box className="w-4 h-4 text-pegma-red" />}
        >
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'None of These', desc: 'Standard bulk bag construction without specific panel/baffle requirements' },
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
            ].map((type) => (
              <label
                key={type.label}
                className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer transition ${
                  !isCustomBagType && config.bagType === type.label
                    ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10 text-pegma-dark dark:text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="bagType"
                  checked={!isCustomBagType && config.bagType === type.label}
                  onChange={() => {
                    setIsCustomBagType(false);
                    updateConfig('bagType', type.label);
                  }}
                  className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                />
                <div>
                  <div className="text-xs font-bold">{type.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{type.desc}</div>
                </div>
              </label>
            ))}

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
          valueDisplay={`${config.capacity} • ${config.fabricColor} • ${config.gsm}`}
          icon={<Weight className="w-4 h-4 text-blue-500" />}
        >
          <div className="space-y-4">
            
            {/* SWL Capacity */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Safe Working Load (SWL)
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {['500 kg', '1000 kg', '1250 kg', '1500 kg', '2000 kg'].map((cap) => (
                  <label
                    key={cap}
                    className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                      !isCustomCapacity && config.capacity === cap
                        ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{cap}</span>
                    <input
                      type="radio"
                      name="capacity"
                      checked={!isCustomCapacity && config.capacity === cap}
                      onChange={() => {
                        setIsCustomCapacity(false);
                        updateConfig('capacity', cap);
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                  </label>
                ))}

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
                      placeholder="Type custom SWL (e.g. 750 kg, 2500 kg)..."
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
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Fabric Color
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {['White', 'Beige / Tan', 'Black', 'Blue', 'Green'].map((col) => (
                  <label
                    key={col}
                    className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                      !isCustomFabricColor && config.fabricColor === col
                        ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{col}</span>
                    <input
                      type="radio"
                      name="fabricColor"
                      checked={!isCustomFabricColor && config.fabricColor === col}
                      onChange={() => {
                        setIsCustomFabricColor(false);
                        updateConfig('fabricColor', col);
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                  </label>
                ))}

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
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Fabric Density (GSM)
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {['140 GSM', '160 GSM', '180 GSM', '200 GSM', '220 GSM'].map((gsmVal) => (
                  <label
                    key={gsmVal}
                    className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                      !isCustomGsm && config.gsm === gsmVal
                        ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{gsmVal}</span>
                    <input
                      type="radio"
                      name="gsm"
                      checked={!isCustomGsm && config.gsm === gsmVal}
                      onChange={() => {
                        setIsCustomGsm(false);
                        updateConfig('gsm', gsmVal);
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                  </label>
                ))}

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
                      placeholder="Type custom GSM (e.g. 240 GSM)..."
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
            {[
              { label: 'Type A', desc: 'Standard non-conductive woven fabric without static protection' },
              { label: 'Type B', desc: 'Low breakdown voltage (<6kV) to prevent propagating brush discharges' },
              { label: 'Conductive Type C', desc: 'Interwoven black conductive carbon grid threads with yellow grounding tabs' },
            ].map((electro) => (
              <label
                key={electro.label}
                className={`flex items-start space-x-3 p-2.5 rounded-xl border cursor-pointer transition ${
                  !isCustomElectro && (config.electrostaticType || 'Type A') === electro.label
                    ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10 text-pegma-dark dark:text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="electrostaticType"
                  checked={!isCustomElectro && (config.electrostaticType || 'Type A') === electro.label}
                  onChange={() => {
                    setIsCustomElectro(false);
                    updateConfig('electrostaticType', electro.label);
                  }}
                  className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                />
                <div>
                  <div className="text-xs font-bold">{electro.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{electro.desc}</div>
                </div>
              </label>
            ))}

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
          valueDisplay={`${config.top} • ${config.bottom}`}
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
                  { label: 'Duffle Top', desc: 'Drawstring tie closure skirt' },
                  { label: 'Filling Spout', desc: 'Cylindrical hopper loading spout' },
                  { label: 'Open Top', desc: 'Hemmed open top' },
                  { label: 'Discharge Spout Top', desc: 'Top spout mechanism' },
                ].map((tp) => (
                  <label
                    key={tp.label}
                    className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                      !isCustomTop && config.top === tp.label
                        ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="topType"
                      checked={!isCustomTop && config.top === tp.label}
                      onChange={() => {
                        setIsCustomTop(false);
                        updateConfig('top', tp.label);
                      }}
                      className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                    />
                    <div>
                      <div>{tp.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{tp.desc}</div>
                    </div>
                  </label>
                ))}

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
                  { label: 'Discharge Spout', desc: 'Prominently extending discharge spout with closure tie' },
                  { label: 'Flat Bottom', desc: 'Completely closed flat base for pallet stability' },
                  { label: 'Discharge Spout with Petal Closure', desc: 'Discharge spout protected by star/petal cover flaps' },
                  { label: 'Full Bottom Open', desc: 'Drop-bottom release flap' },
                ].map((bt) => (
                  <label
                    key={bt.label}
                    className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                      !isCustomBottom && config.bottom === bt.label
                        ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bottomType"
                      checked={!isCustomBottom && config.bottom === bt.label}
                      onChange={() => {
                        setIsCustomBottom(false);
                        updateConfig('bottom', bt.label);
                      }}
                      className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                    />
                    <div>
                      <div>{bt.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{bt.desc}</div>
                    </div>
                  </label>
                ))}

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

        {/* STEP 5: LIFTING LOOPS & WEBBING */}
        <AccordionCard
          stepNumber={5}
          title="LIFTING LOOPS & WEBBING"
          valueDisplay={`${config.loopType} (${config.loopColor})`}
          icon={<Layers className="w-4 h-4 text-purple-500" />}
        >
          <div className="space-y-4">
            
            {/* Loop Style */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Loop Attachment Style
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'Cross Corner', desc: 'Loops attached across corners for easy forklift loading' },
                  { label: 'Corner Loops', desc: 'Straps sewn along vertical corner seams' },
                  { label: 'Single Loop', desc: 'Central single loop for crane hook lifting' },
                  { label: 'Two Loops', desc: 'Dual overhead lifting straps' },
                ].map((lt) => (
                  <label
                    key={lt.label}
                    className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                      !isCustomLoopType && config.loopType === lt.label
                        ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="loopType"
                      checked={!isCustomLoopType && config.loopType === lt.label}
                      onChange={() => {
                        setIsCustomLoopType(false);
                        updateConfig('loopType', lt.label);
                      }}
                      className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                    />
                    <div>
                      <div>{lt.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{lt.desc}</div>
                    </div>
                  </label>
                ))}

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
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Loop Strap Color
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {['Blue', 'White', 'Black', 'Red', 'Green'].map((lc) => (
                  <label
                    key={lc}
                    className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                      !isCustomLoopColor && config.loopColor === lc
                        ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{lc}</span>
                    <input
                      type="radio"
                      name="loopColor"
                      checked={!isCustomLoopColor && config.loopColor === lc}
                      onChange={() => {
                        setIsCustomLoopColor(false);
                        updateConfig('loopColor', lc);
                      }}
                      className="text-pegma-red focus:ring-pegma-red"
                    />
                  </label>
                ))}

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
          valueDisplay={config.linerType || 'Standard PE Liner'}
          icon={<Container className="w-4 h-4 text-indigo-500" />}
        >
          <div className="space-y-4">
            
            {/* Inner Liner */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Inner Barrier Liner
              </label>
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
                ].map((lnr) => (
                  <label
                    key={lnr.label}
                    className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                      !isCustomLiner && (config.linerType || 'Liner bag-Loose') === lnr.label
                        ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="linerType"
                      checked={!isCustomLiner && (config.linerType || 'Liner bag-Loose') === lnr.label}
                      onChange={() => {
                        setIsCustomLiner(false);
                        updateConfig('linerType', lnr.label);
                      }}
                      className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                    />
                    <div>
                      <div>{lnr.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{lnr.desc}</div>
                    </div>
                  </label>
                ))}

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
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Seam Sealing & Sift-Proofing
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'Standard Stitching', desc: 'Standard multi-row structural seam stitching' },
                  { label: 'Sift Proof Single', desc: 'Single felt cord stitched along vertical seams' },
                  { label: 'Sift Proof Double', desc: 'Double felt filler cord along all seams' },
                  { label: 'Sift Proof Triple', desc: 'Triple-sealed seams with filler cords & lamination' },
                  { label: 'Dust Proof Stitching', desc: 'Felt seam sealing tape stitched along structural seams' },
                ].map((sft) => (
                  <label
                    key={sft.label}
                    className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                      !isCustomSift && (config.siftProofing || 'Standard Stitching') === sft.label
                        ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="siftProofing"
                      checked={!isCustomSift && (config.siftProofing || 'Standard Stitching') === sft.label}
                      onChange={() => {
                        setIsCustomSift(false);
                        updateConfig('siftProofing', sft.label);
                      }}
                      className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                    />
                    <div>
                      <div>{sft.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{sft.desc}</div>
                    </div>
                  </label>
                ))}

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
          valueDisplay={config.printing}
          icon={<Printer className="w-4 h-4 text-amber-500" />}
        >
          <div className="space-y-4">
            
            {/* Brand Printing */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Brand Printing & Logos
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'PEGMA', desc: 'PEGMA official logo & SWL rating' },
                  { label: 'PEGMA Heavy Duty', desc: 'Heavy industrial specs & hazardous warnings' },
                  { label: 'PEGMA Pharma Standard', desc: 'Food & Pharma clean room certified print' },
                  { label: 'No Printing', desc: 'Plain fabric surface with no logos or text' },
                ].map((pr) => (
                  <label
                    key={pr.label}
                    className={`flex items-start space-x-3 p-2 rounded-xl border cursor-pointer text-xs font-bold transition ${
                      !isCustomPrint && config.printing === pr.label
                        ? 'border-pegma-red bg-pegma-red/10 text-pegma-red'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="printing"
                      checked={!isCustomPrint && config.printing === pr.label}
                      onChange={() => {
                        setIsCustomPrint(false);
                        updateConfig('printing', pr.label);
                      }}
                      className="mt-0.5 text-pegma-red focus:ring-pegma-red"
                    />
                    <div>
                      <div>{pr.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{pr.desc}</div>
                    </div>
                  </label>
                ))}

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
