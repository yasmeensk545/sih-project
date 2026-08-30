import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeRejectionText } from '../services/rejectionService';
import { SchemeCard } from '../components/SchemeCard';
import { RejectionAnalysisResult } from '../types';
import { 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  HelpCircle, 
  ShieldAlert, 
  RotateCcw,
  Zap
} from 'lucide-react';

const SAMPLE_REJECTIONS = [
  {
    title: "Income Certificate Outdated",
    text: "Application rejected during state level MeeSeva validation. Income certificate dated prior to April 1st of current financial year. Gross family income exceeds ₹2,00,000 threshold."
  },
  {
    title: "Aadhaar NPCI Seeding Failure",
    text: "DBT Payment Failed: Account is not seeded with NPCI Aadhaar mapper. Beneficiary name on bank account differs from Aadhaar card records."
  },
  {
    title: "Institutional Attendance Deficiency",
    text: "Institutional level verification failed. College Principal / Nodal Officer flagged aggregate student attendance below 75% statutory requirement."
  },
  {
    title: "Duplicate Scholarship Detected",
    text: "Multiple scholarship applications detected across National Scholarship Portal (NSP) and State ePASS portal. Beneficiary already marked under active state disbursement."
  }
];

export const RejectionExplainerPage: React.FC = () => {
  const { navigateTo } = useApp();

  const [inputRejection, setInputRejection] = useState(SAMPLE_REJECTIONS[0].text);
  const [analysis, setAnalysis] = useState<RejectionAnalysisResult>(() => analyzeRejectionText(SAMPLE_REJECTIONS[0].text));
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : inputRejection;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/rejection/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejection_text: text })
      });

      if (!response.ok) throw new Error('Rejection API unavailable');
      setAnalysis(await response.json());
    } catch {
      setAnalysis(analyzeRejectionText(text));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = (sampleText: string) => {
    setInputRejection(sampleText);
    handleAnalyze(sampleText);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            Civic Recovery Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Government Application Rejection Explainer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Paste confusing rejection messages received via SMS, email, or government portal status. We translate government jargon into root causes, appeal steps, and alternative schemes.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Paste Rejection Text / Error Code
          </label>
          <span className="text-xs text-slate-400">Or pick a common sample below</span>
        </div>

        {/* Sample Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {SAMPLE_REJECTIONS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(sample.text)}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all text-xs flex items-center justify-between"
            >
              <span className="font-bold text-slate-800 line-clamp-1">{sample.title}</span>
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            </button>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={inputRejection}
          onChange={(e) => setInputRejection(e.target.value)}
          rows={3}
          placeholder="Paste official SMS text, rejection notice, or portal error here..."
          className="w-full p-3.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Rejection Notice'}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Main Diagnosis Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  Root Cause Diagnosis
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {analysis.probable_reason}
                </h3>
                <p className="text-xs text-slate-500">
                  <strong className="text-slate-700">Violated Rule / Condition:</strong> {analysis.rule_violated}
                </p>
              </div>
            </div>

            {/* Actionable Steps */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Actionable 4-Step Recovery Plan
              </h4>
              <div className="space-y-2">
                {analysis.actionable_steps.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </div>
                    <span className="text-slate-700 font-medium leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Appeal & Grievance Guidance */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-blue-900 uppercase tracking-wider text-[10px] block">
                Official Grievance & Appeal Window
              </span>
              <p>{analysis.appeal_guidance}</p>
            </div>
          </div>

          {/* Recommended Alternative Schemes */}
          {analysis.alternative_schemes.length > 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recommended Alternative Schemes For You
                </h3>
                <p className="text-xs text-slate-500">
                  If your previous application cannot be rectified in time, consider these active alternative programs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {analysis.alternative_schemes.map(scheme => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
