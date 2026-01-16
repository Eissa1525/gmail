
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { ICONS } from '../constants';

interface SettingsProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  isGmailConnected: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange, isGmailConnected }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
  };

  const handleListInput = (key: 'blacklist' | 'keywords', val: string) => {
    const list = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setLocalSettings({ ...localSettings, [key]: list });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Connection Setup Guide */}
        <section className={`p-6 rounded-2xl border ${isGmailConnected ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isGmailConnected ? 'text-green-800' : 'text-amber-800'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isGmailConnected ? 'Live Connection Instructions' : 'Real Email Setup (Required for Sync)'}
          </h3>
          <div className="space-y-4 text-sm leading-relaxed">
            <p className={isGmailConnected ? 'text-green-700' : 'text-amber-700'}>
              {isGmailConnected 
                ? "You have connected a mock account. To sync with your real, live mailbox, the application must be moved from this developer sandbox to a production server."
                : "Currently, you are seeing simulated emails. To bridge this app to your actual Gmail inbox, follow these technical steps:"}
            </p>
            <ol className={`list-decimal list-inside space-y-1 ${isGmailConnected ? 'text-green-800 font-medium' : 'text-amber-800 font-medium'}`}>
              <li>Enable <strong>Gmail API</strong> in your Google Cloud Console.</li>
              <li>Create <strong>OAuth 2.0 Credentials</strong> (Web Application).</li>
              <li>Add this app's URL to the <strong>Authorized Redirect URIs</strong>.</li>
              <li>Deploy this code to a hosting provider (Vercel/Netlify).</li>
            </ol>
          </div>
        </section>

        {/* Core Settings */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-slate-800">
            <ICONS.Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold">Automation Logic</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Reply Mode (Strategy)</label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                <button 
                  onClick={() => setLocalSettings({...localSettings, filterMode: 'keywords'})}
                  className={`py-2 text-sm font-bold rounded-lg transition-all ${localSettings.filterMode === 'keywords' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Safe (Keywords Only)
                </button>
                <button 
                  onClick={() => setLocalSettings({...localSettings, filterMode: 'all'})}
                  className={`py-2 text-sm font-bold rounded-lg transition-all ${localSettings.filterMode === 'all' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500'}`}
                >
                  Aggressive (Reply All)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">AI Response Identity</label>
              <textarea 
                className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all mono text-sm leading-relaxed"
                value={localSettings.systemPrompt}
                onChange={(e) => setLocalSettings({ ...localSettings, systemPrompt: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Domain Blacklist</label>
                <input 
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  value={localSettings.blacklist.join(', ')}
                  onChange={(e) => handleListInput('blacklist', e.target.value)}
                  placeholder="spam.com, noreply@"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Required Keywords</label>
                <input 
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  value={localSettings.keywords.join(', ')}
                  onChange={(e) => handleListInput('keywords', e.target.value)}
                  placeholder="help, price, order"
                  disabled={localSettings.filterMode === 'all'}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-4">
          <button 
            onClick={() => setLocalSettings(settings)}
            className="px-6 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            Apply Config
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Service Tuning</h3>
          <div className="space-y-4">
            <div>
              <label className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                <span>Scan Frequency</span>
                <span className="text-blue-600">{localSettings.checkInterval}s</span>
              </label>
              <input 
                type="range" 
                min="10" 
                max="300" 
                step="10"
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                value={localSettings.checkInterval}
                onChange={(e) => setLocalSettings({ ...localSettings, checkInterval: parseInt(e.target.value) })}
              />
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
              <div>
                <p className="text-sm font-bold text-slate-800">Auto-Pilot</p>
                <p className="text-[10px] text-slate-500">Bypass review queue</p>
              </div>
              <button 
                onClick={() => setLocalSettings({...localSettings, autoPilot: !localSettings.autoPilot})}
                className={`w-11 h-6 rounded-full transition-colors relative ${localSettings.autoPilot ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${localSettings.autoPilot ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-inner text-white">
          <h3 className="text-blue-400 font-bold text-sm mb-2">Technical Info</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500 font-bold uppercase">AI Engine</span>
              <span className="text-slate-300 font-mono">Gemini 3 Pro</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500 font-bold uppercase">Backend Sync</span>
              <span className={isGmailConnected ? 'text-green-500 font-bold' : 'text-amber-500 font-bold'}>
                {isGmailConnected ? 'MOCK AUTH' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500 font-bold uppercase">Real Sync Env</span>
              <span className="text-rose-400">Node.js + OAuth Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
