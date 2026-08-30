import { Scheme, RejectionAnalysisResult } from '../types.js';
import { MOCK_SCHEMES } from '../data/schemes.js';

/**
 * Rejection Explainer Engine
 * Extracts key error codes, compares with scheme conditions, and suggests actionable appeal steps and alternative schemes.
 */
export function analyzeRejectionText(rejectionText: string): RejectionAnalysisResult {
  const lower = rejectionText.toLowerCase();

  let probable_reason = "Application rejected during institutional/state verification.";
  let rule_violated = "Verification criteria requirement not satisfied in submitted documentation.";
  let detected_scheme_name: string | undefined = undefined;
  let actionable_steps: string[] = [
    "Verify the authenticity and validity dates of all uploaded certificates.",
    "Contact your institutional nodal officer or state helpdesk.",
    "Check if an online grievance / appeal window is open on the respective portal."
  ];
  let appeal_guidance = "Most government schemes allow a 15-day grievance rectification window upon initial rejection notice.";
  let alternative_schemes: Scheme[] = [];

  // Detect Scheme context
  if (lower.includes("epass") || lower.includes("telangana") || lower.includes("rtf") || lower.includes("mtf")) {
    detected_scheme_name = "Telangana TS ePASS Fee Reimbursement";
    alternative_schemes = MOCK_SCHEMES.filter((s: Scheme) => s.id === 'SCH002' || s.id === 'SCH010' || s.id === 'SCH009');
  } else if (lower.includes("nsp") || lower.includes("national scholarship") || lower.includes("post-matric")) {
    detected_scheme_name = "National Post-Matric Scholarship Scheme";
    alternative_schemes = MOCK_SCHEMES.filter((s: Scheme) => s.id === 'SCH002' || s.id === 'SCH010' || s.id === 'SCH014');
  } else if (lower.includes("pmkisan") || lower.includes("kisan") || lower.includes("land")) {
    detected_scheme_name = "PM Kisan Samman Nidhi";
    alternative_schemes = MOCK_SCHEMES.filter((s: Scheme) => s.id === 'SCH004' || s.id === 'SCH007');
  } else if (lower.includes("mudra") || lower.includes("loan") || lower.includes("cibil")) {
    detected_scheme_name = "Pradhan Mantri MUDRA Yojana";
    alternative_schemes = MOCK_SCHEMES.filter((s: Scheme) => s.id === 'SCH013' || s.id === 'SCH014');
  }

  // Detect Reason & Violated Rules
  if (lower.includes("income") || lower.includes("salary") || lower.includes("creamy layer") || lower.includes("ceiling")) {
    probable_reason = "Income threshold exceeded or outdated Income Certificate provided.";
    rule_violated = "Annual household income exceeded the ceiling limit specified in scheme guidelines, or the MeeSeva income certificate was issued before April 1st of current financial year.";
    actionable_steps = [
      "Ensure your Income Certificate is issued in the CURRENT financial year (post April 1st).",
      "If you belong to EWS/OBC, ensure non-creamy layer verification is officially endorsed.",
      "Explore merit-based scholarships (e.g. Central Sector Scheme) which have higher income ceilings up to ₹4.5 Lakhs.",
      "Consider Central Sector Interest Subsidy (CSIS) on education loans if tuition funds are needed."
    ];
    appeal_guidance = "Obtain an updated digitally signed Income Certificate from MeeSeva / Tahsildar office and upload it during the re-verification / grievance redressal period.";
    if (alternative_schemes.length === 0) {
      alternative_schemes = MOCK_SCHEMES.filter((s: Scheme) => s.id === 'SCH002' || s.id === 'SCH010' || s.id === 'SCH014');
    }
  } else if (lower.includes("aadhaar") || lower.includes("npci") || lower.includes("dbt") || lower.includes("seeding") || lower.includes("bank")) {
    probable_reason = "Aadhaar - Bank Account DBT (Direct Benefit Transfer) link failure.";
    rule_violated = "Bank account is either inactive, not seeded with NPCI mapper, or name on Aadhaar does not match bank records exactly.";
    actionable_steps = [
      "Visit your home bank branch and submit the 'NPCI Aadhaar Seeding / Mandate Form'.",
      "Check your DBT linking status on UIDAI portal (resident.uidai.gov.in) under 'Check Aadhaar/Bank Account Linking'.",
      "Ensure your savings account is active and free of KYC / minimum balance freezes.",
      "Re-enter the correct active bank account details on the portal's edit profile tab."
    ];
    appeal_guidance = "Once bank updates the NPCI mapper (usually 48-72 hours), the portal can re-trigger the DBT transfer without needing a new application.";
  } else if (lower.includes("caste") || lower.includes("category") || lower.includes("certificate mismatch")) {
    probable_reason = "Social category certificate validation mismatch.";
    rule_violated = "The Caste Certificate number entered in the portal could not be validated against the State Revenue database or had name spelling discrepancy.";
    actionable_steps = [
      "Verify that your name spelling on the Caste Certificate matches your Aadhaar and 10th Class Hall Ticket exactly.",
      "Check that the certificate was issued by an authorized revenue official (Tahsildar/MRO).",
      "Re-upload a clear high-resolution scanned PDF copy showing the official QR code and digital signature."
    ];
    appeal_guidance = "File an online correction grievance on the state ePASS or NSP grievance desk with a sworn affidavit if name spelling differs.";
  } else if (lower.includes("attendance") || lower.includes("bonafide") || lower.includes("college") || lower.includes("institution")) {
    probable_reason = "Institutional level verification failed or student attendance criteria (<75%) not met.";
    rule_violated = "College nodal officer flagged attendance below minimum regulatory quota (typically 75%) or course registration was not recognized under convenor quota.";
    actionable_steps = [
      "Meet your College Scholarship Nodal Officer / Principal immediately.",
      "Request a fresh Bonafide Certificate and attendance summary sheet.",
      "Ask the college nodal officer to resubmit your application during the Institute Edit phase."
    ];
  } else if (lower.includes("duplicate") || lower.includes("already availed") || lower.includes("multiple")) {
    probable_reason = "Duplicate scholarship application detected across Central or State portals.";
    rule_violated = "Beneficiary was detected claiming multiple concurrent tuition fee scholarships, which is restricted under national DBT guidelines.";
    actionable_steps = [
      "Surrender or cancel the lower-value scholarship if both are processed concurrently.",
      "Provide formal declaration indicating your preferred primary scholarship scheme.",
      "Retain non-conflicting benefits such as health insurance or education loan interest subsidies."
    ];
  }

  if (alternative_schemes.length === 0) {
    alternative_schemes = MOCK_SCHEMES.slice(0, 3) as Scheme[];
  }

  return {
    rejection_text: rejectionText,
    detected_scheme: detected_scheme_name,
    probable_reason,
    rule_violated,
    actionable_steps,
    alternative_schemes,
    appeal_guidance
  };
}
