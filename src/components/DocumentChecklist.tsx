import React, { useState } from 'react';
import { SchemeDocument } from '../types';
import { Check, Clock, AlertCircle, FileText, CheckCircle2, ShieldCheck, Download, Eye } from 'lucide-react';

interface DocumentChecklistProps {
  documents: SchemeDocument[];
  schemeName?: string;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({ documents, schemeName }) => {
  // Track readiness status: 'ready', 'in_progress', 'needed'
  const [docStatus, setDocStatus] = useState<Record<string, 'ready' | 'in_progress' | 'needed'>>(() => {
    const initial: Record<string, 'ready' | 'in_progress' | 'needed'> = {};
    documents.forEach((d, idx) => {
      // Default common ones to ready
      if (d.name.toLowerCase().includes('aadhaar') || idx === 0) {
        initial[d.name] = 'ready';
      } else if (d.name.toLowerCase().includes('income')) {
        initial[d.name] = 'in_progress';
      } else {
        initial[d.name] = 'needed';
      }
    });
    return initial;
  });

  const toggleStatus = (docName: string) => {
    setDocStatus(prev => {
      const current = prev[docName] || 'needed';
      const next = current === 'ready' ? 'in_progress' : current === 'in_progress' ? 'needed' : 'ready';
      return { ...prev, [docName]: next };
    });
  };

  const readyCount = documents.filter(d => docStatus[d.name] === 'ready').length;
  const progressPercent = Math.round((readyCount / Math.max(documents.length, 1)) * 100);

  return (
    <div className="space-y-4">
      {/* Header with Progress Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Document Readiness Roadmap</h4>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200">
            {readyCount} of {documents.length} Ready ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Document Items List */}
      <div className="space-y-2.5">
        {documents.map((doc, idx) => {
          const status = docStatus[doc.name] || 'needed';

          return (
            <div 
              key={idx}
              onClick={() => toggleStatus(doc.name)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                status === 'ready' 
                  ? 'bg-emerald-50/40 border-emerald-200' 
                  : status === 'in_progress'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                  status === 'ready'
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : status === 'in_progress'
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : 'border-slate-300 bg-white text-transparent'
                }`}>
                  {status === 'ready' && <Check className="w-3.5 h-3.5" />}
                  {status === 'in_progress' && <Clock className="w-3 h-3" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                    {doc.mandatory ? (
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                        Mandatory
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{doc.purpose}</p>
                  {doc.issuing_authority && (
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                      Issuing Authority: {doc.issuing_authority}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Toggle Badge */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                  status === 'ready'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : status === 'in_progress'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {status === 'ready' ? '✓ Have Document' : status === 'in_progress' ? '⏳ In Progress' : '○ Needed'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-400 italic text-center pt-1">
        Click any document to toggle your readiness state (Have Document / In Progress / Needed).
      </div>
    </div>
  );
};
