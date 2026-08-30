export type SocialCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
export type Gender = 'male' | 'female' | 'other' | 'all';
export type EmploymentStatus = 'Student' | 'Employed (Private)' | 'Employed (Govt)' | 'Self-Employed' | 'Unemployed' | 'Farmer' | 'Daily Wage / Informal' | 'Homemaker' | 'Retired';
export type EducationLevel = 'Below 10th' | '10th Pass' | '12th Pass' | 'Diploma' | 'Graduate (B.Tech / B.E)' | 'Graduate (B.Sc / B.Com / B.A)' | 'Post Graduate (M.Tech / M.Sc / M.A / MBA)' | 'Doctorate / Ph.D' | 'ITI / Vocational';

export interface UserProfile {
  age: number;
  gender: Gender;
  state: string;
  district: string;
  annual_income: number;
  income_source: string;
  education: EducationLevel | string;
  occupation: string;
  student_status: boolean;
  employment_status: EmploymentStatus;
  category: SocialCategory;
  is_farmer: boolean;
  has_disability: boolean;
  disability_percentage?: number;
  is_woman_entrepreneur: boolean;
  is_minority: boolean;
  bpl_card_holder: boolean;
}

export type SchemeCategory = 
  | 'All'
  | 'Education' 
  | 'Scholarship' 
  | 'Employment' 
  | 'Housing' 
  | 'Healthcare' 
  | 'Agriculture' 
  | 'Women' 
  | 'Entrepreneurship' 
  | 'Financial Assistance'
  | 'Social Welfare';

export interface SchemeDocument {
  name: string;
  mandatory: boolean;
  purpose: string;
  issuing_authority?: string;
}

export interface SchemeEligibility {
  age?: {
    min?: number;
    max?: number;
  };
  income?: {
    max?: number;
  };
  gender?: ('male' | 'female' | 'other')[];
  states?: string[]; // empty or ['All India'] means pan-India
  education?: string[];
  categories?: SocialCategory[];
  is_farmer?: boolean;
  has_disability?: boolean;
  is_woman_entrepreneur?: boolean;
  student_status?: boolean;
  employment_status?: string[];
  bpl_required?: boolean;
  additional_criteria?: string[];
}

export interface SchemeBenefit {
  min: number;
  max: number;
  type: 'direct_cash' | 'subsidy' | 'loan' | 'insurance' | 'scholarship' | 'pension' | 'in_kind';
  display_text: string;
  frequency?: 'one_time' | 'annual' | 'monthly' | 'per_academic_year' | 'subsidized_loan';
  currency: string;
}

export interface SchemeSource {
  name: string;
  url: string;
  last_verified: string;
  nodal_agency: string;
}

export interface SchemeCombinationRules {
  stackable: boolean;
  incompatible_with: string[]; // Scheme IDs that cannot be claimed together
  compatible_with: string[];   // Explicitly allowed pairings
  notes: string;
}

export interface Scheme {
  _id: string;
  id: string;
  name: string;
  hindi_name?: string;
  category: SchemeCategory;
  ministry: string;
  short_description: string;
  description: string;
  benefit: SchemeBenefit;
  eligibility: SchemeEligibility;
  documents: SchemeDocument[];
  application: {
    method: 'online' | 'offline' | 'hybrid';
    portal_name: string;
    official_url: string;
    steps: string[];
    fees?: string;
  };
  deadline: string;
  deadline_status: 'active' | 'rolling' | 'upcoming' | 'closed';
  source: SchemeSource;
  combination_rules: SchemeCombinationRules;
  tags: string[];
  content: string; // Grounded context for RAG
}

export type EligibilityStatus = 'eligible' | 'potentially_eligible' | 'needs_verification' | 'not_eligible';

export interface EligibilityResult {
  scheme_id: string;
  scheme: Scheme;
  status: EligibilityStatus;
  match_score: number; // 0 to 100
  score_breakdown: {
    age: number;
    income: number;
    state: number;
    education: number;
    category: number;
    other: number;
  };
  matched_rules: string[];
  failed_rules: string[];
  verification_required: string[];
  ai_explanation?: string;
  confidence_score: number;
}

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface ApplicationTimelineEvent {
  date: string;
  status: string;
  description: string;
}

export interface UserApplication {
  _id: string;
  user_id: string;
  scheme_id: string;
  scheme_name: string;
  category: SchemeCategory;
  status: ApplicationStatus;
  application_number?: string;
  applied_date?: string;
  documents_uploaded: string[];
  notes: string;
  timeline: ApplicationTimelineEvent[];
  created_at: string;
  updated_at: string;
}

export interface SavedScheme {
  _id: string;
  user_id: string;
  scheme_id: string;
  scheme: Scheme;
  created_at: string;
}

export interface CopilotSource {
  title: string;
  url: string;
  department?: string;
  scheme_id?: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: CopilotSource[];
  suggested_followups?: string[];
}

export interface RejectionAnalysisResult {
  rejection_text: string;
  detected_scheme?: string;
  probable_reason: string;
  rule_violated: string;
  actionable_steps: string[];
  alternative_schemes: Scheme[];
  appeal_guidance: string;
}

export interface CombinationCheckResult {
  status: 'compatible' | 'verification_required' | 'incompatible';
  summary: string;
  details: string[];
  recommendation: string;
  schemes: Scheme[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  profile?: UserProfile;
  is_demo?: boolean;
}
