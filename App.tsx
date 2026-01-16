
import React, { useState, useEffect, useCallback } from 'react';
import { Dashboard } from './components/Dashboard';
import { ActivityLog } from './components/ActivityLog';
import { Settings } from './components/Settings';
import { Header } from './components/Header';
import { EmailMessage, AppSettings, Stats } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { generateSmartReply } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'activity' | 'settings'>('dashboard');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalProcessed: 0,
    totalReplied: 0,
    totalIgnored: 0,
    lastRun: 'Never',
  });

  // Load mock messages initially
  useEffect(() => {
    const mockMessages: EmailMessage[] = [
      {
        id: '1',
        sender: 'john.doe@example.com',
        subject: 'Inquiry about project pricing',
        body: 'Hello, I would like to know the pricing for your basic package. Best regards, John.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'replied',
        replyText: 'Hi John, thank you for your interest. Our basic package starts at $99/mo. Let us know if you have more questions!',
      },
      {
        id: '2',
        sender: 'newsletter@spam.com',
        subject: 'Huge Discounts Today!',
        body: 'Click here to save 90% on everything you never wanted.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'ignored',
        reason: 'Blacklisted sender domain detected.',
      }
    ];
    setMessages(mockMessages);
    setStats({
      totalProcessed: 2,
      totalReplied: 1,
      totalIgnored: 1,
      lastRun: new Date().toLocaleTimeString(),
    });
  }, []);

  const processEmail = useCallback(async (email: EmailMessage, currentSettings: AppSettings) => {
    // 1. Check blacklist
    const isBlacklisted = currentSettings.blacklist.some(domain => email.sender.toLowerCase().includes(domain.toLowerCase()));
    if (isBlacklisted) {
      return { ...email, status: 'ignored' as const, reason: `Sender ${email.sender} is blacklisted.` };
    }

    // 2. Check filters (Keywords)
    if (currentSettings.filterMode === 'keywords') {
      const hasKeywords = currentSettings.keywords.some(k => 
        email.subject.toLowerCase().includes(k.toLowerCase()) || 
        email.body.toLowerCase().includes(k.toLowerCase())
      );
      
      if (!hasKeywords) {
        return { ...email, status: 'ignored' as const, reason: "No relevant keywords found (Safety mode active)." };
      }
    }

    // 3. Generate Reply with Gemini
    try {
      const reply = await generateSmartReply(email, currentSettings);
      return { ...email, status: 'replied' as const, replyText: reply };
    } catch (err) {
      return { ...email, status: 'failed' as const, reason: "AI Generation failed or API rate limit." };
    }
  }, []);

  // Simulation loop
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        // If connected, this is where we would call the Gmail API
        // For now, we simulate the arrival of a "Real" email
        const newEmail: EmailMessage = {
          id: Math.random().toString(36).substr(2, 9),
          sender: isGmailConnected ? 'real.client@gmail.com' : `user${Math.floor(Math.random()*100)}@gmail.com`,
          subject: Math.random() > 0.5 ? 'Project Inquiry' : 'Support Needed',
          body: isGmailConnected ? 'I saw your email on the website and wanted to ask about your services.' : 'Hi, I need assistance with the subscription I purchased yesterday.',
          timestamp: new Date().toISOString(),
          status: 'pending',
        };

        setMessages(prev => [newEmail, ...prev].slice(0, 50));
        
        processEmail(newEmail, settings).then(processed => {
          setMessages(prev => prev.map(m => m.id === processed.id ? processed : m));
          setStats(prev => ({
            ...prev,
            totalProcessed: prev.totalProcessed + 1,
            totalReplied: processed.status === 'replied' ? prev.totalReplied + 1 : prev.totalReplied,
            totalIgnored: processed.status === 'ignored' ? prev.totalIgnored + 1 : prev.totalIgnored,
            lastRun: new Date().toLocaleTimeString(),
          }));
        });

      }, settings.checkInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, settings, processEmail, isGmailConnected]);

  const handleManualTest = async (testEmail: EmailMessage) => {
    const result = await processEmail(testEmail, settings);
    setMessages(prev => [result, ...prev].slice(0, 50));
    setStats(prev => ({
      ...prev,
      totalProcessed: prev.totalProcessed + 1,
      totalReplied: result.status === 'replied' ? prev.totalReplied + 1 : prev.totalReplied,
      totalIgnored: result.status === 'ignored' ? prev.totalIgnored + 1 : prev.totalIgnored,
      lastRun: new Date().toLocaleTimeString(),
    }));
    return result;
  };

  const connectGmailAccount = () => {
    // Simulate OAuth Login
    const win = window.open('about:blank', 'GoogleLogin', 'width=500,height=600');
    if (win) {
      win.document.write('<html><body style="display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;background:#f8fafc;"><h2>Google Sign-In</h2><p>Granting MailAI access to your Gmail...</p><div style="width:40px;height:40px;border:4px solid #3b82f6;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style></body></html>');
      setTimeout(() => {
        win.close();
        setIsGmailConnected(true);
        setIsRunning(true); // Start processing immediately on connect
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isRunning={isRunning} 
        onToggleRun={() => setIsRunning(!isRunning)}
        isGmailConnected={isGmailConnected}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {activeTab === 'dashboard' && (
          <Dashboard 
            stats={stats} 
            recentMessages={messages.slice(0, 5)} 
            onManualTest={handleManualTest}
            filterMode={settings.filterMode}
            isGmailConnected={isGmailConnected}
            onConnectAccount={connectGmailAccount}
          />
        )}
        {activeTab === 'activity' && <ActivityLog messages={messages} />}
        {activeTab === 'settings' && <Settings settings={settings} onSettingsChange={setSettings} isGmailConnected={isGmailConnected} />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-slate-500 text-sm">
        Gemini Auto-Responder &copy; {new Date().getFullYear()} — Connected to Gmail API (Sandbox)
      </footer>
    </div>
  );
};

export default App;
