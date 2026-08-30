import React, { useState } from 'react';
import { Scheme, UserApplication, ApplicationStatus } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  ShieldAlert, 
  Building2, 
  Plus,
  Calendar,
  Layers
} from 'lucide-react';

interface ApplyModalProps {
  scheme: Scheme;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ scheme, isOpen, onClose }) => {
  const { createOrUpdateApplication, navigateTo, applications } = useApp();

  const existingApp = applications.find(a => a.scheme_id === scheme.id);

  const [applicationNumber, setApplicationNumber] = useState(
    existingApp?.application_number || `GOV-${scheme.id}-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [status, setStatus] = useState<ApplicationStatus>(existingApp?.status || 'submitted');
  const [notes, setNotes] = useState(existingApp?.notes || 'Applied on official portal. Awaiting institutional verification.');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    createOrUpdateApplication({
      scheme_id: scheme.id,
      scheme_name: scheme.name,
      category: scheme.category,
      status: status,
      application_number: applicationNumber,
      notes: notes,
      applied_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      documents_uploaded: scheme.documents.filter(d => d.mandatory).map(d => d.name)
    });
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
      navigateTo('applications');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Direct Government Application Portal
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1">{scheme.name}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5" />
              {scheme.ministry}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          
          {/* Step 1: Open Official Government Portal */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
              Step 1: Proceed to Authentic Portal
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              Government scheme benefits are officially processed on the central/state portal. Click below to launch the authentic verification page.
            </p>
            <a
              href={scheme.application.official_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <span>Open {scheme.application.portal_name}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Step 2: Save to Application Tracker */}
          <form onSubmit={handleSaveTracking} className="space-y-4">
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Step 2: Track Application in Bharat Benefits
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                Store your reference number to monitor milestones, verification timelines, and document checklists in your personal dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Application / Acknowledgment No.
                </label>
                <input
                  type="text"
                  value={applicationNumber}
                  onChange={(e) => setApplicationNumber(e.target.value)}
                  placeholder="e.g. TS-EPASS-2026-XXXX"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Current Tracking Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="draft">Draft / Preparing Documents</option>
                  <option value="submitted">Submitted Online</option>
                  <option value="under_review">Under Institutional Review</option>
                  <option value="approved">Approved / Sanctioned</option>
                  <option value="rejected">Rejected / Needs Appeal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Personal Notes & Milestones
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Income certificate submitted to college officer on Monday."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {isSavedSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Application tracked successfully! Redirecting...
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-xs"
                >
                  Save & Track in Dashboard
                </button>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
};
