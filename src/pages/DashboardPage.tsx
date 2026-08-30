import React from 'react';
import { useApp } from '../context/AppContext';
import { SchemeCard } from '../components/SchemeCard';
import { StatusBadge } from '../components/StatusBadge';
import { 
  User, 
  LayoutDashboard, 
  CheckCircle2, 
  Bookmark, 
  FileText, 
  Sparkles, 
  GitCompare, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    profile, 
    eligibilityResults, 
    savedSchemeIds, 
    schemes, 
    applications, 
    navigateTo,
    createOrUpdateApplication
  } = useApp();

  const topEligibleResults = eligibilityResults.slice(0, 3);
  const savedSchemes = schemes.filter(s => savedSchemeIds.includes(s.id));

  // Compute total estimated benefit value
  const totalEligibleCount = eligibilityResults.filter(r => r.match_score >= 80).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Profile Welcome & Summary Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Welcome, {user?.name || 'Priya Sharma'}
              </h1>
              {user?.is_demo && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Demo Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
              <span>{profile.education}</span> • 
              <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {profile.state}</span> • 
              <span className="flex items-center gap-0.5"><IndianRupee className="w-3 h-3" /> ₹{profile.annual_income.toLocaleString('en-IN')}/yr</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigateTo('profile')}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigateTo('eligibility')}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Recalculate Eligibility
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">High Match Schemes</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-600 block mt-1">{totalEligibleCount} Schemes</span>
          <span className="text-[11px] text-slate-500">80%+ Match threshold</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Applications</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-blue-600 block mt-1">{applications.length} Tracked</span>
          <span className="text-[11px] text-slate-500">In government portals</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Saved Benefits</span>
            <Bookmark className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-black text-indigo-600 block mt-1">{savedSchemeIds.length} Saved</span>
          <span className="text-[11px] text-slate-500">Bookmarked for review</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Copilot</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 block mt-1">Grounded RAG</span>
          <span className="text-[11px] text-slate-500">Verified official rules</span>
        </div>
      </div>

      {/* 3. Top Recommended Schemes for Citizen Profile */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Top Recommended Schemes For You</h2>
            <p className="text-xs text-slate-500">Based on your age ({profile.age}), state ({profile.state}), and annual income (₹{profile.annual_income.toLocaleString('en-IN')}).</p>
          </div>
          <button
            onClick={() => navigateTo('results')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View All ({eligibilityResults.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {topEligibleResults.map(result => (
            <SchemeCard
              key={result.scheme_id}
              scheme={result.scheme}
              eligibilityResult={result}
            />
          ))}
        </div>
      </div>

      {/* 4. Active Applications Tracker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              My Government Application Tracker
            </h3>
            <p className="text-xs text-slate-500">Monitor status, reference numbers, and timeline milestones.</p>
          </div>
          <button
            onClick={() => navigateTo('schemes')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
          >
            + Track Another Scheme
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {applications.map((app) => (
            <div key={app._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={app.status} type="application" />
                  <span className="text-xs font-mono font-bold text-slate-500">Ref: {app.application_number}</span>
                  <span className="text-xs text-slate-400">• Applied {app.applied_date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{app.scheme_name}</h4>
                <p className="text-xs text-slate-500 italic">"{app.notes}"</p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <select
                  value={app.status}
                  onChange={(e) => createOrUpdateApplication({ ...app, status: e.target.value as any })}
                  className="text-xs font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button
                  onClick={() => navigateTo(`scheme_details:${app.scheme_id}`)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  View Scheme
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Saved Schemes Quick Access */}
      {savedSchemes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-indigo-600" />
              Saved Schemes ({savedSchemes.length})
            </h2>
            <button
              onClick={() => navigateTo('saved')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Manage Saved
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {savedSchemes.map(scheme => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
              />
            ))}
          </div>
        </div>
      )}

      {/* 6. Quick Action Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => navigateTo('combination')}
          className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 cursor-pointer hover:border-emerald-300 transition-all flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <GitCompare className="w-4 h-4" />
              Benefit Combo Checker
            </div>
            <h4 className="text-sm font-bold text-slate-900">Check if your scholarships & schemes can be combined</h4>
            <p className="text-xs text-slate-600">Avoid duplicate rejection across Central and State portals.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-700 shrink-0 ml-2" />
        </div>

        <div 
          onClick={() => navigateTo('copilot')}
          className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 cursor-pointer hover:border-indigo-300 transition-all flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              AI Benefits Copilot
            </div>
            <h4 className="text-sm font-bold text-slate-900">Ask any question on application documents or deadlines</h4>
            <p className="text-xs text-slate-600">Grounded in official ministry guidelines.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-700 shrink-0 ml-2" />
        </div>
      </div>

    </div>
  );
};
