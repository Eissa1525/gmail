
import React, { useState } from 'react';
import { Stats, EmailMessage } from '../types';
import { ICONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  stats: Stats;
  recentMessages: EmailMessage[];
  onManualTest: (email: EmailMessage) => Promise<EmailMessage>;
  filterMode: 'keywords' | 'all';
  isGmailConnected: boolean;
  onConnectAccount: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, recentMessages, onManualTest, filterMode, isGmailConnected, onConnectAccount }) => {
  const [testText, setTestText] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<EmailMessage | null>(null);

  const chartData = [
    { name: 'Replied', value: stats.totalReplied, color: '#2563eb' },
    { name: 'Ignored', value: stats.totalIgnored, color: '#94a3b8' },
  ];

  const handleRunTest = async () => {
    if (!testText.trim()) return;
    setIsTesting(true);
    const mockEmail: EmailMessage = {
      id: 'test-' + Date.now(),
      sender: 'test.user@example.com',
      subject: 'Manual Test Inquiry',
      body: testText,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    const result = await onManualTest(mockEmail);
    setLastTestResult(result);
    setIsTesting(false);
  };

  return (
    <div className="space-y-8">
      {/* Environment Disclaimer */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm">
        <div className="flex items-start gap-3">
          <div className="text-amber-500 mt-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900">Sandbox Environment Active</h4>
            <p className="text-xs text-amber-800 leading-relaxed mt-1">
              This application is currently in <strong>Simulation Mode</strong>. It is <u>not</u> connected to your live Gmail account. 
              To sync real emails, you must host this app and provide your own Google Cloud API credentials in the Settings.
            </p>
          </div>
        </div>
      </div>

      {/* Real Account Connection Banner */}
      {!isGmailConnected && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full blur-2xl"></div>
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">Connect Your Real Gmail</h2>
            <p className="text-blue-100 max-w-md">Switch from simulation mode to real-time email automation. Link your Google account securely using OAuth.</p>
          </div>
          <button 
            onClick={onConnectAccount}
            className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg active:scale-95 shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Connect with Google
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Processed</div>
          <div className="text-3xl font-bold text-slate-900">{stats.totalProcessed}</div>
          <div className="mt-2 text-xs text-blue-600 font-medium">Lifetime analysis</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Smart Replies</div>
          <div className="text-3xl font-bold text-blue-600">{stats.totalReplied}</div>
          <div className="mt-2 text-xs text-green-600 font-medium">AI generated & sent</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Filters Applied</div>
          <div className="text-3xl font-bold text-slate-400">{stats.totalIgnored}</div>
          <div className="mt-2 text-xs text-slate-500 font-medium">Blocked by logic</div>
        </div>
        <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 ${isGmailConnected ? 'border-l-green-500' : 'border-l-blue-500'}`}>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Sync Engine</div>
          <div className="text-xl font-bold text-slate-900 mt-2 capitalize">{isGmailConnected ? 'Google Active' : 'Offline/Sim'}</div>
          <div className="mt-2 text-xs text-blue-600 font-medium">{isGmailConnected ? 'Live Connection' : 'Real Sync Required'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ICONS.Chart className="w-5 h-5 text-blue-500" />
                Processing Efficiency
              </h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Manual Sandbox */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl -z-10 rounded-full"></div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ICONS.Flask className="w-5 h-5 text-blue-400" />
              Logic Sandbox
            </h3>
            <p className="text-slate-400 text-sm mb-6">Test if the AI will reply to a specific email body based on your current settings.</p>
            
            <div className="space-y-4">
              <textarea 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600 min-h-[120px]"
                placeholder="Paste email content here (e.g. 'Can you send me a price list?')..."
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
              />
              <button 
                onClick={handleRunTest}
                disabled={isTesting || !testText.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all active:scale-95"
              >
                {isTesting ? 'AI is Thinking...' : 'Test Logic'}
              </button>
            </div>

            {lastTestResult && (
              <div className={`mt-6 p-4 rounded-xl border ${lastTestResult.status === 'replied' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase ${lastTestResult.status === 'replied' ? 'text-blue-400' : 'text-slate-400'}`}>
                    Result: {lastTestResult.status}
                  </span>
                  {lastTestResult.reason && <span className="text-[10px] text-slate-500 italic">{lastTestResult.reason}</span>}
                </div>
                {lastTestResult.replyText && (
                  <div className="text-sm text-slate-300 italic border-l-2 border-blue-500/50 pl-3 py-1">
                    "{lastTestResult.replyText.substring(0, 150)}..."
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Recent */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
            Timeline
            {isGmailConnected && <span className="text-[10px] text-green-500 animate-pulse">Live</span>}
          </h3>
          <div className="space-y-4">
            {recentMessages.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-2 text-slate-400">
                <ICONS.Email className="w-8 h-8 opacity-20" />
                <p className="text-sm italic">Waiting for incoming traffic...</p>
              </div>
            ) : (
              recentMessages.map(msg => (
                <div key={msg.id} className="flex gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                    msg.status === 'replied' ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100' : 
                    msg.status === 'ignored' ? 'bg-slate-50 text-slate-400' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {msg.status === 'replied' ? <ICONS.Check className="w-5 h-5" /> : <ICONS.Email className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{msg.sender}</p>
                    <p className="text-xs text-slate-500 truncate">{msg.subject}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
