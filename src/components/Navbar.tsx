import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Sparkles, 
  User, 
  Bookmark, 
  FileText, 
  LogOut, 
  CheckCircle2, 
  SlidersHorizontal, 
  Menu, 
  X, 
  ChevronDown, 
  LayoutDashboard,
  ShieldCheck,
  Zap,
  HelpCircle,
  GitCompare,
  AlertTriangle,
  House
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    isLoggedIn, 
    logout, 
    currentPage, 
    navigateTo, 
    savedSchemeIds, 
    applications,
    quickDemoLogin
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'live' | 'offline'>('checking');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/health')
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable');
        return response.json();
      })
      .then(() => {
        if (isMounted) setApiStatus('live');
      })
      .catch(() => {
        if (isMounted) setApiStatus('offline');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const navItemClass = (page: string) => {
    const active = currentPage === page;
    return `flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
      active
        ? 'bg-blue-50 text-blue-700 font-semibold ring-1 ring-blue-100'
        : 'text-slate-600 hover:bg-slate-100 hover:text-blue-700'
    }`;
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <div
            onClick={() => navigateTo('home')}
            className="group flex cursor-pointer items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition-transform duration-200 group-hover:scale-105">
              <House className="h-4 w-4" />
            </div>

            <div className="leading-none">
              <div className="text-[15px] font-black tracking-[-0.04em] text-slate-900">
                Bharat <span className="text-blue-600">Navigator</span>
              </div>
              <div className="mt-1 text-[9px] font-medium tracking-[0.14em] text-slate-400 uppercase">
                Direct Civic Benefits & Rule Engine
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1">
              <button onClick={() => navigateTo('home')} className={navItemClass('home')}>
                Home
              </button>

              <button onClick={() => navigateTo('schemes')} className={navItemClass('schemes')}>
                <Compass className="w-3.5 h-3.5" />
                Explore
              </button>

              {isLoggedIn ? (
                <>
                  <button onClick={() => navigateTo('dashboard')} className={navItemClass('dashboard')}>
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    My Benefits
                  </button>

                  <button onClick={() => navigateTo('copilot')} className={navItemClass('copilot')}>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Copilot
                  </button>

                  <button onClick={() => navigateTo('combination')} className={navItemClass('combination')}>
                    <GitCompare className="w-3.5 h-3.5 text-emerald-600" />
                    Combo
                  </button>

                  <button onClick={() => navigateTo('rejection')} className={navItemClass('rejection')}>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Rejection
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigateTo('copilot')} className={navItemClass('copilot')}>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Copilot
                  </button>
                  <button onClick={() => navigateTo('combination')} className={navItemClass('combination')}>
                    <GitCompare className="w-3.5 h-3.5 text-emerald-600" />
                    Combo
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2.5">
            <div className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold ${
              apiStatus === 'live'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : apiStatus === 'offline'
                ? 'border-amber-200 bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}>
              <ShieldCheck className="w-3 h-3" />
              {apiStatus === 'live' ? 'Live' : apiStatus === 'offline' ? 'Fallback' : 'Checking'}
            </div>

            <button
              onClick={() => navigateTo('eligibility')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <CheckCircle2 className="w-4 h-4" />
              Check Eligibility
            </button>

            {isLoggedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">Hi, {user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { navigateTo('dashboard'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => { navigateTo('profile'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Personal Profile
                      </button>
                      <button
                        onClick={() => { navigateTo('applications'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 justify-between"
                      >
                        <span className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-slate-400" />
                          Track Applications
                        </span>
                        {applications.length > 0 && (
                          <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {applications.length}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => { navigateTo('saved'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 justify-between"
                      >
                        <span className="flex items-center gap-2.5">
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          Saved Schemes
                        </span>
                        {savedSchemeIds.length > 0 && (
                          <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {savedSchemeIds.length}
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo('login')}
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={quickDemoLogin}
                  className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  title="Instant Demo Mode (Telangana Student profile)"
                >
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                  Demo 1-Click
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${apiStatus === 'live' ? 'bg-emerald-500' : apiStatus === 'offline' ? 'bg-amber-500' : 'bg-slate-300'}`} title={`API ${apiStatus}`} />
            <button
              onClick={() => navigateTo('eligibility')}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              Eligibility
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-50 text-left"
            >
              Home
            </button>
            <button
              onClick={() => { navigateTo('schemes'); setIsMobileMenuOpen(false); }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-50 text-left"
            >
              Explore Schemes
            </button>
            <button
              onClick={() => { navigateTo('copilot'); setIsMobileMenuOpen(false); }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50 text-left"
            >
              ✨ Benefits Copilot
            </button>
            <button
              onClick={() => { navigateTo('combination'); setIsMobileMenuOpen(false); }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50 text-left"
            >
              Combo Checker
            </button>
            <button
              onClick={() => { navigateTo('rejection'); setIsMobileMenuOpen(false); }}
              className="col-span-2 px-3 py-2 rounded-lg text-sm font-medium text-amber-700 bg-amber-50 text-left"
            >
              ⚠️ Rejection Explainer
            </button>
          </div>

          {isLoggedIn && user ? (
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase">My Account ({user.name})</div>
              <button
                onClick={() => { navigateTo('dashboard'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
                My Benefits Dashboard
              </button>
              <button
                onClick={() => { navigateTo('profile'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
              >
                <User className="w-4 h-4 text-blue-600" />
                Edit Profile
              </button>
              <button
                onClick={() => { navigateTo('applications'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 justify-between"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Applications
                </span>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                  {applications.length}
                </span>
              </button>
              <button
                onClick={() => { navigateTo('saved'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 justify-between"
              >
                <span className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-blue-600" />
                  Saved Schemes
                </span>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                  {savedSchemeIds.length}
                </span>
              </button>
              <button
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => { navigateTo('login'); setIsMobileMenuOpen(false); }}
                className="w-full py-2 text-center text-sm font-semibold border border-slate-300 rounded-lg"
              >
                Login
              </button>
              <button
                onClick={() => { quickDemoLogin(); setIsMobileMenuOpen(false); }}
                className="w-full py-2 text-center text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Instant Demo Account
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
