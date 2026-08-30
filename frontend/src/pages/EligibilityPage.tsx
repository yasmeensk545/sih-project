import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmploymentStatus, UserProfile } from '../types';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  MapPin, 
  IndianRupee, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';

const INDIAN_STATES = [
  'Telangana',
  'Andhra Pradesh',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh',
  'Delhi',
  'Gujarat',
  'Rajasthan',
  'Madhya Pradesh',
  'West Bengal',
  'Bihar',
  'Kerala',
  'Punjab',
  'Haryana',
  'Odisha',
  'Assam'
];

const EDUCATION_LEVELS = [
  'Below 10th',
  '10th Pass',
  '12th Pass',
  'Diploma',
  'Graduate (B.Tech / B.E)',
  'Graduate (B.Sc / B.Com / B.A)',
  'Post Graduate (M.Tech / M.Sc / M.A / MBA)',
  'Doctorate / Ph.D',
  'ITI / Vocational'
];

const OCCUPATIONS = [
  { label: 'Student / Higher Education Aspirant', value: 'Student' },
  { label: 'Farmer / Agricultural Landholder', value: 'Farmer' },
  { label: 'Small Business Owner / MSME Entrepreneur', value: 'Self-Employed' },
  { label: 'Salaried Private Sector Employee', value: 'Employed (Private)' },
  { label: 'Government Employee / Public Sector', value: 'Employed (Govt)' },
  { label: 'Self-Employed / Freelancer / Artisan', value: 'Self-Employed' },
  { label: 'Unemployed / Job Seeker', value: 'Unemployed' },
  { label: 'Daily Wage / Informal Worker', value: 'Daily Wage / Informal' },
  { label: 'Homemaker', value: 'Homemaker' }
] satisfies { label: string; value: EmploymentStatus }[];

const occupationLabelForStatus = (status: EmploymentStatus, fallback: string) => {
  return OCCUPATIONS.find((occupation) => occupation.value === status)?.label || fallback;
};

const syncOccupation = (label: string) => {
  const selected = OCCUPATIONS.find((occupation) => occupation.label === label);
  return selected || OCCUPATIONS[0];
};

const demoProfile: UserProfile = {
  age: 24,
  gender: 'female',
  state: 'Telangana',
  district: 'Hyderabad',
  annual_income: 350000,
  income_source: 'Family Business & Part-time',
  education: 'Graduate (B.Tech / B.E)',
  occupation: 'Student / Higher Education Aspirant',
  student_status: true,
  employment_status: 'Student',
  category: 'General',
  is_farmer: false,
  has_disability: false,
  is_woman_entrepreneur: false,
  is_minority: false,
  bpl_card_holder: false
};

const normalizeProfileForRules = (profile: UserProfile): UserProfile => {
  const selectedOccupation = syncOccupation(profile.occupation);
  return {
    ...profile,
    occupation: selectedOccupation.label,
    employment_status: selectedOccupation.value,
    student_status: selectedOccupation.value === 'Student' ? true : profile.student_status,
    is_farmer: selectedOccupation.value === 'Farmer' ? true : profile.is_farmer
  };
};

