import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MatchScore } from '../components/MatchScore';
import { DocumentChecklist } from '../components/DocumentChecklist';
import { ApplyModal } from '../components/ApplyModal';
import { 
  Building2, 
  ExternalLink, 
  Bookmark, 
  Check, 
  AlertCircle, 
  Info, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  FileText, 
  Layers, 
  ChevronRight,
  GitCompare,
  IndianRupee,
  Share2
} from 'lucide-react';

export const SchemeDetailsPage: React.FC = () => {
  const { 
    activeSchemeId, 
    schemes, 
    eligibilityResults, 
    profile, 
    navigateTo, 
    toggleSaveScheme, 
    isSchemeSaved,
    openWhyEligibleModal 
  } = useApp();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Find target scheme
  const scheme = schemes.find(s => s.id === activeSchemeId) || schemes[0];
  const result = eligibilityResults.find(r => r.scheme_id === scheme.id);
  const isSaved = isSchemeSaved(scheme.id);
  const score = result?.match_score ?? 88;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigateTo('results')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Scheme Recommendations
      </button>

      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                {scheme.category}
              </span>
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                {scheme.benefit.type.replace('_', ' ').toUpperCase()}
              </span>
              {scheme.eligibility.states && !scheme.eligibility.states.includes('All India') && (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  State Specific ({scheme.eligibility.states.join(', ')})
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {scheme.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 pt-0.5">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{scheme.ministry} • Nodal Agency: <strong className="text-slate-700 font-semibold">{scheme.source.nodal_agency}</strong></span>
            </p>
          </div>

          {/* Match Score Block & Save */}
          <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
            <MatchScore score={score} size="lg" />
            
            <button
              onClick={() => toggleSaveScheme(scheme.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600' : ''}`} />
              {isSaved ? 'Saved to Dashboard' : 'Save Scheme'}
            </button>
          </div>
        </div>

        {/* Highlight Cards Row: Benefit Value, Deadline, Official Portal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Estimated Financial Benefit
            </span>
            <span className="text-lg font-extrabold text-slate-900 block mt-0.5">
              {scheme.benefit.display_text}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Direct Benefit Transfer (DBT) to bank
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Application Deadline / Cycle
            </span>
            <span className="text-base font-extrabold text-slate-900 block mt-0.5 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              {scheme.deadline}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Rolling academic / annual cycle
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Official Government Portal
              </span>
              <span className="text-sm font-bold text-blue-700 block mt-0.5 truncate">
                {scheme.application.portal_name}
              </span>
            </div>
            <a
              href={scheme.application.official_url}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 mt-1"
            >
              Visit Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Official Application & Track</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => openWhyEligibleModal(scheme)}
            className="w-full sm:w-auto bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold px-5 py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Why Am I Eligible? (Breakdown)
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns for Deep Exploration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Eligibility Conditions + Document Roadmap + How to Apply */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Detailed Eligibility Checks vs User Profile */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Deterministic Eligibility Evaluation</h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Rule Check: {result?.status === 'eligible' ? '✓ Passed' : 'Active Evaluation'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {scheme.description}
            </p>

            {/* Matched Rules vs Profile */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statutory Constraints Check</h4>
              {result?.matched_rules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-900">Passed: </span>
                    <span className="text-slate-800">{rule}</span>
                  </div>
                </div>
              ))}

              {result?.failed_rules && result.failed_rules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/50 border border-red-100 text-xs">
                  <div className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-semibold text-red-900">Condition Not Met: </span>
                    <span className="text-slate-800">{rule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Interactive Document Readiness Roadmap */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Required Official Documents</h3>
              </div>
              <span className="text-xs text-slate-400">
                {scheme.documents.length} Certificates
              </span>
            </div>

            <DocumentChecklist documents={scheme.documents} schemeName={scheme.name} />
          </div>

          {/* Section 3: Step-by-Step Official Application Roadmap */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Step-by-Step Application Procedure</h3>
              <p className="text-xs text-slate-500">Official procedure according to {scheme.ministry} operational guidelines.</p>
            </div>

            <div className="space-y-3">
              {scheme.application.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed font-medium">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Benefit Stacking & Official Sources */}
        <div className="space-y-6">
          
          {/* Benefit Combination Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <GitCompare className="w-4 h-4 text-emerald-600" />
              Benefit Stacking Rules
            </div>
            
            <div className={`p-3 rounded-xl text-xs font-bold ${
              scheme.combination_rules.stackable 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {scheme.combination_rules.stackable ? '✓ Stackable with Other Benefits' : '⚠️ Restrictions Apply'}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {scheme.combination_rules.notes}
            </p>

            <button
              onClick={() => navigateTo('combination')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs transition-colors"
            >
              Test with Other Schemes →
            </button>
          </div>

          {/* Authentic Government Citation Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Authentic Government Citation
            </span>
            <div className="space-y-1.5 text-slate-700">
              <p><strong className="text-slate-900">Source:</strong> {scheme.source.name}</p>
              <p><strong className="text-slate-900">Nodal Agency:</strong> {scheme.source.nodal_agency}</p>
              <p><strong className="text-slate-900">Last Verified:</strong> {scheme.source.last_verified}</p>
            </div>
            
            <a
              href={scheme.source.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold pt-1"
            >
              <span>View Source Gazette / Circular</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Quick Help AI Box */}
          <div className="bg-linear-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Sparkles className="w-4 h-4" />
              Have Questions on {scheme.id}?
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Ask our AI Benefits Copilot about income certificates, biometric verification, or college nodal approvals.
            </p>
            <button
              onClick={() => navigateTo('copilot')}
              className="w-full bg-white text-slate-900 hover:bg-indigo-50 font-bold py-2 rounded-xl text-xs transition-colors"
            >
              Ask Copilot About This Scheme
            </button>
          </div>

        </div>

      </div>

      {/* Apply Tracking Modal */}
      <ApplyModal
        scheme={scheme}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

    </div>
  );
};
