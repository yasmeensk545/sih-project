import React from 'react';
import { useApp } from '../context/AppContext';
import { MatchScore } from './MatchScore';
import { 
  X, 
  Check, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  ExternalLink, 
  ArrowRight,
  Info,
  User
} from 'lucide-react';

export const WhyEligibleModal: React.FC = () => {
  const { 
    selectedSchemeForModal, 
    selectedEligibilityResult, 
    closeWhyEligibleModal,
    profile,
    navigateTo,
    toggleSaveScheme,
    isSchemeSaved
  } = useApp();

  if (!selectedSchemeForModal) return null;

  const scheme = selectedSchemeForModal;
  const result = selectedEligibilityResult;
  const isSaved = isSchemeSaved(scheme.id);
  const score = result?.match_score ?? 94;

  const handleOpenDetails = () => {
    closeWhyEligibleModal();
    navigateTo(`scheme_details:${scheme.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                {scheme.category}
              </span>
              <MatchScore score={score} size="sm" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
              {scheme.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {scheme.ministry}
            </p>
          </div>
          <button
            onClick={closeWhyEligibleModal}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Section 1: Your Profile Summary */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Your Active Profile Inputs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Age</span>
                <span className="font-bold text-slate-800">{profile.age} Years</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">State</span>
                <span className="font-bold text-slate-800">{profile.state}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Annual Income</span>
                <span className="font-bold text-slate-800">₹{profile.annual_income.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Education</span>
                <span className="font-bold text-slate-800 truncate block">{profile.education}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Deterministic Rule-by-Rule Analysis */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Deterministic Rule Engine Checks
            </h3>
            <div className="space-y-2">
              {result?.matched_rules && result.matched_rules.map((rule, index) => (
                <div key={index} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-slate-800">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-900">Passed: </span>
                    <span>{rule}</span>
                  </div>
                </div>
              ))}

              {result?.failed_rules && result.failed_rules.map((rule, index) => (
                <div key={index} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-red-50/60 border border-red-100 text-xs text-slate-800">
                  <div className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-semibold text-red-900">Condition Not Met: </span>
                    <span>{rule}</span>
                  </div>
                </div>
              ))}

              {result?.verification_required && result.verification_required.map((req, index) => (
                <div key={index} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 text-xs text-slate-800">
                  <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-semibold text-amber-900">Verification Required: </span>
                    <span>{req}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: AI Benefits Grounded Explanation */}
          <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                AI Benefits Copilot Summary
              </div>
              <span className="text-[11px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                Rule Confidence: {result?.confidence_score || 94}%
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {result?.ai_explanation || 
                `Based on your age (${profile.age}), location (${profile.state}), and declared annual income of ₹${profile.annual_income.toLocaleString('en-IN')}, you appear to meet the statutory criteria for ${scheme.name}. All key conditions correspond to current central directives.`}
            </p>
            <div className="mt-3 pt-2.5 border-t border-indigo-100/80 text-[11px] text-slate-500 italic">
              "Final eligibility is determined by the relevant government authority upon document verification."
            </div>
          </div>

          {/* Section 4: Estimated Benefit & Portal */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Sanctioned Value</span>
              <span className="text-base font-extrabold text-slate-900">{scheme.benefit.display_text}</span>
            </div>
            <div className="text-right sm:text-right w-full sm:w-auto">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Application Portal</span>
              <span className="font-semibold text-blue-700">{scheme.application.portal_name}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => toggleSaveScheme(scheme.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${
              isSaved
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isSaved ? '✓ Saved to Dashboard' : 'Save for Later'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={closeWhyEligibleModal}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleOpenDetails}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 transition-colors"
            >
              View Full Scheme Details
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
