import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { ApplicationStatus } from '../types';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Calendar, 
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const { applications, createOrUpdateApplication, navigateTo } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 mb-1">
            <FileText className="w-3.5 h-3.5" />
            Citizen Application Tracker
          </div>
          <h1 className="text-2xl font-black text-slate-900">Tracked Government Applications</h1>
          <p className="text-xs text-slate-500">Monitor acknowledgment numbers, status milestones, and uploaded documents.</p>
        </div>

        <button
          onClick={() => navigateTo('schemes')}
          className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Track New Scheme
        </button>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={app.status} type="application" />
                    <span className="text-xs font-mono font-bold text-slate-600">
                      Ref No: {app.application_number}
                    </span>
                    <span className="text-xs text-slate-400">
                      • Applied on {app.applied_date}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{app.scheme_name}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400">Update Status:</span>
                  <select
                    value={app.status}
                    onChange={(e) => createOrUpdateApplication({ ...app, status: e.target.value as ApplicationStatus })}
                    className="text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => navigateTo(`scheme_details:${app.scheme_id}`)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg"
                  >
                    View Scheme
                  </button>
                </div>
              </div>

              {/* Notes & Uploaded docs summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Application Notes & Log
                  </span>
                  <p className="text-slate-700 leading-relaxed italic">
                    "{app.notes}"
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Certificates Submitted ({app.documents_uploaded.length})
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {app.documents_uploaded.map((doc, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium text-slate-700">
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline Milestones */}
              {app.timeline && app.timeline.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Milestone Progress Timeline
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {app.timeline.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 shrink-0">
                        <div className="bg-blue-50/70 border border-blue-200 rounded-lg px-3 py-1.5 text-xs">
                          <span className="font-bold text-blue-900 block">{t.status}</span>
                          <span className="text-[10px] text-slate-500">{t.date}</span>
                        </div>
                        {idx < app.timeline.length - 1 && (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No applications tracked yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you apply on an official portal, click "Proceed to Official Application & Track" to record your application number and status here.
          </p>
        </div>
      )}

    </div>
  );
};
