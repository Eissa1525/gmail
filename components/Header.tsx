
import React from 'react';
import { ICONS } from '../constants';

interface HeaderProps {
  activeTab: 'dashboard' | 'activity' | 'settings';
  onTabChange: (tab: 'dashboard' | 'activity' | 'settings') => void;
  isRunning: boolean;
  onToggleRun: () => void;
  isGmailConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, isRunning, onToggleRun, isGmailConnected }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <ICONS.Email className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 leading-none">MailAI</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">
              {isGmailConnected ? 'Live Connection' : 'Responder Pro'}
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => onTabChange('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => onTabChange('activity')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'activity' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Activity
          </button>
          <button 
            onClick={() => onTabChange('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Settings
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
            <span className="text-xs font-bold text-slate-500 uppercase">{isRunning ? 'Running' : 'Paused'}</span>
          </div>
          <button 
            onClick={onToggleRun}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all shadow-md ${isRunning ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
    </header>
  );
};
