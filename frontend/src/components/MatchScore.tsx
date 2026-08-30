import React from 'react';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MatchScore: React.FC<MatchScoreProps> = ({ 
  score, 
  size = 'md',
  showLabel = true 
}) => {
  // Determine color palette based on match score
  let colorBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let badgeText = 'High Match';

  if (score >= 85) {
    colorBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    badgeText = 'High Match';
  } else if (score >= 65) {
    colorBg = 'bg-blue-50 text-blue-700 border-blue-200';
    badgeText = 'Good Match';
  } else if (score >= 50) {
    colorBg = 'bg-amber-50 text-amber-700 border-amber-200';
    badgeText = 'Potential Match';
  } else {
    colorBg = 'bg-slate-100 text-slate-600 border-slate-200';
    badgeText = 'Low Match';
  }

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${colorBg}`}>
        <span>{score}%</span>
        {showLabel && <span className="font-medium text-[10px]">Match</span>}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border ${colorBg} shadow-2xs`}>
        <div className="flex flex-col items-center leading-none">
          <span className="text-xl font-extrabold tracking-tight">{score}%</span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Match Score</span>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${colorBg}`}>
      <span className="w-2 h-2 rounded-full bg-current opacity-75"></span>
      <span>{score}% Match</span>
      {showLabel && <span className="text-[10px] opacity-75 hidden sm:inline">({badgeText})</span>}
    </span>
  );
};
