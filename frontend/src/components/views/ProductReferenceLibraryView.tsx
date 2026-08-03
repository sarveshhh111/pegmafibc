import React, { useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { 
  BookOpen, 
  Layers, 
  ShieldAlert, 
  Box, 
  CheckCircle, 
  ArrowRight, 
  Search, 
  Tag, 
  Sparkles,
  Zap,
  Award,
  Lock,
  PackageCheck
} from 'lucide-react';

interface ReferenceProduct {
  id: string;
  name: string;
  category: string;
  tag: string;
  description: string;
  technicalDirective: string;
  features: string[];
  sampleConfig: {
    bagType: string;
    capacity: string;
    fabricColor: string;
    gsm: string;
    top: string;
    bottom: string;
    loopType: string;
    loopColor: string;
    printing: string;
    printingColor: string;
    printingPosition: string;
    accessories: string[];
  };
}

export const ProductReferenceLibraryView: React.FC = () => {
  const { updateConfig, setActiveTab, showToast } = useConfigurator();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const products: ReferenceProduct[] = [
    // Construction
    {
      id: 'ref-u-panel',
      name: 'U-Panel Bulk Bag',
      category: 'Construction',
      tag: 'Industry Standard',
      description: 'Single continuous U-shaped fabric panel forming the base and two opposite side walls with two vertical side seams.',
      technicalDirective: 'Single U-shaped main fabric panel forming bottom and two opposite sides, with two vertical side seams.',
      features: ['High structural strength', 'Versatile multi-industry application', 'Optimal cost-performance ratio'],
      sampleConfig: {
        bagType: 'U-Panel',
        capacity: '1000 kg',
        fabricColor: 'White',
        gsm: '180 GSM',
        top: 'Duffle Top',
        bottom: 'Discharge Spout',
        loopType: 'Cross Corner',
        loopColor: 'Blue',
        printing: 'PEGMA',
        printingColor: 'Red',
        printingPosition: 'Center Front',
        accessories: []
      }
    },
    {
      id: 'ref-4-panel',
      name: '4-Panel Bulk Bag',
      category: 'Construction',
      tag: 'Heavy Duty',
      description: 'Four separate side panels sewn to a base panel offering superior square shape retention and stacking strength.',
      technicalDirective: 'Four distinct side panels sewn together at all four vertical corner seams to form a clean square box profile.',
      features: ['Maximum stacking capacity', 'Four-corner structural rigidity', 'Ideal for dense mineral powders'],
      sampleConfig: {
        bagType: '4-Panel',
        capacity: '1500 kg',
        fabricColor: 'White',
        gsm: '200 GSM',
        top: 'Filling Spout',
        bottom: 'Discharge Spout',
        loopType: 'Corner Loops',
        loopColor: 'Blue',
        printing: 'PEGMA Heavy Duty',
        printingColor: 'Red',
        printingPosition: 'Center Front',
        accessories: ['UN Certified']
      }
    },
    {
      id: 'ref-circular',
      name: 'Circular (Tubular) Bag',
      category: 'Construction',
      tag: 'Seamless',
      description: 'Seamless circular woven polypropylene body with no vertical side seams, reducing potential leakage points.',
      technicalDirective: 'Continuous tubular seamless woven polypropylene body with no vertical corner seams.',
      features: ['Zero vertical side seams', 'High seam integrity for powders', 'Economical high-volume production'],
      sampleConfig: {
        bagType: 'Circular / Tubular',
        capacity: '1000 kg',
        fabricColor: 'White',
        gsm: '160 GSM',
        top: 'Duffle Top',
        bottom: 'Discharge Spout',
        loopType: 'Cross Corner',
        loopColor: 'Blue',
        printing: 'PEGMA',
        printingColor: 'Red',
        printingPosition: 'Center Front',
        accessories: []
      }
    },
    {
      id: 'ref-2-panel',
      name: '2-Panel Bag',
      category: 'Construction',
      tag: 'Classic',
      description: 'Two main fabric panels forming front, back, and base with reinforced side seams.',
      technicalDirective: 'Two main fabric panels forming front, back, and base with side seams.',
      features: ['Simple rugged design', 'Ideal for single and double loop configurations', 'Cost efficient'],
      sampleConfig: {
        bagType: '2-Panel',
        capacity: '1000 kg',
        fabricColor: 'White',
        gsm: '180 GSM',
        top: 'Open Top',
        bottom: 'Flat Bottom',
        loopType: 'Two Loops',
        loopColor: 'Blue',
        printing: 'PEGMA',
        printingColor: 'Red',
        printingPosition: 'Center Front',
        accessories: []
      }
    },

    // Baffle Bags
    {
      id: 'ref-baffle',
      name: 'Baffle Bag (Q-Bag)',
      category: 'Baffle Bags',
      tag: 'Non-Bulging',
      description: 'Features internal corner fabric baffles that act as tension ties to prevent side bulging and maintain square form.',
      technicalDirective: 'Internal fabric corner baffles preventing bulging, maintaining an exact square cubic box shape.',
      features: ['Saves up to 30% storage space', 'Fits neatly inside shipping containers', 'Self-standing rigid posture'],
      sampleConfig: {
        bagType: 'Baffle Bag (Q-Bag)',
        capacity: '1000 kg',
        fabricColor: 'White',
        gsm: '180 GSM',
        top: 'Filling Spout',
        bottom: 'Discharge Spout',
        loopType: 'Cross Corner',
        loopColor: 'Blue',
        printing: 'PEGMA',
        printingColor: 'Red',
        printingPosition: 'Center Front',
        accessories: ['Baffle']
      }
    },
    {
      id: 'ref-net-baffle',
      name: 'Net Baffle Bag',
      category: 'Baffle Bags',
      tag: 'Mesh Flow',
      description: 'Internal heavy-duty polypropylene net mesh baffles designed for rapid, uninhibited material flow.',
      technicalDirective: 'Internal heavy-duty polypropylene net mesh baffles visible inside top opening.',
      features: ['Allows free flow of large granules', 'Prevents corner clogging', 'High strength mesh ties'],
      sampleConfig: {
        bagType: 'Baffle Bag (Q-Bag)',
        capacity: '1250 kg',
        fabricColor: 'White',
        gsm: '200 GSM',
        top: 'Filling Spout',
        bottom: 'Discharge Spout',
        loopType: 'Cross Corner',
        loopColor: 'Blue',
        printing: 'PEGMA',
        printingColor: 'Red',
        printingPosition: 'Center Front',
        accessories: ['Net Baffle Bag']
      }
    },

    // Electrostatic Safety
    {
      id: 'ref-type-c',
      name: 'Conductive Type C Bag',
      category: 'Electrostatic Safety',
      tag: 'Ex Safety Grounded',
      description: 'Constructed with interwoven black conductive carbon threads connected to yellow grounding tabs to dissipate static charges safely.',
      technicalDirective: 'Interwoven black conductive carbon threads forming a visible grid pattern across the fabric, with yellow grounding tabs.',
      features: ['Safe for flammable powder filling', 'Interwoven carbon grid', 'Requires grounding during operation'],
      sampleConfig: {
        bagType: 'Conductive Type C',
        capacity: '1000 kg',
        fabricColor: 'White',
        gsm: '200 GSM',
        top: 'Filling Spout',
        bottom: 'Discharge Spout',
        loopType: 'Cross Corner',
        loopColor: 'Black',
        printing: 'PEGMA Heavy Duty',
        printingColor: 'Black',
        printingPosition: 'Center Front',
        accessories: ['Conductive Type C', 'UN Certified']
      }
    },
    {
      id: 'ref-type-b',
      name: 'Type B Antistatic Bag',
      category: 'Electrostatic Safety',
      tag: 'Low Breakdown Voltage',
      description: 'Designed with low breakdown voltage (<6kV) to prevent propagating brush discharges in dust environments.',
      technicalDirective: 'Low breakdown voltage antistatic fabric finish.',
      features: ['Prevents spark discharges', 'Low breakdown voltage coating', 'Ideal for fine dust atmospheres'],
      sampleConfig: {
        bagType: 'Type B',
        capacity: '1000 kg',
        fabricColor: 'White',
        gsm: '180 GSM',
        top: 'Duffle Top',
        bottom: 'Discharge Spout',
        loopType: 'Cross Corner',
        loopColor: 'Blue',
        printing: 'PEGMA',
        printingColor: 'Red',
        printingPosition: 'Center Front',
        accessories: ['Type B']
      }
    },

    // Sift Proofing & Certified
    {
      id: 'ref-sift-triple',
      name: 'Sift-Proof Triple Seam Bag',
      category: 'Sift-Proofing & Certified',
      tag: 'Zero Leakage',
      description: 'Triple-sealed dust-proof seams with filler cords and laminated coating for ultra-fine powders and active ingredients.',
      technicalDirective: 'Triple-sealed dust-proof seams with filler cords and laminated coating for ultra-fine powders.',
      features: ['Triple seam felt sealing', 'Prevents fine particle migration', 'Zero powder seepage'],
      sampleConfig: {
        bagType: 'U-Panel',
        capacity: '1000 kg',
        fabricColor: 'White',
        gsm: '180 GSM',
        top: 'Filling Spout',
        bottom: 'Discharge Spout',
        loopType: 'Cross Corner',
        loopColor: 'Blue',
        printing: 'PEGMA',
        printingColor: 'Red',
        printingPosition: 'Center Front',
        accessories: ['Sift Proof Triple', 'Dust Proof Stitching']
      }
    },
    {
      id: 'ref-un-bags',
      name: 'UN Certified Hazardous Bag',
      category: 'Sift-Proofing & Certified',
      tag: 'Hazardous Goods',
      description: 'Certified under UN Dangerous Goods regulations for transporting hazardous materials, toxic waste, and chemicals.',
      technicalDirective: 'UN certified hazardous material bag with official UN circle symbol and code printed on front panel.',
      features: ['Rigorously drop and stack tested', 'Official UN symbol print', 'Hazardous class compliance'],
      sampleConfig: {
        bagType: '4-Panel',
        capacity: '1000 kg',
        fabricColor: 'White',
        gsm: '200 GSM',
        top: 'Filling Spout',
        bottom: 'Discharge Spout',
        loopType: 'Cross Corner',
        loopColor: 'Blue',
        printing: 'PEGMA Heavy Duty',
        printingColor: 'Black',
        printingPosition: 'Center Front',
        accessories: ['UN Certified']
      }
    },
    {
      id: 'ref-asbestos',
      name: 'Asbestos Plate Bag',
      category: 'Sift-Proofing & Certified',
      tag: 'Specialized Hazard',
      description: 'Heavy-duty rectangular bag with reinforced liner designed specifically for the safe containment and disposal of asbestos sheets.',
      technicalDirective: 'Flat rectangular heavy duty UN asbestos plate bag with hazard warnings and sealed PE liner.',
      features: ['Rectangular plate design', 'Reinforced double PE liner', 'Hazard warning print'],
      sampleConfig: {
        bagType: 'Asbestos Plate Bag',
        capacity: '1500 kg',
        fabricColor: 'White',
        gsm: '220 GSM',
        top: 'Duffle Top',
        bottom: 'Flat Bottom',
        loopType: 'Corner Loops',
        loopColor: 'Red',
        printing: 'PEGMA Heavy Duty',
        printingColor: 'Red',
        printingPosition: 'Center Front',
        accessories: ['Asbestos Plate Bag', 'UN Certified', 'PE Liner']
      }
    },
    {
      id: 'ref-food-grade',
      name: 'Food & Pharma Grade Bag',
      category: 'Sift-Proofing & Certified',
      tag: 'Cleanroom Certified',
      description: 'Manufactured in BRC / ISO 22000 certified cleanroom environment with ultrasonic cut edges and zero loose threads.',
      technicalDirective: 'Clean room manufactured pristine white food-grade FIBC bag with food safety certification badge.',
      features: ['100% virgin polypropylene', 'Ultrasonic cut fabric edges', 'Food & Pharma cleanroom certified'],
      sampleConfig: {
        bagType: 'U-Panel',
        capacity: '1000 kg',
        fabricColor: 'White',
        gsm: '180 GSM',
        top: 'Filling Spout',
        bottom: 'Discharge Spout',
        loopType: 'Cross Corner',
        loopColor: 'White',
        printing: 'PEGMA Pharma Standard',
        printingColor: 'Blue',
        printingPosition: 'Center Front',
        accessories: ['Food Grade', 'PE Liner']
      }
    },

    // Liners
    {
      id: 'ref-foil-liner',
      name: 'Foil Barrier Liner Bag',
      category: 'Inner Liners',
      tag: 'Moisture & Oxygen Barrier',
      description: 'Multi-layer aluminum foil barrier liner providing maximum protection against moisture, humidity, oxygen, and gas migration.',
      technicalDirective: 'Metallic silver aluminum foil barrier liner providing high moisture and gas barrier.',
      features: ['Zero moisture vapor transmission', 'Protects hygroscopic materials', 'Aluminum barrier layer'],
      sampleConfig: {
        bagType: 'U-Panel',
        capacity: '1000 kg',
        fabricColor: 'White',
        gsm: '180 GSM',
        top: 'Filling Spout',
        bottom: 'Discharge Spout',
        loopType: 'Cross Corner',
        loopColor: 'Blue',
        printing: 'PEGMA',
        printingColor: 'Red',
        printingPosition: 'Center Front',
        accessories: ['Foil Liner']
      }
    },
    {
      id: 'ref-black-conductive-liner',
      name: 'Black Conductive Liner',
      category: 'Inner Liners',
      tag: 'Carbon Dissipative',
      description: 'Carbon-black impregnated conductive polyethylene liner designed for Type C explosive powder environments.',
      technicalDirective: 'Black conductive carbon PE liner.',
      features: ['Conductive carbon PE film', 'Integrates with Type C bags', 'Prevents internal charge accumulation'],
      sampleConfig: {
        bagType: 'Conductive Type C',
        capacity: '1000 kg',
        fabricColor: 'White',
        gsm: '200 GSM',
        top: 'Filling Spout',
        bottom: 'Discharge Spout',
        loopType: 'Cross Corner',
        loopColor: 'Black',
        printing: 'PEGMA Heavy Duty',
        printingColor: 'Black',
        printingPosition: 'Center Front',
        accessories: ['Black Conductive Liner', 'Conductive Type C']
      }
    },
    {
      id: 'ref-formed-liner',
      name: 'In-House Formed Liner',
      category: 'Inner Liners',
      tag: '3D Form-Fit',
      description: 'Custom 3D bottle-shaped form-fitted polyethylene liner matching the exact internal contours of the outer FIBC bag.',
      technicalDirective: 'Custom form-fitted polyethylene inner liner conforming exactly to bag geometry.',
      features: ['No internal creases or folds', 'Smooth complete discharge', 'Custom heat-sealed geometry'],
      sampleConfig: {
        bagType: 'U-Panel',
        capacity: '1000 kg',
        fabricColor: 'White',
        gsm: '180 GSM',
        top: 'Filling Spout',
        bottom: 'Discharge Spout',
        loopType: 'Cross Corner',
        loopColor: 'Blue',
        printing: 'PEGMA',
        printingColor: 'Red',
        printingPosition: 'Center Front',
        accessories: ['In House Liner Forming', 'PE Liner']
      }
    }
  ];

  const categories = ['All', 'Construction', 'Baffle Bags', 'Electrostatic Safety', 'Sift-Proofing & Certified', 'Inner Liners'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.tag.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectReference = (product: ReferenceProduct) => {
    Object.entries(product.sampleConfig).forEach(([key, val]) => {
      updateConfig(key as any, val);
    });
    setActiveTab('configurator');
    showToast(`Loaded specs for '${product.name}' into Configurator`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-pegma-red/10 text-pegma-red rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              PEGMA Product Reference Library
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified technical reference specifications for AI Gemini rendering
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search product references..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pegma-red dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === cat
                ? 'bg-pegma-red text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Reference Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div 
            key={p.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft hover:shadow-glow transition-all duration-200 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pegma-red/10 text-pegma-red uppercase tracking-wider mb-1">
                    {p.category}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-pegma-red transition">
                    {p.name}
                  </h3>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold rounded-lg">
                  {p.tag}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {p.description}
              </p>

              {/* Feature Pills */}
              <div className="space-y-1.5 pt-1">
                {p.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-[11px] text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-pegma-success flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Technical Prompt Directive Box */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Gemini AI Technical Directive</span>
                </div>
                <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300 leading-snug">
                  "{p.technicalDirective}"
                </p>
              </div>

            </div>

            {/* Load Action Button */}
            <button
              onClick={() => handleSelectReference(p)}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-pegma-red hover:text-white text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2 group-hover:shadow-sm"
            >
              <span>Load Spec into Configurator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        ))}
      </div>

    </div>
  );
};
