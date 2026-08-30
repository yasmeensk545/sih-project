import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickDemoLogin, navigateTo } = useApp();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigateTo('dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      {/* 1-Click Instant Demo Login Banner for Evaluators */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          Hackathon / Evaluator Mode
        </div>
        <p className="text-xs text-amber-800">
          Skip manual typing! Launch an instant session with pre-configured Telangana B.Tech student demo data.
        </p>
        <button
          onClick={quickDemoLogin}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs shadow-xs transition-colors"
        >
          1-Click Instant Demo Login →
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <span className="text-2xl">🇮🇳</span>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to Bharat Benefits</h1>
          <p className="text-xs text-slate-500">Access saved schemes and application trackers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Don't have an account?{' '}
          <button
            onClick={() => navigateTo('register')}
            className="font-bold text-blue-600 hover:underline"
          >
            Create Citizen Account
          </button>
        </div>
      </div>
    </div>
  );
};