export const EligibilityPage: React.FC = () => {
  const { profile, updateProfile, runEligibilityCheck, navigateTo, loadDemoProfile } = useApp();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleChange = (key: keyof UserProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    const normalizedProfile = normalizeProfileForRules(formData);
    setFormData(normalizedProfile);
    updateProfile(normalizedProfile);
    runEligibilityCheck(normalizedProfile);
    navigateTo('results');
  };

  const handleLoadDemo = () => {
    loadDemoProfile();
    setFormData(demoProfile);
  };

  const stepTitles = [
    { num: 1, title: 'Personal Details', icon: User },
    { num: 2, title: 'Location & Domicile', icon: MapPin },
    { num: 3, title: 'Income & Finance', icon: IndianRupee },
    { num: 4, title: 'Education & Profession', icon: GraduationCap },
    { num: 5, title: 'Specific Criteria', icon: ShieldCheck }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Deterministic Rule Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Check Your Government Scheme Eligibility
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Answer 5 quick categories to generate matched central and state welfare benefits with exact reasons.
          </p>
        </div>

        {/* 1-Click Demo Profile Button */}
        <button
          onClick={handleLoadDemo}
          className="shrink-0 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          title="Fills data for Telangana B.Tech student (Income ₹3.5L)"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          Load Demo Profile (Telangana Student)
        </button>
      </div>

      {/* Step Navigation Indicator */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {stepTitles.map((s) => {
          const isCompleted = step > s.num;
          const isCurrent = step === s.num;

          return (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isCurrent 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                  : isCompleted
                  ? 'bg-blue-50/60 border-blue-200 text-blue-900 hover:bg-blue-100'
                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isCurrent ? 'text-blue-100' : isCompleted ? 'text-blue-600' : 'text-slate-400'
                }`}>
                  Step {s.num}
                </span>
                <s.icon className={`w-3.5 h-3.5 ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-blue-600' : 'text-slate-300'
                }`} />
              </div>
              <span className="text-xs font-bold truncate mt-1 hidden sm:block">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Form Step Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        
        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Personal Details</h2>
              <p className="text-xs text-slate-500">Essential demographic inputs required by all Central and State schemes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Age */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || 18)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">E.g., 24 years</span>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="female">Female (Qualifies for targeted Women schemes)</option>
                  <option value="male">Male</option>
                  <option value="other">Transgender / Other</option>
                </select>
              </div>

              {/* Social Category */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Social Category / Caste Reservation *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(['General', 'OBC', 'SC', 'ST', 'EWS'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleChange('category', cat)}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                        formData.category === cat
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  Many scholarships and affirmative welfare programs have earmarked reservations for SC/ST/OBC/EWS.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Location & Domicile */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Domicile & Location</h2>
              <p className="text-xs text-slate-500">State domicile determines access to state-specific fee reimbursement and welfare schemes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* State */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Permanent Domicile State *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  e.g., Selecting "Telangana" activates TS ePASS and state-specific portals.
                </span>
              </div>

              {/* District */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  District / Municipal Area
                </label>
                <input
                  type="text"
                  value={formData.district || ''}
                  onChange={(e) => handleChange('district', e.target.value)}
                  placeholder="e.g. Hyderabad, Rangareddy, Warangal, Pune"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Income & Finance */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Annual Household Income</h2>
              <p className="text-xs text-slate-500">Government schemes enforce strict annual income ceilings as certified by MeeSeva / Tahsildar.</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Annual Gross Family Income (INR) *
                  </label>
                  <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                    ₹{formData.annual_income.toLocaleString('en-IN')} / Year
                  </span>
                </div>

                {/* Quick Selection Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                  {[
                    { label: '₹1.5 Lakhs', val: 150000 },
                    { label: '₹2.5 Lakhs', val: 250000 },
                    { label: '₹3.5 Lakhs', val: 350000 },
                    { label: '₹6.0 Lakhs', val: 600000 },
                    { label: '₹8.0 Lakhs (EWS)', val: 800000 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => handleChange('annual_income', preset.val)}
                      className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                        formData.annual_income === preset.val
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min="50000"
                  max="1200000"
                  step="25000"
                  value={formData.annual_income}
                  onChange={(e) => handleChange('annual_income', parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>₹50,000</span>
                  <span>₹2.5 Lakhs (Scholarship Limit)</span>
                  <span>₹8.0 Lakhs (EWS Cap)</span>
                  <span>₹12.0 Lakhs+</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Primary Income Source
                  </label>
                  <input
                    type="text"
                    value={formData.income_source || ''}
                    onChange={(e) => handleChange('income_source', e.target.value)}
                    placeholder="e.g. Small Business, Agriculture, Salaried"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="bpl_check"
                    checked={formData.bpl_card_holder}
                    onChange={(e) => handleChange('bpl_card_holder', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                  />
                  <label htmlFor="bpl_check" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Family holds BPL / Food Security (Ration) Card
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Education & Profession */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 4: Education & Profession</h2>
              <p className="text-xs text-slate-500">Matches scholarships, education loan subsidies, and youth skill initiatives.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Education Level */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Current / Highest Education Level *
                </label>
                <select
                  value={formData.education}
                  onChange={(e) => handleChange('education', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Occupation */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Primary Occupation *
                </label>
                <select
                  value={occupationLabelForStatus(formData.employment_status, formData.occupation)}
                  onChange={(e) => {
                    const selected = syncOccupation(e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      occupation: selected.label,
                      employment_status: selected.value,
                      student_status: selected.value === 'Student' ? true : prev.student_status,
                      is_farmer: selected.value === 'Farmer' ? true : prev.is_farmer
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {OCCUPATIONS.map((occ) => (
                    <option key={occ.label} value={occ.label}>{occ.label}</option>
                  ))}
                </select>
              </div>

              {/* Student status checkbox */}
              <div className="sm:col-span-2 flex items-center gap-3 bg-blue-50/60 p-3.5 rounded-xl border border-blue-200">
                <input
                  type="checkbox"
                  id="student_status_check"
                  checked={formData.student_status}
                  onChange={(e) => handleChange('student_status', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="student_status_check" className="text-xs font-bold text-blue-900 cursor-pointer">
                  Currently enrolled as an active regular college / university student
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Specific Criteria */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 5: Specific Welfare Criteria</h2>
              <p className="text-xs text-slate-500">Check all that apply to unlock targeted subsidies and affirmative schemes.</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'is_farmer',
                  label: 'Agricultural Landholder / Cultivator (Farmer)',
                  desc: 'Unlocks PM-KISAN (₹6,000/yr), crop insurance, and Kisan Credit Card subsidies.'
                },
                {
                  id: 'has_disability',
                  label: 'Person with Benchmark Disability (PwD / Divyangjan 40%+)',
                  desc: 'Unlocks Divyangjan scholarships, assistive aids, and reserved subsidies.'
                },
                {
                  id: 'is_woman_entrepreneur',
                  label: 'Woman Entrepreneur / Startup Promoter (Holding 51%+ Equity)',
                  desc: 'Unlocks Stand-Up India, Mudra Tarun, and Mahila Samridhi loan schemes.'
                },
                {
                  id: 'is_minority',
                  label: 'Belongs to Notified Minority Community (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)',
                  desc: 'Unlocks Ministry of Minority Affairs merit scholarships and pre-matric funds.'
                }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleChange(item.id as keyof UserProfile, !formData[item.id as keyof UserProfile])}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    formData[item.id as keyof UserProfile]
                      ? 'bg-blue-50/70 border-blue-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!formData[item.id as keyof UserProfile]}
                    onChange={() => {}} // handled by parent click
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                    <span className="text-[11px] text-slate-500 leading-normal">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Controls Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              step === 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Step {step} of 5
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-xs hover:shadow transition-all flex items-center gap-1.5"
          >
            <span>{step === 5 ? 'Run Eligibility Engine →' : 'Continue'}</span>
            {step !== 5 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
};
