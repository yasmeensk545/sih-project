import React from 'react';
import { useApp } from '../context/AppContext';
import { SchemeCard } from '../components/SchemeCard';
import { Bookmark, Compass, ArrowRight } from 'lucide-react';

export const SavedSchemesPage: React.FC = () => {
  const { savedSchemeIds, schemes, eligibilityResults, navigateTo } = useApp();

  const savedSchemes = schemes.filter(s => savedSchemeIds.includes(s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200 mb-1">
            <Bookmark className="w-3.5 h-3.5" />
            Personal Bookmarks
          </div>
          <h1 className="text-2xl font-black text-slate-900">Saved Government Schemes</h1>
          <p className="text-xs text-slate-500">Schemes you have bookmarked for document preparation or upcoming portal deadlines.</p>
        </div>

        <button
          onClick={() => navigateTo('schemes')}
          className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
        >
          Explore More Schemes
        </button>
      </div>

      {savedSchemes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedSchemes.map(scheme => {
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
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No schemes bookmarked yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any scheme in the Explore or Results page to save it here.
          </p>
          <button
            onClick={() => navigateTo('schemes')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-blue-700 mt-2"
          >
            Browse All Schemes
          </button>
        </div>
      )}

    </div>
  );
};
