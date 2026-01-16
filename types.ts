
export interface EmailMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  timestamp: string;
  status: 'pending' | 'replied' | 'ignored' | 'failed';
  replyText?: string;
  reason?: string;
}

export interface AppSettings {
  blacklist: string[];
  keywords: string[];
  systemPrompt: string;
  checkInterval: number;
  autoPilot: boolean;
  model: string;
  filterMode: 'keywords' | 'all';
}

export interface Stats {
  totalProcessed: number;
  totalReplied: number;
  totalIgnored: number;
  lastRun: string;
}
