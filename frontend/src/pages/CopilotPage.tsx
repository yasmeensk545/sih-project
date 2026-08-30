import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Send, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  Building2, 
  HelpCircle, 
  Bot, 
  User as UserIcon,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const CopilotPage: React.FC = () => {
  const { 
    copilotMessages, 
    isCopilotLoading, 
    sendCopilotMessage, 
    clearCopilotChat, 
    profile,
    navigateTo 
  } = useApp();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [copilotMessages, isCopilotLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isCopilotLoading) return;
    const text = input;
    setInput('');
    await sendCopilotMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendCopilotMessage(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5" />
            AI Benefits Copilot • Grounded RAG
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Government Welfare & Scheme Assistant
          </h1>
          <p className="text-xs text-slate-500">
            Contextualized with your active profile: <strong className="text-slate-700">{profile.age} Yrs, {profile.education}, {profile.state} (Income ₹{profile.annual_income.toLocaleString('en-IN')})</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCopilotChat}
            className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            title="Reset Conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Chat
          </button>
        </div>
      </div>

      {/* Main Chat Conversation Window */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[580px] overflow-hidden">
        
        {/* Messages List Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {copilotMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-2xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}>
                {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div className="space-y-2">
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>

                {/* Grounded Ministry Citations / Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-600" />
                      Verified Ministry Citations
                    </span>
                    {msg.sources.map((src, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2">
                        <span className="text-slate-700 font-semibold truncate">{src.title} ({src.department})</span>
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-bold shrink-0 flex items-center gap-0.5 text-[11px]"
                          >
                            Source Link <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Followups */}
                {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {msg.suggested_followups.map((fPrompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickPrompt(fPrompt)}
                        className="text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
                      >
                        <span>{fPrompt}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] text-slate-400 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isCopilotLoading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-500">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span>Retrieving ministry rules and grounded guidelines...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about scholarships, required documents, combination rules, or deadlines..."
              disabled={isCopilotLoading}
              className="flex-1 px-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isCopilotLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          
          <div className="text-[11px] text-slate-400 text-center pt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Information verified against official state and central scheme portals.
          </div>
        </div>

      </div>

    </div>
  );
};
