import { Scheme, UserProfile, EligibilityResult, EligibilityStatus } from '../types.js';

export interface ScoringWeights {
  age: number;      // e.g. 0.15
  income: number;   // e.g. 0.25
  state: number;    // e.g. 0.20
  education: number;// e.g. 0.20
  category: number; // e.g. 0.10
  other: number;    // e.g. 0.10
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  age: 0.15,
  income: 0.25,
  state: 0.20,
  education: 0.20,
  category: 0.10,
  other: 0.10
};

/**
 * Deterministic Eligibility Rule Engine
 * Never uses AI/LLM to guess rules. Evaluates formal constraints and assigns transparent rule reasons.
 */
export function evaluateEligibility(
  scheme: Scheme, 
  profile: UserProfile, 
  weights: ScoringWeights = DEFAULT_WEIGHTS
): EligibilityResult {
  const matched_rules: string[] = [];
  const failed_rules: string[] = [];
  const verification_required: string[] = [];

  let ageScore = 1.0;
  let incomeScore = 1.0;
  let stateScore = 1.0;
  let educationScore = 1.0;
  let categoryScore = 1.0;
  let otherScore = 1.0;

  const elig = scheme.eligibility;

  // 1. Age check (Weight: 15%)
  if (elig.age) {
    const { min, max } = elig.age;
    if (min !== undefined && profile.age < min) {
      ageScore = 0;
      failed_rules.push(`Age is below minimum requirement (${profile.age} < ${min} years)`);
    } else if (max !== undefined && profile.age > max) {
      ageScore = 0;
      failed_rules.push(`Age exceeds maximum limit (${profile.age} > ${max} years)`);
    } else {
      matched_rules.push(`Age criteria satisfied (${profile.age} years within ${min || 0} - ${max || 100} range)`);
    }
  } else {
    matched_rules.push("No age restriction specified (Open to all age groups)");
  }

  // 2. Income check (Weight: 25%)
  if (elig.income && elig.income.max !== undefined) {
    if (profile.annual_income <= elig.income.max) {
      matched_rules.push(`Income requirement satisfied (₹${profile.annual_income.toLocaleString('en-IN')} is within ceiling of ₹${elig.income.max.toLocaleString('en-IN')})`);
    } else {
      incomeScore = 0;
      failed_rules.push(`Annual income exceeds threshold (₹${profile.annual_income.toLocaleString('en-IN')} > ₹${elig.income.max.toLocaleString('en-IN')})`);
    }
  } else {
    matched_rules.push("No strict household income ceiling specified");
  }

  // 3. State / Location check (Weight: 20%)
  if (elig.states && elig.states.length > 0) {
    const isPanIndia = elig.states.includes("All India") || elig.states.includes("Pan India");
    const matchesState = isPanIndia || elig.states.some((s: string) => s.toLowerCase() === profile.state.toLowerCase());
    
    if (matchesState) {
      if (isPanIndia) {
        matched_rules.push(`National scheme applicable to residents of all states including ${profile.state}`);
      } else {
        matched_rules.push(`State domicile criteria satisfied (${profile.state} state approved)`);
      }
    } else {
      stateScore = 0;
      failed_rules.push(`Restricted to residents of ${elig.states.join(', ')} (Profile state: ${profile.state})`);
    }
  } else {
    matched_rules.push("Available pan-India across all states and union territories");
  }

  // 4. Education check (Weight: 20%)
  if (elig.education && elig.education.length > 0) {
    const matchesEdu = elig.education.some((edu: string) => {
      if (edu === profile.education) return true;
      if (edu.toLowerCase().includes("b.tech") && profile.education.toLowerCase().includes("b.tech")) return true;
      if (edu.toLowerCase().includes("graduate") && profile.education.toLowerCase().includes("graduate")) return true;
      return false;
    });

    if (matchesEdu) {
      matched_rules.push(`Educational qualification matches approved level (${profile.education})`);
    } else {
      educationScore = 0;
      failed_rules.push(`Requires qualification from: ${elig.education.slice(0, 3).join(', ')}`);
    }
  } else {
    matched_rules.push("No specific educational degree required");
  }

  // 5. Social Category (Weight: 10%)
  if (elig.categories && elig.categories.length > 0) {
    if (elig.categories.includes(profile.category)) {
      matched_rules.push(`Social category eligible (${profile.category})`);
    } else {
      categoryScore = 0;
      failed_rules.push(`Targeted exclusively for ${elig.categories.join(', ')} categories`);
    }
  } else {
    matched_rules.push("Open to all social categories (General, OBC, SC, ST, EWS)");
  }

  // 6. Other / Specific Conditions (Weight: 10%)
  // Gender
  if (elig.gender && elig.gender.length > 0) {
    if (!elig.gender.includes(profile.gender as any) && !elig.gender.includes('other' as any)) {
      otherScore = 0;
      failed_rules.push(`Scheme is specifically earmarked for ${elig.gender.join(' / ')} applicants`);
    } else {
      matched_rules.push(`Gender requirement satisfied (${profile.gender})`);
    }
  }

  // Farmer
  if (elig.is_farmer === true && !profile.is_farmer) {
    otherScore = 0;
    failed_rules.push("Beneficiary must be a registered agricultural landholder/farmer");
  } else if (elig.is_farmer === true && profile.is_farmer) {
    matched_rules.push("Agricultural cultivator / farmer status verified");
  }

  // Disability
  if (elig.has_disability === true && !profile.has_disability) {
    otherScore = 0;
    failed_rules.push("Reserved for persons with benchmark disability (PwD / Divyangjan)");
  } else if (elig.has_disability === true && profile.has_disability) {
    matched_rules.push("Disability status criteria satisfied");
  }

  // Women Entrepreneur
  if (elig.is_woman_entrepreneur === true && !profile.is_woman_entrepreneur) {
    if (profile.gender !== 'female') {
      otherScore = 0;
      failed_rules.push("Requires woman promoter or SC/ST entrepreneur holding min 51% stake");
    } else {
      verification_required.push("Verification of 51% shareholding or enterprise registration required");
    }
  } else if (elig.is_woman_entrepreneur === true && profile.is_woman_entrepreneur) {
    matched_rules.push("Woman entrepreneur / promoter criteria satisfied");
  }

  // Student Status
  if (elig.student_status === true && !profile.student_status) {
    otherScore = Math.min(otherScore, 0.5);
    failed_rules.push("Applicant must be an active regular student for this scheme");
  } else if (elig.student_status === true && profile.student_status) {
    matched_rules.push("Active student status criteria satisfied");
  }

  // Employment Status
  if (elig.employment_status && elig.employment_status.length > 0) {
    if (elig.employment_status.includes(profile.employment_status)) {
      matched_rules.push(`Employment status eligible (${profile.employment_status})`);
    } else {
      otherScore = 0;
      failed_rules.push(`Requires employment status from: ${elig.employment_status.join(', ')} (Profile: ${profile.employment_status})`);
    }
  }

  // BPL / ration card verification
  if (elig.bpl_required === true && !profile.bpl_card_holder) {
    otherScore = 0;
    failed_rules.push("Requires BPL / Food Security ration card proof");
  } else if (elig.bpl_required === true && profile.bpl_card_holder) {
    matched_rules.push("BPL / Food Security ration card requirement satisfied");
  } else if (scheme.id === 'SCH007' && !profile.bpl_card_holder) {
    verification_required.push("PMJAY final inclusion depends on SECC 2011, NFSA, state ration-card, or eligible family database lookup");
  }

  if (elig.has_disability === true && profile.has_disability && (profile.disability_percentage ?? 0) > 0 && (profile.disability_percentage ?? 0) < 40) {
    otherScore = 0;
    failed_rules.push("Disability percentage is below benchmark threshold of 40%");
  }

  // Additional verifications
  if (elig.additional_criteria && elig.additional_criteria.length > 0) {
    elig.additional_criteria.forEach((crit: string) => {
      verification_required.push(crit);
    });
  }

  // Calculate weighted score
  const totalScore = Math.round(
    (ageScore * weights.age +
     incomeScore * weights.income +
     stateScore * weights.state +
     educationScore * weights.education +
     categoryScore * weights.category +
     otherScore * weights.other) * 100
  );

  // Determine status
  let status: EligibilityStatus = 'not_eligible';
  if (failed_rules.length === 0) {
    if (verification_required.length === 0 && totalScore >= 90) {
      status = 'eligible';
    } else {
      status = 'potentially_eligible';
    }
  } else if (failed_rules.length === 1 && totalScore >= 70) {
    status = 'needs_verification';
  } else {
    status = 'not_eligible';
  }

  // Dynamic AI-like grounded explanation summary
  let ai_explanation = "";
  if (status === 'eligible' || status === 'potentially_eligible') {
    ai_explanation = `Based on your profile (${profile.age} yrs, ${profile.state}, Income ₹${profile.annual_income.toLocaleString('en-IN')}, ${profile.education}), you meet the major eligibility thresholds for the ${scheme.name}. All key parameters align with central and state directives.`;
  } else if (status === 'needs_verification') {
    ai_explanation = `You partially match this scheme (${totalScore}% match), but official clearance on the following item is required: ${failed_rules[0] || 'Institutional verification'}.`;
  } else {
    ai_explanation = `Your profile does not satisfy one or more critical scheme conditions: ${failed_rules.join('; ')}.`;
  }

  return {
    scheme_id: scheme.id,
    scheme,
    status,
    match_score: totalScore,
    score_breakdown: {
      age: Math.round(ageScore * weights.age * 100),
      income: Math.round(incomeScore * weights.income * 100),
      state: Math.round(stateScore * weights.state * 100),
      education: Math.round(educationScore * weights.education * 100),
      category: Math.round(categoryScore * weights.category * 100),
      other: Math.round(otherScore * weights.other * 100),
    },
    matched_rules,
    failed_rules,
    verification_required,
    ai_explanation,
    confidence_score: Math.min(totalScore, 95) // Never 100%
  };
}

/**
 * Runs eligibility checks across all schemes and sorts by match score.
 */
export function rankSchemesForProfile(schemes: Scheme[], profile: UserProfile): EligibilityResult[] {
  return schemes
    .map(scheme => evaluateEligibility(scheme, profile))
    .sort((a, b) => b.match_score - a.match_score);
}
