import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SchemeCard } from '../components/SchemeCard';
import { 
  Search, 
  Filter, 
  Compass, 
  MapPin, 
  Building2, 
  Sparkles, 
  SlidersHorizontal,
  Layers,
  IndianRupee,
  RotateCcw
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Scholarship',
  'Education',
  'Agriculture',
  'Healthcare',
  'Housing',
  'Women',
  'Entrepreneurship',
  'Employment'
];

const STATES = [
  'All States (Pan-India)',
  'Telangana',
  'Andhra Pradesh',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh',
  'Delhi'
];

export const ExploreSchemesPage: React.FC = () => {
  const { schemes, eligibilityResults, navigateTo } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedState, setSelectedState] = useState('All States (Pan-India)');
  const [selectedType, setSelectedType] = useState('all');

  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      // Search term
      const matchesSearch = 
        searchTerm.trim() === '' ||
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category
      const matchesCategory = 
        selectedCategory === 'All Categories' || 
        scheme.category.toLowerCase() === selectedCategory.toLowerCase();

      // State
      let matchesState = true;
      if (selectedState !== 'All States (Pan-India)') {
        const isPanIndia = scheme.eligibility.states?.includes('All India') || scheme.eligibility.states?.includes('Pan India');
        matchesState = isPanIndia || (scheme.eligibility.states?.includes(selectedState) ?? false);
      }

      // Type
      const matchesType = 
        selectedType === 'all' || 
        scheme.benefit.type === selectedType;

      return matchesSearch && matchesCategory && matchesState && matchesType;
    });
  }, [schemes, searchTerm, selectedCategory, selectedState, selectedType]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedState('All States (Pan-India)');
    setSelectedType('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
            <Compass className="w-3.5 h-3.5" />
            Central & State Welfare Repository
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Explore Government Schemes & Direct Benefits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Filter through {schemes.length} verified government welfare programs across Central Ministries and State welfare portals.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by scheme name, ministry, keyword (e.g. 'Scholarship', 'ePASS', 'Mudra', 'Farmer', 'B.Tech')..."
            className="w-full pl-12 pr-4 py-3.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Category Dropdown */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Sector / Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* State Dropdown */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              State / Domicile
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Benefit Type Dropdown */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Benefit Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Benefit Structures</option>
              <option value="direct_cash">Direct Cash / Reimbursement</option>
              <option value="subsidized_loan">Subsidized Interest Loan</option>
              <option value="fee_waiver">Full / Partial Fee Waiver</option>
              <option value="insurance">Insurance & Healthcare Coverage</option>
            </select>
          </div>

        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredSchemes.length}</strong> of {schemes.length} schemes
          </span>

          {(searchTerm || selectedCategory !== 'All Categories' || selectedState !== 'All States (Pan-India)' || selectedType !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map(scheme => {
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
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No schemes matched your search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or resetting the sector and state filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
