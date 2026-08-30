import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SchemeCard } from '../components/SchemeCard';
import { 
  CheckCircle2, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Compass, 
  Sparkles, 
  Filter, 
  User, 
  MapPin, 
  RotateCcw,
  Building2,
  HelpCircle,
  IndianRupee,
  Layers
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { 
    eligibilityResults, 
    profile, 
    navigateTo, 
    runEligibilityCheck 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'state' | 'scholarship' | 'health' | 'business'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'benefit' | 'deadline'>('match');
  const [showWeightInfo, setShowWeightInfo] = useState(false);

  // Filter results
  const filteredResults = useMemo(() => {
    let list = [...eligibilityResults];

    if (activeTab === 'high') {
      list = list.filter(r => r.match_score >= 80);
    } else if (activeTab === 'state') {
      list = list.filter(r => r.scheme.eligibility.states && !r.scheme.eligibility.states.includes('All India'));
    } else if (activeTab === 'scholarship') {
      list = list.filter(r => r.scheme.category === 'Scholarship' || r.scheme.category === 'Education');
    } else if (activeTab === 'health') {
      list = list.filter(r => r.scheme.category === 'Healthcare' || r.scheme.category === 'Housing');
    } else if (activeTab === 'business') {
      list = list.filter(r => r.scheme.category === 'Entrepreneurship' || r.scheme.category === 'Employment' || r.scheme.category === 'Agriculture');
    }

    // Sorting
    if (sortBy === 'match') {
      list.sort((a, b) => b.match_score - a.match_score);
    } else if (sortBy === 'benefit') {
      // Sort roughly by estimated upper value
      list.sort((a, b) => b.scheme.benefit.max - a.scheme.benefit.max);
    }

    return list;
  }, [eligibilityResults, activeTab, sortBy]);

  const actionableResults = eligibilityResults.filter(r => r.status === 'eligible' || r.status === 'potentially_eligible');
  const highMatchCount = eligibilityResults.filter(r => r.match_score >= 80).length;
  const potentialCount = eligibilityResults.filter(r => r.match_score >= 50 && r.match_score < 80).length;
  const topRecommendations = actionableResults.slice(0, 5);
  const estimatedBenefitRange = topRecommendations.reduce(
    (total, result) => total + result.scheme.benefit.max,
    0
  );
  const documentsToPrepare = Array.from(
    new Set(topRecommendations.flatMap(result => result.scheme.documents.filter(document => document.mandatory).map(document => document.name)))
  ).slice(0, 6);
  const stackableCount = topRecommendations.filter(result => result.scheme.combination_rules.stackable).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner: Profile Context & Engine Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Deterministic Engine Result
            </span>
            <span className="text-xs text-slate-500">
              Evaluated across {eligibilityResults.length} Central & State schemes
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            Personalized Schemes for Your Profile
          </h1>

          {/* Profile Pill Summary */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 pt-1">
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              {profile.age} Yrs, {profile.gender} ({profile.category})
            </span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {profile.state}
            </span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-slate-400" />
              ₹{profile.annual_income.toLocaleString('en-IN')}/yr
            </span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
              {profile.education}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={() => navigateTo('eligibility')}
            className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Edit Profile Inputs
          </button>
          
          <button
            onClick={() => setShowWeightInfo(!showWeightInfo)}
            className="px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Scoring Transparency
          </button>
        </div>
      </div>

      {/* Scoring Transparency Card (Collapsible) */}
      {showWeightInfo && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md animate-in fade-in duration-150 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4" />
              Mathematical Weight Distribution Formula
            </div>
            <button 
              onClick={() => setShowWeightInfo(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close ✕
            </button>
          </div>
          
          <p className="text-xs text-slate-300">
            Every match percentage is computed strictly via statutory constraints without opaque AI hallucinations:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Income Limit</span>
              <span className="font-mono font-bold text-emerald-400">25% Weight</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">State Domicile</span>
              <span className="font-mono font-bold text-blue-400">20% Weight</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Education / Course</span>
              <span className="font-mono font-bold text-indigo-400">20% Weight</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Age Range</span>
              <span className="font-mono font-bold text-amber-400">15% Weight</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Social Category</span>
              <span className="font-mono font-bold text-purple-400">10% Weight</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Special Criteria</span>
              <span className="font-mono font-bold text-pink-400">10% Weight</span>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Recommendation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-linear-to-br from-blue-700 to-indigo-800 text-white rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                AI Benefits Navigator Summary
              </div>
              <h2 className="text-xl font-black mt-1">
                You may be eligible for {topRecommendations.length} priority schemes.
              </h2>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                Ranked using your age, Telangana domicile, annual income, education, and declared welfare flags. Final approval depends on official document verification.
              </p>
            </div>
            <div className="hidden sm:block text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Estimated Max Benefit</span>
              <span className="text-2xl font-black">₹{estimatedBenefitRange.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/10 rounded-xl border border-white/15 p-3">
              <span className="text-blue-100 block">High confidence matches</span>
              <span className="text-lg font-black">{highMatchCount}</span>
            </div>
            <div className="bg-white/10 rounded-xl border border-white/15 p-3">
              <span className="text-blue-100 block">Needs closer review</span>
              <span className="text-lg font-black">{potentialCount}</span>
            </div>
            <div className="bg-white/10 rounded-xl border border-white/15 p-3">
              <span className="text-blue-100 block">Likely stackable benefits</span>
              <span className="text-lg font-black">{stackableCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            Next Best Actions
          </div>
          <div className="space-y-2 text-xs text-slate-700">
            <p><strong className="text-slate-900">1.</strong> Open the top scheme and confirm failed or verification rules.</p>
            <p><strong className="text-slate-900">2.</strong> Prepare common documents: {documentsToPrepare.length ? documentsToPrepare.join(', ') : 'Aadhaar, income proof, and domicile proof'}.</p>
            <p><strong className="text-slate-900">3.</strong> Use Combination Checker before applying to multiple scholarships.</p>
          </div>
          <button
            onClick={() => navigateTo('combination')}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl py-2 text-xs font-bold transition-colors"
          >
            Check Benefit Compatibility
          </button>
        </div>
      </div>

      {/* Filter Tabs & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All Schemes (${eligibilityResults.length})` },
            { id: 'high', label: `High Match (${highMatchCount})` },
            { id: 'state', label: `${profile.state} Domicile` },
            { id: 'scholarship', label: 'Scholarships & Education' },
            { id: 'health', label: 'Health & Housing' },
            { id: 'business', label: 'Agriculture & MSME' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500"
          >
            <option value="match">Highest Match Score</option>
            <option value="benefit">Highest Financial Value</option>
          </select>
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map(result => (
            <SchemeCard
              key={result.scheme_id}
              scheme={result.scheme}
              eligibilityResult={result}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No schemes found in this filter tab</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try selecting the "All Schemes" tab or updating your demographic profile details in the wizard.
          </p>
          <button
            onClick={() => setActiveTab('all')}
            className="text-xs font-bold text-blue-600 hover:underline pt-2 inline-block"
          >
            Show all {eligibilityResults.length} schemes
          </button>
        </div>
      )}

    </div>
  );
};
