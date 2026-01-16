
import React from 'react';
import { EmailMessage } from '../types';

interface ActivityLogProps {
  messages: EmailMessage[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ messages }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Email Processing History</h2>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Total: {messages.length}
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sender & Subject</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No messages processed yet.</td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 truncate max-w-xs">{msg.sender}</div>
                    <div className="text-xs text-slate-500 truncate max-w-md">{msg.subject}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-tight uppercase ${
                      msg.status === 'replied' ? 'bg-green-100 text-green-700' :
                      msg.status === 'ignored' ? 'bg-slate-100 text-slate-500' :
                      msg.status === 'pending' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 tabular-nums">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
