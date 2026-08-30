import React from 'react';
import { useApp } from '../context/AppContext';
import { SchemeCard } from '../components/SchemeCard';
import { 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  ArrowRight, 
  FileCheck2, 
  GitCompare, 
  AlertTriangle, 
  Zap, 
  Users, 
  Building, 
  Layers, 
  Search,
  IndianRupee,
  Clock
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo, schemes, eligibilityResults, quickDemoLogin } = useApp();

  const featuredSchemes = schemes.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 bg-linear-to-b from-blue-50/70 via-slate-50 to-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Civic Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-blue-200 shadow-2xs">
              <span className="text-sm">🇮🇳</span>
              <span className="text-xs font-bold text-blue-800 tracking-wide uppercase">
                Citizen Welfare & Direct Benefit Transfer Navigator
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Discover Government Schemes You Are <span className="text-blue-600">Actually Eligible For</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Stop guessing through hundreds of confusing government portals. Our <strong className="text-slate-900 font-semibold">100% deterministic rule engine</strong> matches your exact age, state, education, and income to verified central & state benefits.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => navigateTo('eligibility')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base group"
              >
                <span>Check My Eligibility (2 Mins)</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={quickDemoLogin}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-6 py-3.5 rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 text-base"
              >
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Try Demo Profile</span>
              </button>
            </div>

            {/* Micro Stats Bar */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xl font-extrabold text-blue-600 block">15+</span>
                <span className="text-xs text-slate-500 font-medium">Verified Schemes</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xl font-extrabold text-emerald-600 block">100%</span>
                <span className="text-xs text-slate-500 font-medium">Deterministic Rules</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xl font-extrabold text-indigo-600 block">AI RAG</span>
                <span className="text-xs text-slate-500 font-medium">Official Copilot</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xl font-extrabold text-slate-800 block">₹0</span>
                <span className="text-xs text-slate-500 font-medium">Free & Citizen First</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. How It Works (5-Step Simple Flow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Simple 5-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            How Bharat Benefits Navigator Works
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Built specifically to solve transparency, document confusion, and application rejections for Indian citizens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Enter Profile',
              desc: 'Provide your age, state, education, income, and category in a 2-minute wizard.',
              icon: Users,
              color: 'text-blue-600 bg-blue-50 border-blue-200'
            },
            {
              step: '02',
              title: 'Deterministic Engine',
              desc: 'Our engine applies mathematical eligibility formulas without hallucinating or guessing.',
              icon: ShieldCheck,
              color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
            },
            {
              step: '03',
              title: 'Personalized Matches',
              desc: 'See exact percentage match scores and clear rule-by-rule reasons for every scheme.',
              icon: CheckCircle2,
              color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
            },
            {
              step: '04',
              title: 'Document Roadmap',
              desc: 'Get a clean checklist of mandatory certificates with exact issuing authorities.',
              icon: FileCheck2,
              color: 'text-amber-600 bg-amber-50 border-amber-200'
            },
            {
              step: '05',
              title: 'Apply & Track',
              desc: 'Launch official government portals directly and monitor application milestones.',
              icon: Compass,
              color: 'text-purple-600 bg-purple-50 border-purple-200'
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-black text-slate-400">{item.step}</span>
                  <div className={`p-2 rounded-lg border ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Schemes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Verified Database</span>
            <h2 className="text-2xl font-extrabold text-slate-900">Featured Active Government Schemes</h2>
            <p className="text-xs text-slate-500">
              Covering Higher Education, PM-KISAN, Health Insurance, Housing, and Entrepreneurship Subsidies.
            </p>
          </div>
          <button
            onClick={() => navigateTo('schemes')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 transition-colors"
          >
            Explore All 15+ Schemes
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredSchemes.map(scheme => {
            const result = eligibilityResults.find(r => r.scheme_id === scheme.id);
            return (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                eligibilityResult={result}
              />
            );
          })}
        </div>
      </section>

      {/* 4. Advanced Civic Tools (Combo Checker & Rejection Explainer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tool 1: AI Copilot */}
          <div className="bg-linear-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </div>
              <h3 className="text-lg font-bold">AI Benefits Copilot</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Ask any question in plain language. Answers are strictly grounded with citations to authentic Ministry documents and nodal guidelines.
              </p>
            </div>
            <button
              onClick={() => navigateTo('copilot')}
              className="mt-6 w-full bg-white text-slate-900 hover:bg-indigo-50 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Ask AI Copilot</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
            </button>
          </div>

          {/* Tool 2: Benefit Combination Checker */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <GitCompare className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Benefit Combo Checker</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Check whether you can stack multiple government schemes (e.g. State ePASS + NSP Scholarship) without violating duplicate DBT restrictions.
              </p>
            </div>
            <button
              onClick={() => navigateTo('combination')}
              className="mt-6 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Test Scheme Stacking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tool 3: Rejection Explainer */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Rejection Explainer</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Paste confusing rejection error messages (e.g. "NPCI mapping failure", "Income mismatch"). Get actionable steps, appeal guidance, and alternatives.
              </p>
            </div>
            <button
              onClick={() => navigateTo('rejection')}
              className="mt-6 w-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Analyze Rejection Notice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. Trust & Civic Transparency Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Authentic Government Links Guarantee</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                Bharat Benefits Navigator never collects private bank credentials or charges citizens. All applications are submitted securely on verified `.gov.in` and `.nic.in` domains.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => navigateTo('eligibility')}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs"
          >
            Start Eligibility Check →
          </button>
        </div>
      </section>

    </div>
  );
};
