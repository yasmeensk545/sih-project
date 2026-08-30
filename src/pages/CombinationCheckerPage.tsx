import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { checkBenefitsCombination } from '../services/combinationEngine';
import { CombinationCheckResult } from '../types';
import { 
  GitCompare, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight,
  Plus,
  Trash2,
  Layers,
  Building2
} from 'lucide-react';

export const CombinationCheckerPage: React.FC = () => {
  const { schemes } = useApp();

  // Selected scheme IDs (default to 2 schemes for instant demonstration)
  const [selectedIds, setSelectedIds] = useState<string[]>(['SCH001', 'SCH003']);
  const [combinationResult, setCombinationResult] = useState<CombinationCheckResult>(() => checkBenefitsCombination(schemes.filter(s => ['SCH001', 'SCH003'].includes(s.id))));

  const toggleSelectScheme = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectedSchemes = useMemo(
    () => schemes.filter(s => selectedIds.includes(s.id)),
    [schemes, selectedIds]
  );

  useEffect(() => {
    let isMounted = true;

    fetch('/api/combination/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheme_ids: selectedIds })
    })
      .then((response) => {
        if (!response.ok) throw new Error('Combination API unavailable');
        return response.json();
      })
      .then((result: CombinationCheckResult) => {
        if (isMounted) setCombinationResult(result);
      })
      .catch(() => {
        if (isMounted) setCombinationResult(checkBenefitsCombination(selectedSchemes));
      });

    return () => {
      isMounted = false;
    };
  }, [selectedIds, selectedSchemes]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
            <GitCompare className="w-3.5 h-3.5" />
            Deterministic Stacking Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Benefit Combination & Compatibility Checker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Verify whether you can legally receive multiple central and state government schemes simultaneously without disqualification or penalty under DBT norms.
          </p>
        </div>
      </div>

      {/* Grid: 2 Columns (Scheme Selector vs Evaluation Result) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (5 cols): Select Schemes from List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Select Schemes to Compare ({selectedIds.length} Selected)
            </h3>
            {selectedIds.length > 0 && (
              <button 
                onClick={() => setSelectedIds([])}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Reset
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {schemes.map(scheme => {
              const isSelected = selectedIds.includes(scheme.id);
              return (
                <div
                  key={scheme.id}
                  onClick={() => toggleSelectScheme(scheme.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // handled by div click
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                  />
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-100/60 px-1.5 py-0.2 rounded uppercase">
                        {scheme.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{scheme.id}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{scheme.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{scheme.benefit.display_text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col (7 cols): Stacking Results Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            
            {/* Header Status */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Combination Compatibility Status
              </span>
              
              {combinationResult.status === 'compatible' && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-extrabold">Fully Stackable & Compatible</h4>
                    <p className="text-xs text-emerald-700 mt-0.5">These benefits can be availed concurrently without regulatory collision.</p>
                  </div>
                </div>
              )}

              {combinationResult.status === 'verification_required' && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <HelpCircle className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-extrabold">Conditional Verification Required</h4>
                    <p className="text-xs text-amber-700 mt-0.5">Nodal clearance or formal declaration needed before availing both.</p>
                  </div>
                </div>
              )}

              {combinationResult.status === 'incompatible' && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900">
                  <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-extrabold">Direct Conflict / Prohibition</h4>
                    <p className="text-xs text-red-700 mt-0.5">Dual benefit restriction applies. You cannot claim both simultaneously.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Schemes Strip */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Evaluated Scheme Pairings ({selectedSchemes.length})
              </h4>
              <div className="space-y-2">
                {selectedSchemes.map(s => (
                  <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{s.name}</span>
                    <span className="text-slate-500 font-medium shrink-0 ml-2">{s.benefit.display_text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Rule Analysis */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Statutory Rule Analysis
              </h4>
              <div className="space-y-2 text-xs">
                {combinationResult.details.map((detail, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 text-xs">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                Advisory Recommendation
              </span>
              <p className="text-slate-700 leading-relaxed">
                {combinationResult.recommendation}
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
