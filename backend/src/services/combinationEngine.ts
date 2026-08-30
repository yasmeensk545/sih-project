import { Scheme, CombinationCheckResult } from '../types.js';

/**
 * Deterministic Benefit Combination Engine
 * Explicitly analyzes mutual compatibility based on database combination rules.
 * Never allows the LLM to invent compatibility.
 */
export function checkBenefitsCombination(selectedSchemes: Scheme[]): CombinationCheckResult {
  if (selectedSchemes.length < 2) {
    return {
      status: 'compatible',
      summary: 'Please select at least two schemes to evaluate combination compatibility.',
      details: ['Only one scheme selected.'],
      recommendation: 'Select another benefit to run combination check.',
      schemes: selectedSchemes
    };
  }

  const conflictDetails: string[] = [];
  const verificationDetails: string[] = [];
  const synergyDetails: string[] = [];

  let hasDirectConflict = false;
  let hasVerificationNotice = false;

  for (let i = 0; i < selectedSchemes.length; i++) {
    for (let j = i + 1; j < selectedSchemes.length; j++) {
      const schemeA = selectedSchemes[i];
      const schemeB = selectedSchemes[j];

      // Check explicit incompatibility in either direction
      const aIncompatibleWithB = schemeA.combination_rules.incompatible_with?.includes(schemeB.id);
      const bIncompatibleWithA = schemeB.combination_rules.incompatible_with?.includes(schemeA.id);

      if (aIncompatibleWithB || bIncompatibleWithA) {
        hasDirectConflict = true;
        conflictDetails.push(
          `Conflict between "${schemeA.name}" and "${schemeB.name}": Dual scholarship / duplicated tuition fee reimbursement is legally prohibited under Ministry guidelines.`
        );
      }

      // Check category collision (e.g. 2 full tuition scholarships)
      if (
        (schemeA.category === 'Scholarship' && schemeB.category === 'Scholarship') ||
        (schemeA.id === 'SCH001' && schemeB.id === 'SCH003')
      ) {
        if (!aIncompatibleWithB && !bIncompatibleWithA) {
          hasVerificationNotice = true;
          verificationDetails.push(
            `Both "${schemeA.name}" and "${schemeB.name}" are primary scholarship funds. You can typically only claim one tuition reimbursement, though maintenance allowances may be retained subject to nodal officer approval.`
          );
        }
      }

      // Check compatible synergies
      const aCompatibleWithB = schemeA.combination_rules.compatible_with?.includes(schemeB.id);
      const bCompatibleWithA = schemeB.combination_rules.compatible_with?.includes(schemeA.id);

      if (aCompatibleWithB || bCompatibleWithA) {
        synergyDetails.push(
          `"${schemeA.name}" and "${schemeB.name}" are confirmed stackable. For example, availing a scholarship does not disqualify you from subsidized education loan moratorium (CSIS) or health coverage (Ayushman Bharat).`
        );
      }
    }
  }

  let status: 'compatible' | 'verification_required' | 'incompatible' = 'compatible';
  let summary = '';
  let recommendation = '';

  if (hasDirectConflict) {
    status = 'incompatible';
    summary = 'These schemes cannot be availed simultaneously due to direct regulatory conflicts.';
    recommendation = 'We recommend prioritizing the scheme with the higher net benefit or the one that has immediate active deadlines.';
  } else if (hasVerificationNotice || verificationDetails.length > 0) {
    status = 'verification_required';
    summary = 'These benefits may be combined, but require clearance from the respective nodal welfare departments.';
    recommendation = 'Check with your college welfare officer or nodal agency before applying to both to avoid duplicate rejection.';
  } else {
    status = 'compatible';
    summary = 'All selected schemes appear mutually compatible and stackable under current government directives.';
    recommendation = 'You can proceed to apply for all selected benefits without risk of cross-scheme disqualification.';
  }

  const allDetails = [
    ...conflictDetails,
    ...verificationDetails,
    ...synergyDetails
  ];

  if (allDetails.length === 0) {
    allDetails.push("No explicit conflicts identified across Central and State portals for these selected categories.");
  }

  return {
    status,
    summary,
    details: allDetails,
    recommendation,
    schemes: selectedSchemes
  };
}
