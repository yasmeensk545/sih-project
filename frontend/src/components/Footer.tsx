import React from 'react';
import { ShieldCheck, ExternalLink, Info, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      {/* Trust & Official Disclaimer Banner */}
      <div className="bg-slate-50/80 border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong className="text-slate-800">Verified Official Portals:</strong> All scheme details and application URLs point directly to authentic government databases (NSP, PM-KISAN, ePASS, JanSamarth, etc.).
            </span>
          </div>
          <span className="text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs text-center">
            Subject to final government nodal verification
          </span>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇮🇳</span>
              <span className="text-base font-bold text-slate-900">
                Bharat Benefits <span className="text-blue-600">Navigator</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering Indian citizens with automated rule-based scheme eligibility, document roadmaps, and instant AI guidance.
            </p>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
              A Civic-Tech Open Initiative
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Explore Portals</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => navigateTo('schemes')} className="hover:text-blue-600 transition-colors">
                  All Central & State Schemes
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('eligibility')} className="hover:text-blue-600 transition-colors">
                  5-Step Eligibility Engine
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('copilot')} className="hover:text-blue-600 transition-colors">
                  AI Benefits Copilot
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('combination')} className="hover:text-blue-600 transition-colors">
                  Benefit Combination Checker
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('rejection')} className="hover:text-blue-600 transition-colors">
                  Rejection Explainer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Key Sectors</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center justify-between">
                <span>Higher Education & Scholarships</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Active</span>
              </li>
              <li>Agriculture & PM-KISAN</li>
              <li>Healthcare & Ayushman Bharat</li>
              <li>Women & Youth Entrepreneurship</li>
              <li>Credit Linked Capital Subsidies</li>
            </ul>
          </div>

          {/* Col 4: Official Portals */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">External Links</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                  National Scholarship Portal (NSP) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://telanganaepass.cgg.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                  Telangana ePASS Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                  PM Kisan Official Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.jansamarth.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                  JanSamarth Credit Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>© 2026 Bharat Benefits Navigator</span>
            <span className="h-3 w-px bg-slate-300"></span>
            <span className="text-slate-400">Civic Hackathon Edition</span>
          </div>
          
          <div className="text-slate-400 text-[11px] text-center sm:text-right">
            Information should always be verified on the official government source before applying.
          </div>
        </div>
      </div>
    </footer>
  );
};
