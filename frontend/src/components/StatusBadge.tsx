import React from 'react';
import { ApplicationStatus, EligibilityStatus } from '../types';
import { CheckCircle, Clock, AlertCircle, XCircle, FileEdit, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus | EligibilityStatus | string;
  type?: 'application' | 'eligibility';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'application' }) => {
  if (type === 'eligibility') {
    switch (status) {
      case 'eligible':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Eligible
          </span>
        );
      case 'potentially_eligible':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Potentially Eligible
          </span>
        );
      case 'needs_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <HelpCircle className="w-3.5 h-3.5" />
            Verification Required
          </span>
        );
      case 'not_eligible':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5" />
            Not Eligible
          </span>
        );
    }
  }

  // Application Tracking Status
  switch (status.toLowerCase()) {
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5" />
          Approved
        </span>
      );
    case 'under_review':
    case 'under review':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          Under Review
        </span>
      );
    case 'submitted':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <CheckCircle className="w-3.5 h-3.5" />
          Submitted
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200">
          <AlertCircle className="w-3.5 h-3.5" />
          Rejected
        </span>
      );
    case 'draft':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <FileEdit className="w-3.5 h-3.5" />
          Draft
        </span>
      );
  }
};
