import React from 'react';
import { HelpCircle, Mail, Phone, Globe, ShieldCheck, FileText } from 'lucide-react';

export const HelpView: React.FC = () => {
  const faqs = [
    {
      q: "What is FIBC (Flexible Intermediate Bulk Container)?",
      a: "An FIBC, also known as a jumbo bag or bulk bag, is an industrial container made of flexible woven polypropylene designed for storing and transporting dry bulk products such as powders, grains, and minerals."
    },
    {
      q: "What does SWL (Safe Working Load) mean?",
      a: "SWL specifies the maximum weight capacity the bag is certified to safely hold (e.g. 1000 kg, 1500 kg, 2000 kg) with a standard safety factor ratio of 5:1 or 6:1."
    },
    {
      q: "What is a Baffle Bag (Q-Bag)?",
      a: "Baffle bags contain internal fabric dividers that maintain a square box-like posture when filled, saving up to 30% storage space during container shipping."
    },
    {
      q: "How does the Gemini AI Visualizer work?",
      a: "Our backend converts your exact structural and branding choices into photorealistic 3D lighting prompts and sends them to Google's Gemini Image API to render accurate product imagery."
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Help & Technical Documentation
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Learn about FIBC specifications, bag construction, and PEGMA packaging solutions
        </p>
      </div>

      {/* FAQs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="space-y-1">
              <h4 className="text-xs font-bold text-pegma-red">
                {faq.q}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Contact */}
      <div className="bg-gradient-to-br from-slate-900 to-pegma-dark rounded-3xl p-6 text-white space-y-4 border border-slate-800">
        <h3 className="text-sm font-bold">Contact PEGMA Engineering Team</h3>
        <p className="text-xs text-slate-300">
          Need custom bulk bag engineering, UN certification testing, or large quantity quotes?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <Mail className="w-4 h-4 text-pegma-red" />
            <span>sales@pegma.in</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <Phone className="w-4 h-4 text-pegma-red" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <Globe className="w-4 h-4 text-pegma-red" />
            <span>www.pegma.in</span>
          </div>
        </div>
      </div>

    </div>
  );
};
