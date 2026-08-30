import React from 'react';
import { Scheme, EligibilityResult } from '../types';
import { MatchScore } from './MatchScore';
import { useApp } from '../context/AppContext';
import { 
  Bookmark, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  Building2, 
  Calendar, 
  Sparkles,
  HelpCircle,
  IndianRupee
} from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  eligibilityResult?: EligibilityResult;
  onOpenWhyModal?: (scheme: Scheme) => void;
  showSaveButton?: boolean;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  eligibilityResult,
  onOpenWhyModal,
  showSaveButton = true
}) => {
  const { 
    isSchemeSaved, 
    toggleSaveScheme, 
    navigateTo, 
    openWhyEligibleModal 
  } = useApp();

  const isSaved = isSchemeSaved(scheme.id);
  const score = eligibilityResult?.match_score ?? 85;

  // Pick top 3 criteria to show
  const matchedRules = eligibilityResult?.matched_rules.slice(0, 3) || [
    "Age criteria satisfied",
    "Income criteria within limit",
    "State / Domicile approved"
  ];

  const handleWhyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenWhyModal) {
      onOpenWhyModal(scheme);
    } else {
      openWhyEligibleModal(scheme);
    }
  };

  const handleCardClick = () => {
    navigateTo(`scheme_details:${scheme.id}`);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Scholarship':
      case 'Education':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Agriculture':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Healthcare':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Housing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Women':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Entrepreneurship':
      case 'Employment':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between cursor-pointer group relative"
    >
      {/* Top row: Category Badge, Match Score, Save Bookmark */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryColor(scheme.category)}`}>
              {scheme.category}
            </span>
            {scheme.eligibility.states && !scheme.eligibility.states.includes('All India') && (
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                {scheme.eligibility.states.join(', ')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <MatchScore score={score} size="sm" />
            {showSaveButton && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveScheme(scheme.id);
                }}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isSaved 
                    ? 'bg-blue-50 border-blue-200 text-blue-600' 
                    : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save scheme'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Scheme Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-1.5">
          {scheme.name}
        </h3>

        {/* Ministry / Nodal Body */}
        <p className="text-xs text-slate-500 line-clamp-1 mb-3 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{scheme.ministry}</span>
        </p>

        {/* Estimated Benefit Highlight Box */}
        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 mb-3.5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated Benefit</span>
            <span className="text-sm font-extrabold text-slate-900 flex items-center">
              {scheme.benefit.display_text}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
            {scheme.benefit.type.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Matched Rules Checklist */}
        <div className="space-y-1.5 mb-4">
          {matchedRules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{rule}</span>
            </div>
          ))}
          {eligibilityResult?.failed_rules && eligibilityResult.failed_rules.length > 0 && (
            <div className="flex items-start gap-1.5 text-xs text-amber-700 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{eligibilityResult.failed_rules[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <button
          type="button"
          onClick={handleWhyClick}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/70 hover:bg-blue-100/80 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Why Am I Eligible?
        </button>

        <button
          type="button"
          onClick={handleCardClick}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 group-hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
