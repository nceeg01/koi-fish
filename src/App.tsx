import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fish, Info, Timer, Zap, Download, ExternalLink, Moon, Sparkles, Palette } from 'lucide-react';
import { Koi } from './Koi.tsx';
import quotes from './quotes.json';

const KOI_COLORS = [
  '#D94126', // Vermilion
  '#2D2D2D', // Ink
  '#4A90E2', // Water Blue
  '#F5A623', // Golden
  '#7ED321', // Nature Green
  '#BD10E0'  // Lotus Purple
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'demo' | 'info' | 'quotes'>('demo');
  const [koiColor, setKoiColor] = useState('#D94126');
  const [frequency, setFrequency] = useState(30);
  const isPopup = window.innerWidth < 500;

  // Load settings on mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['koiColor', 'spawnFrequency'], (result) => {
        if (result.koiColor) setKoiColor(result.koiColor);
        if (result.spawnFrequency) setFrequency(result.spawnFrequency);
      });
    }
  }, []);

  const updateColor = (color: string) => {
    setKoiColor(color);
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ koiColor: color });
    }
  };

  const updateFrequency = (val: number) => {
    setFrequency(val);
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ spawnFrequency: val });
      // Update background alarm if needed
      chrome.runtime.sendMessage({ action: 'updateAlarm', frequency: val });
    }
  };

  const spawnKoi = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: 'spawnNow' });
    }
    window.dispatchEvent(new CustomEvent('koi-zen-spawn'));
  };

  if (isPopup) {
    return (
      <div className="w-[350px] bg-editorial-cream p-8 text-editorial-ink font-serif border border-editorial-border">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-editorial-vermilion rounded-full flex items-center justify-center text-white border border-white/10 shadow-lg">
            <Fish size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight italic">Koi-Zen <span className="opacity-40 font-normal">v3.1</span></span>
        </div>
        
        <div className="bg-white p-6 rounded-tr-2xl rounded-bl-2xl border border-editorial-border mb-6 shadow-xl space-y-6">
          <div>
            <h3 className="font-sans font-black text-[10px] uppercase tracking-[0.3em] text-editorial-vermilion mb-4">Color Palette</h3>
            <div className="flex gap-2">
              {KOI_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => updateColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform active:scale-90 ${koiColor === color ? 'border-editorial-ink scale-125' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-sans font-black text-[10px] uppercase tracking-[0.3em] text-editorial-vermilion mb-4">Manual Bypass</h3>
            <button 
              onClick={spawnKoi}
              className="w-full py-4 bg-editorial-ink text-white rounded-lg font-sans font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-editorial-vermilion transition-all shadow-md active:scale-95"
            >
              <Zap size={14} className="inline mr-2" />
              Inject Koi
            </button>
          </div>
        </div>

        <div className="bg-editorial-paper p-4 border border-editorial-border flex items-center justify-between font-sans text-[9px] font-black uppercase tracking-[0.3em] opacity-30">
          <span>Freq: {frequency}m</span>
          <span>Injected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-editorial-cream text-editorial-ink font-serif selection:bg-editorial-vermilion selection:text-white flex flex-col">
      {/* Editorial Header */}
      <header className="flex justify-between items-center px-12 py-10 border-b border-editorial-border">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-editorial-vermilion rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(217,65,38,0.3)] border border-white/10">
            <Fish size={32} />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black tracking-tight leading-none italic">Koi-Zen</span>
            <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] opacity-20 mt-1">Edition 3.1</span>
          </div>
        </div>
        <nav className="flex gap-14 text-xs uppercase tracking-[0.3em] font-sans font-black">
          <button 
            onClick={() => setActiveTab('demo')}
            className={`transition-all pb-1.5 border-b-2 ${activeTab === 'demo' ? 'opacity-100 border-editorial-ink' : 'opacity-20 border-transparent hover:opacity-100'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('quotes')}
            className={`transition-all pb-1.5 border-b-2 ${activeTab === 'quotes' ? 'opacity-100 border-editorial-ink' : 'opacity-20 border-transparent hover:opacity-100'}`}
          >
            Library
          </button>
          <button 
            onClick={() => setActiveTab('info')}
            className={`transition-all pb-1.5 border-b-2 ${activeTab === 'info' ? 'opacity-100 border-editorial-ink' : 'opacity-20 border-transparent hover:opacity-100'}`}
          >
            Manifest
          </button>
        </nav>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Section: Live Preview Mock */}
        <section className="w-3/5 border-r border-editorial-border bg-editorial-paper relative overflow-hidden flex flex-col items-center justify-center p-24">
          <div className="absolute inset-20 opacity-10 blur-2xl pointer-events-none">
            <div className="h-full w-full bg-editorial-ink/5 rounded-[80px] border-[60px] border-editorial-ink/5 animate-pulse" />
          </div>

          <div className="w-full h-full flex flex-col justify-end items-start relative z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 scale-125">
              <Koi size={340} color={koiColor} />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 40, rotate: -1 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-12 max-w-sm rounded-tr-[56px] rounded-bl-[56px] shadow-[0_50px_120px_rgba(0,0,0,0.12)] border border-editorial-ink/5 relative"
            >
              <p className="text-3xl leading-snug italic mb-8">
                "The impediment to action advances action. What stands in the way becomes the way."
              </p>
              <div className="flex items-center gap-5">
                <div className="w-12 h-[2px] bg-editorial-vermilion" />
                <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-black text-editorial-vermilion">Stoic Data Stream</span>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-12 left-14 flex gap-10 items-center bg-editorial-cream/60 backdrop-blur-md px-8 py-4 rounded-full border border-editorial-border shadow-sm">
            <div className="flex flex-col">
              <span className="font-sans text-[9px] uppercase tracking-tighter opacity-40 font-black">Shadow DOM</span>
              <span className="text-sm font-bold opacity-80 italic">Protected Injection</span>
            </div>
          </div>
        </section>

        {/* Right Section: Control Panel */}
        <section className="w-2/5 p-20 flex flex-col bg-editorial-cream overflow-y-auto">
          <div className="mb-20">
            <h2 className="text-7xl font-light mb-4 italic tracking-tighter">Control</h2>
            <p className="font-sans text-[10px] uppercase tracking-[0.4em] opacity-30 font-black leading-none">System Configuration & Logs</p>
          </div>

          <div className="space-y-16 flex-1">
            <div className="border-t border-editorial-border pt-10">
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-2xl font-bold italic tracking-tight">Appearance</h3>
                <span className="font-sans text-[10px] font-black tracking-widest opacity-40 uppercase">Selected Color</span>
              </div>
              <div className="flex gap-4">
                {KOI_COLORS.map(color => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateColor(color)}
                    className={`w-10 h-10 rounded-full border-4 transition-all shadow-lg ${koiColor === color ? 'border-editorial-ink ring-4 ring-editorial-vermilion/20' : 'border-white'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-editorial-border pt-10">
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-2xl font-bold italic tracking-tight">Spawn Frequency</h3>
                <span className="font-sans text-xs font-black tracking-widest opacity-40">{frequency} MINUTES</span>
              </div>
              <div className="px-2">
                <input 
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={frequency}
                  onChange={(e) => updateFrequency(parseInt(e.target.value))}
                  className="w-full h-2 bg-editorial-paper rounded-lg appearance-none cursor-pointer accent-editorial-vermilion"
                />
                <div className="flex justify-between mt-4 font-sans text-[8px] font-black uppercase tracking-[0.2em] opacity-20">
                  <span>5m</span>
                  <span>60m</span>
                  <span>120m</span>
                </div>
              </div>
            </div>

            <div className="border-t border-editorial-border pt-10">
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-2xl font-bold italic tracking-tight">Knowledge Taps</h3>
                <span className="font-sans text-[10px] uppercase font-black tracking-[0.2em] bg-editorial-ink text-white px-3 py-1">3 ACTIVE</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {['Stoicism', 'Finance', 'Mindfulness', 'Global News'].map(tag => (
                  <span key={tag} className="px-5 py-2.5 border-2 border-editorial-ink text-[10px] uppercase font-sans font-black tracking-widest hover:bg-editorial-ink hover:text-white transition-all cursor-default scale-effect select-none">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-editorial-border pt-10">
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-2xl font-bold italic tracking-tight">V3.1 Isolation</h3>
                <span className="text-[#008000] text-[10px] font-black font-sans uppercase tracking-[0.3em]">Encrypted</span>
              </div>
              <div className="font-mono text-[11px] leading-relaxed text-editorial-ink/40 bg-editorial-paper p-8 border border-editorial-border rounded-xl">
                &gt; host.attachShadow({'{'}mode: 'closed'{'}'});<br/>
                &gt; z-index: 2147483647;<br/>
                &gt; state: INJECTED_SUCCESS
              </div>
            </div>
          </div>

          <div className="mt-20 group relative">
            <div className="absolute -inset-1 bg-editorial-vermilion/20 rounded-[40px] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-editorial-ink text-white p-10 rounded-tr-[40px] rounded-bl-[40px] flex items-center justify-between border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-sans uppercase tracking-[0.5em] font-black opacity-30 mb-2">Protocol Override</span>
                <span className="text-xl italic">Manual Injection</span>
              </div>
              <button 
                onClick={spawnKoi}
                className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-editorial-vermilion hover:border-editorial-vermilion transition-all group/btn active:scale-90 shadow-2xl"
              >
                <Zap size={24} className="group-hover/btn:fill-white" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Quote Explorer Overlay */}
      <AnimatePresence>
        {activeTab === 'quotes' && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-50 bg-editorial-cream overflow-y-auto px-16 py-32"
          >
            <div className="max-w-5xl mx-auto">
              <button 
                onClick={() => setActiveTab('demo')}
                className="mb-20 text-[10px] font-black uppercase tracking-[0.5em] text-editorial-vermilion flex items-center gap-3 hover:-translate-x-3 transition-transform"
              >
                <span className="text-lg">←</span> Return to Dashboard
              </button>
              <h2 className="text-8xl font-light mb-24 italic tracking-tighter">Wisdom Archives</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {quotes.map((q, idx) => (
                  <div key={idx} className="p-12 bg-white border border-editorial-border rounded-tr-[60px] rounded-bl-[60px] hover:border-editorial-vermilion/40 transition-all shadow-sm group">
                    <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-editorial-vermilion mb-6 block opacity-30 group-hover:opacity-100 transition-opacity">{q.category}</span>
                    <p className="text-3xl italic leading-relaxed">"{q.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manifest Explorer Overlay */}
      <AnimatePresence>
        {activeTab === 'info' && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-50 bg-editorial-cream overflow-y-auto px-16 py-32"
          >
            <div className="max-w-4xl mx-auto">
              <button 
                onClick={() => setActiveTab('demo')}
                className="mb-20 text-[10px] font-black uppercase tracking-[0.5em] text-editorial-vermilion flex items-center gap-3 hover:-translate-x-3 transition-transform"
              >
                <span className="text-lg">←</span> Return to Dashboard
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                <div>
                  <h2 className="text-7xl font-light mb-12 italic tracking-tighter">Manifest V3.1</h2>
                  <div className="space-y-12">
                    <div className="border-l-4 border-editorial-vermilion pl-8 py-2">
                      <h4 className="font-sans text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Architecture</h4>
                      <p className="text-xl italic">Service Worker orchestration ensures background availability without memory leaks.</p>
                    </div>
                    <div className="border-l-4 border-editorial-ink pl-8 py-2">
                      <h4 className="font-sans text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Isolation</h4>
                      <p className="text-xl italic">Shadow DOM prevents host-site CSS from polluting the koi interface.</p>
                    </div>
                    <div className="border-l-4 border-editorial-ink pl-8 py-2">
                      <h4 className="font-sans text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Persistence</h4>
                      <p className="text-xl italic">Chrome Storage Local syncs preferences across all active browser instances.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-editorial-paper p-12 border border-editorial-border rounded-tr-[80px] rounded-bl-[80px] font-mono text-[11px] leading-relaxed relative">
                  <div className="absolute top-0 right-10 translate-y-[-50%] bg-editorial-ink text-white px-4 py-1 text-[9px] font-sans font-black tracking-[0.3em]">
                    RAW_SPEC
                  </div>
                  <pre className="text-editorial-ink/60 whitespace-pre-wrap">
{`{
  "manifest_version": 3,
  "name": "Koi-Zen",
  "permissions": [
    "storage",
    "alarms"
  ],
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="px-16 py-12 border-t border-editorial-border bg-editorial-cream flex justify-between items-center text-[10px] uppercase tracking-[0.4em] font-black opacity-30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-editorial-vermilion animate-pulse" />
          <span>V3.1 ACTIVE</span>
        </div>
        <div className="flex gap-12">
          <span>Koi-Zen Labs © 2026</span>
          <a href="#" className="hover:text-editorial-vermilion transition-colors">Documentation</a>
        </div>
      </footer>
    </div>
  );
}
