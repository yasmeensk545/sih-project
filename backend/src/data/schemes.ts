import { Scheme } from '../types.js';

export const MOCK_SCHEMES: Scheme[] = [
  {
    _id: "SCH001",
    id: "SCH001",
    name: "Post-Matric Scholarship Scheme for SC/ST/OBC Students",
    hindi_name: "पोस्ट-मैट्रिक छात्रवृत्ति योजना",
    category: "Scholarship",
    ministry: "Ministry of Social Justice and Empowerment",
    short_description: "Financial assistance to students from marginalized communities pursuing higher secondary, undergraduate, and postgraduate studies.",
    description: "The Post-Matric Scholarship is a flagship Centrally Sponsored Scheme aimed at providing financial support to students at post-matriculation or post-secondary stage to enable them to complete their education. Covers maintenance allowance, reimbursement of compulsory non-refundable fees, study tour charges, and thesis typing.",
    benefit: {
      min: 20000,
      max: 50000,
      type: "scholarship",
      display_text: "₹20,000 – ₹50,000 / year",
      frequency: "per_academic_year",
      currency: "INR"
    },
    eligibility: {
      age: { min: 17, max: 35 },
      income: { max: 250000 },
      states: ["All India"],
      education: [
        "Graduate (B.Tech / B.E)",
        "Graduate (B.Sc / B.Com / B.A)",
        "Post Graduate (M.Tech / M.Sc / M.A / MBA)",
        "Diploma",
        "12th Pass",
        "Doctorate / Ph.D"
      ],
      categories: ["SC", "ST", "OBC"],
      student_status: true,
      additional_criteria: [
        "Must be enrolled in a recognized institution",
        "Must have passed previous qualifying exam with min 50%"
      ]
    },
    documents: [
      { name: "Aadhaar Card", mandatory: true, purpose: "Identity & address proof", issuing_authority: "UIDAI" },
      { name: "Caste Certificate", mandatory: true, purpose: "Verification of social category", issuing_authority: "Tehsildar / Revenue Department" },
      { name: "Income Certificate (Current FY)", mandatory: true, purpose: "Proof of annual family income < ₹2.5L", issuing_authority: "Revenue Dept / Meeseva" },
      { name: "College Bonafide Certificate", mandatory: true, purpose: "Proof of active regular enrollment", issuing_authority: "College Principal / Registrar" },
      { name: "Fee Receipt & Previous Marksheet", mandatory: true, purpose: "Fee reimbursement calculation", issuing_authority: "Educational Institution" },
      { name: "Bank Passbook (Aadhaar linked)", mandatory: true, purpose: "Direct Benefit Transfer (DBT)", issuing_authority: "Bank" }
    ],
    application: {
      method: "online",
      portal_name: "National Scholarship Portal (NSP) / State ePASS",
      official_url: "https://scholarships.gov.in",
      steps: [
        "Register on the National Scholarship Portal (NSP) with Aadhaar",
        "Fill out student profile, course details, and bank account information",
        "Upload scanned copies of Caste, Income, and Bonafide certificates",
        "Submit online and download the acknowledgment receipt",
        "Submit hard copy with originals to your college verification desk"
      ],
      fees: "Zero (Free application)"
    },
    deadline: "31st October 2026",
    deadline_status: "active",
    source: {
      name: "National Scholarship Portal (NSP)",
      url: "https://scholarships.gov.in",
      last_verified: "15 August 2026",
      nodal_agency: "Department of Social Justice & Empowerment"
    },
    combination_rules: {
      stackable: false,
      incompatible_with: ["SCH002", "SCH011"],
      compatible_with: ["SCH007", "SCH010"],
      notes: "Cannot be combined with another government scholarship covering the same tuition fee. Can be combined with education loan interest subsidies."
    },
    tags: ["Higher Education", "College", "Tuition Fee", "DBT", "Marginalized Communities"],
    content: "Post-Matric Scholarship Scheme provides tuition fees and maintenance allowance up to ₹50,000 per academic year for eligible students with family income under ₹2.5 Lakhs per annum."
  },
  {
    _id: "SCH002",
    id: "SCH002",
    name: "Central Sector Scheme of Scholarships for College and University Students",
    hindi_name: "कॉलेज और विश्वविद्यालय के छात्रों के लिए केंद्रीय छात्रवृत्ति योजना",
    category: "Scholarship",
    ministry: "Ministry of Education (Department of Higher Education)",
    short_description: "Merit-cum-means scholarship for top percentile 12th pass students pursuing regular degree courses in colleges and universities.",
    description: "Aimed at supporting meritorious students from low-income families to meet day-to-day expenses while pursuing graduation and post-graduation. The scholarship is awarded to students in the top 20th percentile in the 12th board examinations.",
    benefit: {
      min: 12000,
      max: 20000,
      type: "scholarship",
      display_text: "₹12,000 – ₹20,000 / year",
      frequency: "per_academic_year",
      currency: "INR"
    },
    eligibility: {
      age: { min: 18, max: 26 },
      income: { max: 450000 },
      states: ["All India"],
      education: [
        "Graduate (B.Tech / B.E)",
        "Graduate (B.Sc / B.Com / B.A)",
        "Post Graduate (M.Tech / M.Sc / M.A / MBA)"
      ],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      student_status: true,
      additional_criteria: [
        "Above 80th percentile in Class 12 board examination",
        "Pursuing regular full-time degree (not correspondence/distance)"
      ]
    },
    documents: [
      { name: "Class 12 Marksheet with Percentile Rank", mandatory: true, purpose: "Merit verification", issuing_authority: "State/CBSE/ICSE Board" },
      { name: "Income Certificate (< ₹4.5 Lakhs)", mandatory: true, purpose: "Financial qualification", issuing_authority: "Competent Revenue Authority" },
      { name: "Aadhaar Card", mandatory: true, purpose: "Identity verification", issuing_authority: "UIDAI" },
      { name: "College Admission Slip & ID Card", mandatory: true, purpose: "Enrollment verification", issuing_authority: "College / University" }
    ],
    application: {
      method: "online",
      portal_name: "National Scholarship Portal",
      official_url: "https://scholarships.gov.in",
      steps: [
        "Check your board roll number on the state board merit cut-off list",
        "Apply online via NSP under Department of Higher Education",
        "Institute level physical verification by Nodal Officer",
        "State Nodal Officer verification and PFMS DBT disbursement"
      ]
    },
    deadline: "15th November 2026",
    deadline_status: "active",
    source: {
      name: "Department of Higher Education, GoI",
      url: "https://www.education.gov.in",
      last_verified: "10 August 2026",
      nodal_agency: "Ministry of Education"
    },
    combination_rules: {
      stackable: false,
      incompatible_with: ["SCH001"],
      compatible_with: ["SCH007", "SCH015"],
      notes: "Student cannot avail of any other Central or State Government scholarship simultaneously."
    },
    tags: ["Merit Scholarship", "Undergraduate", "Postgraduate", "B.Tech", "General Category Eligible"],
    content: "Central Sector Scheme provides ₹12,000 per year at graduation and ₹20,000 per year at post-graduation for meritorious students with family income under ₹4.5 Lakhs."
  },
  {
    _id: "SCH003",
    id: "SCH003",
    name: "Telangana TS ePASS Post-Matric Tuition Fee Reimbursement (RTF & MTF)",
    hindi_name: "तेलंगाना ई-पास शुल्क प्रतिपूर्ति योजना",
    category: "Education",
    ministry: "Government of Telangana (Welfare Departments)",
    short_description: "Full or partial tuition fee reimbursement and maintenance stipend for engineering, degree, and professional students of Telangana.",
    description: "TS ePASS (Electronic Payment and Application System of Scholarships) provides Reimbursement of Tuition Fee (RTF) directly to colleges and Maintenance Fee (MTF) to students enrolled in accredited higher education courses in Telangana.",
    benefit: {
      min: 35000,
      max: 120000,
      type: "subsidy",
      display_text: "₹35,000 – ₹1,20,000 (Full Tuition Reimbursement)",
      frequency: "per_academic_year",
      currency: "INR"
    },
    eligibility: {
      age: { min: 17, max: 30 },
      income: { max: 200000 },
      states: ["Telangana"],
      education: [
        "Graduate (B.Tech / B.E)",
        "Graduate (B.Sc / B.Com / B.A)",
        "Post Graduate (M.Tech / M.Sc / M.A / MBA)",
        "Diploma"
      ],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      student_status: true,
      additional_criteria: [
        "Domicile of Telangana state",
        "Must have secured seat through convenor quota (TS EAMCET / ECET / ICET / POLYCET)"
      ]
    },
    documents: [
      { name: "Telangana Domicile / Residence Certificate", mandatory: true, purpose: "State nativity proof", issuing_authority: "Tahsildar / MeeSeva" },
      { name: "Income Certificate issued after 1st April of current FY", mandatory: true, purpose: "Income verification", issuing_authority: "MeeSeva Telangana" },
      { name: "Caste Certificate (if applicable)", mandatory: true, purpose: "Welfare department routing", issuing_authority: "MeeSeva" },
      { name: "TS EAMCET / Entrance Allotment Order", mandatory: true, purpose: "Convenor quota confirmation", issuing_authority: "TSCHE" },
      { name: "Bank Account Passbook (Nationalized Bank in Telangana)", mandatory: true, purpose: "MTF stipend deposit", issuing_authority: "Bank" }
    ],
    application: {
      method: "online",
      portal_name: "TS ePASS Portal",
      official_url: "https://telanganaepass.cgg.gov.in",
      steps: [
        "Go to Telangana ePASS website and click on 'Post Matric Scholarship Services'",
        "Select 'Fresh Registration' or 'Renewal Registration'",
        "Enter SSC Hall Ticket Number, Year of Pass, and EAMCET Rank details",
        "Upload required scanned certificates",
        "Submit hard copy with biometric authentication at college welfare cell"
      ]
    },
    deadline: "30th November 2026",
    deadline_status: "active",
    source: {
      name: "Telangana Centre for Good Governance (CGG)",
      url: "https://telanganaepass.cgg.gov.in",
      last_verified: "20 August 2026",
      nodal_agency: "BC/SC/ST Welfare Departments, Govt of Telangana"
    },
    combination_rules: {
      stackable: true,
      incompatible_with: ["SCH001"],
      compatible_with: ["SCH007", "SCH014"],
      notes: "Covers college tuition fee directly. Cannot be claimed if receiving full tuition fee from Central NSP scheme."
    },
    tags: ["Telangana", "Engineering", "B.Tech", "EAMCET", "Fee Reimbursement", "ePASS"],
    content: "Telangana TS ePASS reimburses full convenor tuition fees up to ₹1,20,000 for B.Tech / Degree students of Telangana with annual family income up to ₹2 Lakhs (₹1.5L for rural)."
  },
  {
    _id: "SCH004",
    id: "SCH004",
    name: "Pradhan Mantri Mudra Yojana (PMMY) - Shishu & Kishore",
    hindi_name: "प्रधानमंत्री मुद्रा योजना",
    category: "Entrepreneurship",
    ministry: "Ministry of Finance",
    short_description: "Collateral-free institutional loans up to ₹10 Lakhs for setting up micro-enterprises, small businesses, or technology ventures.",
    description: "MUDRA provides collateral-free loans to non-corporate, non-farm small/micro enterprises. Three tiers: Shishu (loans up to ₹50,000), Kishore (loans ₹50,000 to ₹5 Lakhs), and Tarun (loans ₹5 Lakhs to ₹10 Lakhs). Highly accessible to youth, women, and tech graduates.",
    benefit: {
      min: 50000,
      max: 500000,
      type: "loan",
      display_text: "Collateral-free loan up to ₹5,00,000",
      frequency: "one_time",
      currency: "INR"
    },
    eligibility: {
      age: { min: 18, max: 60 },
      states: ["All India"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      employment_status: ["Self-Employed", "Unemployed", "Student"],
      additional_criteria: [
        "Indian citizen with viable business plan or existing micro-business",
        "Should not be a defaulter to any commercial bank or NBFC"
      ]
    },
    documents: [
      { name: "Business Plan / Project Report", mandatory: true, purpose: "Assessment of commercial viability", issuing_authority: "Self / Chartered Accountant" },
      { name: "Identity & Address Proof (Aadhaar / Voter ID)", mandatory: true, purpose: "KYC verification", issuing_authority: "UIDAI / ECI" },
      { name: "Bank Statement (Last 6 months)", mandatory: true, purpose: "Financial history", issuing_authority: "Bank" },
      { name: "Udyam Registration Certificate (if available)", mandatory: false, purpose: "MSME status", issuing_authority: "Ministry of MSME" }
    ],
    application: {
      method: "online",
      portal_name: "JanSamarth Portal / Udyami Mitra",
      official_url: "https://www.jansamarth.in",
      steps: [
        "Visit JanSamarth portal and select 'Business Activity Loan'",
        "Check eligibility by entering basic business details",
        "Review digital loan offers from 125+ partner banks and NBFCs",
        "Upload KYC and project proposal, receive in-principle sanction online"
      ],
      fees: "Nil for loans up to ₹50,000; minimal processing for higher brackets"
    },
    deadline: "Open throughout the year (Rolling)",
    deadline_status: "rolling",
    source: {
      name: "MUDRA - Micro Units Development & Refinance Agency",
      url: "https://www.mudra.org.in",
      last_verified: "12 August 2026",
      nodal_agency: "Department of Financial Services, Ministry of Finance"
    },
    combination_rules: {
      stackable: true,
      incompatible_with: [],
      compatible_with: ["SCH005", "SCH008", "SCH014"],
      notes: "Can be combined with Stand-Up India or PMEGP capital subsidy schemes."
    },
    tags: ["Startup", "Business Loan", "Collateral Free", "Youth", "Women Entrepreneurs"],
    content: "PMMY offers zero-collateral micro-loans up to ₹10 Lakhs across Shishu, Kishore, and Tarun categories with subsidized interest rates via the JanSamarth platform."
  },
  {
    _id: "SCH005",
    id: "SCH005",
    name: "Stand-Up India Scheme for Women and SC/ST Entrepreneurs",
    hindi_name: "स्टैंड-अप इंडिया योजना",
    category: "Women",
    ministry: "Ministry of Finance",
    short_description: "Bank loans between ₹10 Lakhs and ₹1 Crore for setting up greenfield enterprises in manufacturing, services, or trading sector.",
    description: "Facilitates bank loans between ₹10 Lakhs and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.",
    benefit: {
      min: 1000000,
      max: 10000000,
      type: "loan",
      display_text: "Bank loan ₹10,00,000 – ₹1,00,00,000",
      frequency: "one_time",
      currency: "INR"
    },
    eligibility: {
      age: { min: 18, max: 65 },
      gender: ["female"],
      states: ["All India"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      is_woman_entrepreneur: true,
      additional_criteria: [
        "Borrower must be a woman or SC/ST individual",
        "In case of non-individual enterprises, 51% shareholding must be held by SC/ST or woman entrepreneur",
        "Enterprise must be greenfield (first time venture)"
      ]
    },
    documents: [
      { name: "Detailed Project Report (DPR)", mandatory: true, purpose: "Technical and financial viability", issuing_authority: "MSME Consultant / CA" },
      { name: "PAN Card and Aadhaar Card", mandatory: true, purpose: "Identity and tax proof", issuing_authority: "Income Tax / UIDAI" },
      { name: "Company Incorporation / Partnership Deed", mandatory: true, purpose: "Ownership structure", issuing_authority: "Ministry of Corporate Affairs" },
      { name: "Caste Certificate (for SC/ST) or Woman Promoter KYC", mandatory: true, purpose: "Target group verification", issuing_authority: "Revenue Department" }
    ],
    application: {
      method: "online",
      portal_name: "Stand-Up India Portal",
      official_url: "https://www.standupmitra.in",
      steps: [
        "Register on the Stand-Up Mitra portal as Trainee or Ready Borrower",
        "Fill out application form and select preferred Scheduled Commercial Bank",
        "SIDBI Handholding agency assists in business plan refinement",
        "Bank issues sanction letter with credit guarantee coverage"
      ]
    },
    deadline: "Active Scheme (Renewed through 2027)",
    deadline_status: "rolling",
    source: {
      name: "SIDBI / Ministry of Finance",
      url: "https://www.standupmitra.in",
      last_verified: "05 August 2026",
      nodal_agency: "Small Industries Development Bank of India (SIDBI)"
    },
    combination_rules: {
      stackable: true,
      incompatible_with: [],
      compatible_with: ["SCH004", "SCH014"],
      notes: "Borrower can claim Central/State capital investment subsidy alongside the composite bank loan."
    },
    tags: ["Women Entrepreneur", "High Value Loan", "Greenfield Business", "Manufacturing", "Tech Startup"],
    content: "Stand-Up India facilitates loans from ₹10 Lakhs to ₹1 Crore with composite loan structure (term loan + working capital) and handholding support via SIDBI."
  },
  {
    _id: "SCH006",
    id: "SCH006",
    name: "PM Kisan Samman Nidhi (PM-KISAN)",
    hindi_name: "प्रधानमंत्री किसान सम्मान निधि",
    category: "Agriculture",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    short_description: "Direct income support of ₹6,000 per year in three equal 4-monthly installments of ₹2,000 directly into farmer bank accounts.",
    description: "An income support scheme for all landholding farmer families in the country to supplement their financial needs in procuring various inputs related to agriculture and allied activities as well as domestic needs.",
    benefit: {
      min: 6000,
      max: 6000,
      type: "direct_cash",
      display_text: "₹6,000 / year (₹2,000 every 4 months)",
      frequency: "annual",
      currency: "INR"
    },
    eligibility: {
      age: { min: 18, max: 99 },
      states: ["All India"],
      is_farmer: true,
      additional_criteria: [
        "Must be a landholder farmer family with cultivable landholding in revenue records",
        "Institutional landholders and income-tax payers are excluded"
      ]
    },
    documents: [
      { name: "Land Record (Pahani / RoR / 1-B / Khasra-Khatauni)", mandatory: true, purpose: "Cultivable land ownership proof", issuing_authority: "Revenue / Land Records Department" },
      { name: "Aadhaar Card with mobile linking", mandatory: true, purpose: "e-KYC verification", issuing_authority: "UIDAI" },
      { name: "NPCI Aadhaar-seeded Bank Account", mandatory: true, purpose: "Direct Benefit Transfer", issuing_authority: "Bank" }
    ],
    application: {
      method: "online",
      portal_name: "PM-KISAN Portal",
      official_url: "https://pmkisan.gov.in",
      steps: [
        "Visit PM-KISAN portal -> Farmers Corner -> New Farmer Registration",
        "Enter Aadhaar Number, select Rural/Urban Farmer, verify OTP",
        "Enter State, District, Sub-District, Block, and Land Survey / Khasra number",
        "Upload land deed document and submit for State Revenue Officer approval"
      ]
    },
    deadline: "Rolling (Continuous enrollment)",
    deadline_status: "rolling",
    source: {
      name: "PM-KISAN Official Portal",
      url: "https://pmkisan.gov.in",
      last_verified: "18 August 2026",
      nodal_agency: "Ministry of Agriculture and Farmers Welfare"
    },
    combination_rules: {
      stackable: true,
      incompatible_with: [],
      compatible_with: ["SCH007", "SCH009"],
      notes: "Can be combined with State farmer schemes like Rythu Bandhu / Kalia and PM Fasal Bima Yojana."
    },
    tags: ["Farmer", "Agriculture", "Direct Benefit Transfer", "Income Support", "Rural"],
    content: "PM-KISAN transfers ₹6,000 annually in 3 installments of ₹2,000 directly to Aadhaar-seeded bank accounts of verified landholding farmer families."
  },
  {
    _id: "SCH007",
    id: "SCH007",
    name: "Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY)",
    hindi_name: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
    category: "Healthcare",
    ministry: "Ministry of Health and Family Welfare (National Health Authority)",
    short_description: "Cashless health insurance coverage of up to ₹5 Lakhs per family per year for secondary and tertiary healthcare hospitalizations.",
    description: "The world's largest government-funded healthcare scheme. Provides a health cover of ₹5 Lakhs per family per year for secondary and tertiary care hospitalization across public and private empanelled hospitals in India. Completely cashless and paperless at point of delivery.",
    benefit: {
      min: 500000,
      max: 500000,
      type: "insurance",
      display_text: "₹5,00,000 / family / year (Cashless)",
      frequency: "annual",
      currency: "INR"
    },
    eligibility: {
      age: { min: 0, max: 99 },
      income: { max: 300000 },
      states: ["All India"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      bpl_required: false,
      additional_criteria: [
        "Identified as eligible under SECC 2011 database or state ration card / NFSA list",
        "Includes families with informal/unorganized labor, kutcha house, or low economic criteria",
        "Now extended to all senior citizens aged 70+ regardless of income"
      ]
    },
    documents: [
      { name: "Aadhaar Card / Ration Card", mandatory: true, purpose: "Family identification", issuing_authority: "UIDAI / Civil Supplies Dept" },
      { name: "PMJAY Ayushman Card / Golden Card", mandatory: true, purpose: "Hospital check-in pass", issuing_authority: "National Health Authority" }
    ],
    application: {
      method: "online",
      portal_name: "Beneficiary Portal (NHA)",
      official_url: "https://beneficiary.nha.gov.in",
      steps: [
        "Visit beneficiary.nha.gov.in and login using your mobile number and OTP",
        "Search by Aadhaar Number or Ration Card / Family ID",
        "Complete self e-KYC using Aadhaar OTP or facial recognition",
        "Download your official Ayushman PVC Card instantly"
      ]
    },
    deadline: "Continuous (No deadline)",
    deadline_status: "rolling",
    source: {
      name: "National Health Authority (NHA)",
      url: "https://pmjay.gov.in",
      last_verified: "22 August 2026",
      nodal_agency: "National Health Authority"
    },
    combination_rules: {
      stackable: true,
      incompatible_with: [],
      compatible_with: ["SCH001", "SCH002", "SCH003", "SCH006", "SCH008"],
      notes: "Universally stackable with any other education, employment, or housing benefit."
    },
    tags: ["Healthcare", "Health Insurance", "Hospitalization", "Cashless", "All India", "Ayushman Card"],
    content: "AB-PMJAY provides ₹5,00,000 cashless inpatient hospitalization coverage across 27,000+ empanelled hospitals for over 12 crore poor and vulnerable families."
  },
  {
    _id: "SCH008",
    id: "SCH008",
    name: "Pradhan Mantri Awas Yojana (PMAY-Urban 2.0)",
    hindi_name: "प्रधानमंत्री आवास योजना - शहरी 2.0",
    category: "Housing",
    ministry: "Ministry of Housing and Urban Affairs",
    short_description: "Interest subsidy up to ₹1.8 Lakhs on home loans and financial assistance for purchasing or constructing pucca houses in urban areas.",
    description: "PMAY-U 2.0 provides interest subsidy and central assistance for Economically Weaker Section (EWS), Low Income Group (LIG), and Middle Income Group (MIG) families residing in urban areas to construct or acquire pucca houses with basic amenities.",
    benefit: {
      min: 150000,
      max: 267000,
      type: "subsidy",
      display_text: "Interest Subsidy up to ₹2.67 Lakhs",
      frequency: "one_time",
      currency: "INR"
    },
    eligibility: {
      age: { min: 21, max: 70 },
      income: { max: 600000 },
      states: ["All India"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      additional_criteria: [
        "Beneficiary family should not own a pucca house in their name anywhere in India",
        "Female ownership or co-ownership is mandatory in property deed"
      ]
    },
    documents: [
      { name: "Aadhaar of all family members", mandatory: true, purpose: "De-duplication check", issuing_authority: "UIDAI" },
      { name: "Salary Slips / ITR / Income Certificate (< ₹6 Lakhs)", mandatory: true, purpose: "Income categorization (EWS/LIG)", issuing_authority: "Employer / Revenue Dept" },
      { name: "Bank Account Statement (6 months)", mandatory: true, purpose: "Housing loan processing", issuing_authority: "Bank" },
      { name: "Sale Deed / Construction Estimation Blueprint", mandatory: true, purpose: "Property verification", issuing_authority: "Sub-Registrar / Licensed Architect" }
    ],
    application: {
      method: "online",
      portal_name: "PMAY-Urban Portal",
      official_url: "https://pmaymis.gov.in",
      steps: [
        "Apply for home loan through primary lending institutions (SBI, HDFC, PNB, etc.) under CLSS",
        "Lending institution submits claim to National Housing Bank (NHB) / HUDCO",
        "Direct credit of interest subsidy upfront to loan account, reducing EMI"
      ]
    },
    deadline: "31st December 2028",
    deadline_status: "active",
    source: {
      name: "Ministry of Housing and Urban Affairs",
      url: "https://pmaymis.gov.in",
      last_verified: "14 August 2026",
      nodal_agency: "MoHUA / NHB"
    },
    combination_rules: {
      stackable: true,
      incompatible_with: [],
      compatible_with: ["SCH004", "SCH007"],
      notes: "Can be combined with state-level affordable housing subsidies."
    },
    tags: ["Housing", "Home Loan", "Interest Subsidy", "Urban", "EWS", "LIG"],
    content: "PMAY Urban 2.0 offers up to ₹2.67 Lakhs upfront credit-linked interest subsidy for first-time urban home buyers with family income under ₹6 Lakhs."
  },
  {
    _id: "SCH009",
    id: "SCH009",
    name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
    hindi_name: "प्रधानमंत्री कौशल विकास योजना 4.0",
    category: "Employment",
    ministry: "Ministry of Skill Development and Entrepreneurship (MSDE)",
    short_description: "Free industry-relevant skill training, Industry 4.0 tech courses, certification, and post-placement stipend support for youth.",
    description: "PMKVY 4.0 focuses on skilling Indian youth in new-age courses like Coding, AI, Robotics, Mechatronics, IoT, 3D Printing, Drones, as well as traditional trades. Course fees are 100% paid by the government, with monetary rewards and placement assistance.",
    benefit: {
      min: 8000,
      max: 15000,
      type: "direct_cash",
      display_text: "Free Training + ₹8,000 – ₹15,000 Stipend & Toolkit",
      frequency: "one_time",
      currency: "INR"
    },
    eligibility: {
      age: { min: 15, max: 45 },
      states: ["All India"],
      education: [
        "10th Pass",
        "12th Pass",
        "Diploma",
        "Graduate (B.Tech / B.E)",
        "Graduate (B.Sc / B.Com / B.A)",
        "Below 10th",
        "ITI / Vocational"
      ],
      employment_status: ["Unemployed", "Student", "Daily Wage / Informal"],
      additional_criteria: [
        "Indian national who has dropped out or seeks marketable technical skills",
        "Valid Aadhaar and bank account linked to DBT"
      ]
    },
    documents: [
      { name: "Aadhaar Card", mandatory: true, purpose: "Candidate authentication", issuing_authority: "UIDAI" },
      { name: "Educational Qualification Marksheet (10th/12th/Degree)", mandatory: true, purpose: "Course prerequisite check", issuing_authority: "School / College Board" },
      { name: "Bank Account Details", mandatory: true, purpose: "Assessment reward / travel allowance", issuing_authority: "Bank" }
    ],
    application: {
      method: "online",
      portal_name: "Skill India Digital Hub (SIDH)",
      official_url: "https://www.skillindiadigital.gov.in",
      steps: [
        "Register on Skill India Digital Hub portal with mobile OTP",
        "Explore training centers and Job Roles (e.g. Drone Pilot, Python Developer, Solar Tech)",
        "Enroll in a batch and attend physical/hybrid training at Pradhan Mantri Kaushal Kendra",
        "Pass Sector Skill Council (SSC) assessment to receive National Skill Certificate and placement"
      ]
    },
    deadline: "Ongoing (Quarterly batches)",
    deadline_status: "rolling",
    source: {
      name: "Skill India Digital (NSDC)",
      url: "https://www.skillindiadigital.gov.in",
      last_verified: "11 August 2026",
      nodal_agency: "National Skill Development Corporation (NSDC)"
    },
    combination_rules: {
      stackable: true,
      incompatible_with: [],
      compatible_with: ["SCH001", "SCH002", "SCH003", "SCH004"],
      notes: "Fully stackable with student scholarships and micro-business loan programs."
    },
    tags: ["Skill Development", "Free Course", "AI / Coding", "Placement", "Youth Employment"],
    content: "PMKVY 4.0 provides free industry-aligned technical skill training in AI, Drones, IoT, and high-demand trades with certification and placement assistance."
  },
  {
    _id: "SCH010",
    id: "SCH010",
    name: "Central Sector Interest Subsidy (CSIS) on Education Loans",
    hindi_name: "शिक्षा ऋण पर केंद्रीय ब्याज सब्सिडी योजना",
    category: "Education",
    ministry: "Ministry of Education",
    short_description: "Full interest subsidy during the moratorium period (course period plus 1 year) on education loans for students from EWS families.",
    description: "CSIS provides full interest subsidy during the period of moratorium on educational loans availed by students from Economically Weaker Sections (family income <= ₹4.5 Lakhs) for pursuing approved professional and technical degree courses in India.",
    benefit: {
      min: 40000,
      max: 180000,
      type: "subsidy",
      display_text: "Full Interest Waiver during study period (Save ₹40k - ₹1.8L)",
      frequency: "per_academic_year",
      currency: "INR"
    },
    eligibility: {
      age: { min: 17, max: 32 },
      income: { max: 450000 },
      states: ["All India"],
      education: [
        "Graduate (B.Tech / B.E)",
        "Graduate (B.Sc / B.Com / B.A)",
        "Post Graduate (M.Tech / M.Sc / M.A / MBA)",
        "Doctorate / Ph.D"
      ],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      student_status: true,
      additional_criteria: [
        "Pursuing recognized professional / technical courses in India",
        "Must have availed education loan under IBA model loan scheme from scheduled bank"
      ]
    },
    documents: [
      { name: "Income Certificate (< ₹4.5 Lakhs)", mandatory: true, purpose: "EWS verification for loan branch", issuing_authority: "Authorized Revenue Official" },
      { name: "Education Loan Sanction Letter", mandatory: true, purpose: "Loan account identification", issuing_authority: "Lending Bank" },
      { name: "College Admission Letter & Fee Structure", mandatory: true, purpose: "Course validation", issuing_authority: "University / Institute" }
    ],
    application: {
      method: "online",
      portal_name: "Vidya Lakshmi Portal",
      official_url: "https://www.vidyalakshmi.co.in",
      steps: [
        "Apply for education loan through Vidya Lakshmi portal",
        "Submit EWS income certificate to the branch manager during loan appraisal",
        "Bank tags the loan account under CSIS scheme in the Canara Bank nodal portal",
        "Government directly credits accumulated moratorium interest to the loan ledger"
      ]
    },
    deadline: "Aligned with Academic Year Admissions",
    deadline_status: "active",
    source: {
      name: "Ministry of Education & Vidya Lakshmi",
      url: "https://www.vidyalakshmi.co.in",
      last_verified: "08 August 2026",
      nodal_agency: "Department of Higher Education (Nodal: Canara Bank)"
    },
    combination_rules: {
      stackable: true,
      incompatible_with: [],
      compatible_with: ["SCH001", "SCH002", "SCH003"],
      notes: "Can be availed in conjunction with any state or national merit/welfare scholarship."
    },
    tags: ["Education Loan", "Interest Subsidy", "B.Tech", "Engineering", "Vidya Lakshmi", "EWS"],
    content: "CSIS covers 100% of the interest accrued on education loans during the entire course duration + 1 year moratorium for students whose parental income is below ₹4.5 Lakhs."
  },
  {
    _id: "SCH011",
    id: "SCH011",
    name: "AICTE Pragati Scholarship for Girl Students",
    hindi_name: "एआईसीटीई प्रगति छात्रवृत्ति (छात्राओं के लिए)",
    category: "Women",
    ministry: "All India Council for Technical Education (AICTE)",
    short_description: "₹50,000 per annum for girl students admitted to AICTE-approved Technical Degree (B.Tech) and Diploma programs.",
    description: "A scheme aiming at providing assistance for Advancement of Girls pursuing Technical Education. Maximum two girl children per family are eligible. Covers tuition, purchase of books, equipment, laptops, and competitive exam fees.",
    benefit: {
      min: 50000,
      max: 500000,
      type: "scholarship",
      display_text: "₹50,000 / year (Every year till degree completion)",
      frequency: "per_academic_year",
      currency: "INR"
    },
    eligibility: {
      age: { min: 17, max: 28 },
      gender: ["female"],
      income: { max: 800000 },
      states: ["All India"],
      education: [
        "Graduate (B.Tech / B.E)",
        "Diploma"
      ],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      student_status: true,
      additional_criteria: [
        "Admitted to 1st year of Degree/Diploma level course or 2nd year through lateral entry",
        "Institution must be AICTE approved"
      ]
    },
    documents: [
      { name: "Class 10th & 12th Marksheet", mandatory: true, purpose: "Academic qualification", issuing_authority: "State Board / CBSE / ICSE" },
      { name: "Family Income Certificate (<= ₹8 Lakhs)", mandatory: true, purpose: "Economic limit check", issuing_authority: "Tahsildar / Sub-Divisional Magistrate" },
      { name: "AICTE Institute Admission Allotment Letter", mandatory: true, purpose: "AICTE approval check", issuing_authority: "State Admissions Authority" },
      { name: "Bank Passbook seeded with Aadhaar", mandatory: true, purpose: "DBT payment", issuing_authority: "Bank" }
    ],
    application: {
      method: "online",
      portal_name: "National Scholarship Portal (AICTE Section)",
      official_url: "https://scholarships.gov.in",
      steps: [
        "Visit National Scholarship Portal and apply under AICTE Schemes -> Pragati Scheme",
        "Input Institute AICTE Permanent ID and admission details",
        "Upload family income proof and parent declaration",
        "College verifies application online -> AICTE disburses ₹50k directly to student account"
      ]
    },
    deadline: "31st December 2026",
    deadline_status: "active",
    source: {
      name: "AICTE Government of India",
      url: "https://www.aicte-india.org",
      last_verified: "19 August 2026",
      nodal_agency: "All India Council for Technical Education"
    },
    combination_rules: {
      stackable: false,
      incompatible_with: ["SCH001", "SCH002"],
      compatible_with: ["SCH010", "SCH007"],
      notes: "Cannot hold multiple central scholarship grants simultaneously."
    },
    tags: ["Girl Students", "Women in Tech", "B.Tech", "Engineering", "AICTE", "Scholarship"],
    content: "AICTE Pragati provides ₹50,000 annually for up to 4 years for women in AICTE-approved B.Tech programs with parental income below ₹8 Lakhs."
  },
  {
    _id: "SCH012",
    id: "SCH012",
    name: "National Apprenticeship Promotion Scheme (NAPS-2)",
    hindi_name: "राष्ट्रीय शिक्षुता प्रोत्साहन योजना",
    category: "Employment",
    ministry: "Ministry of Skill Development and Entrepreneurship",
    short_description: "Monthly stipend support (25% government co-funded up to ₹1,500/mo) for technical and engineering apprentices in leading companies.",
    description: "Promotes apprenticeship training by offering financial support to establishments undertaking apprenticeship programs and paying direct stipends to youth undergoing on-the-job industrial training.",
    benefit: {
      min: 9000,
      max: 20000,
      type: "direct_cash",
      display_text: "Monthly Stipend ₹9,000 – ₹20,000 / month",
      frequency: "monthly",
      currency: "INR"
    },
    eligibility: {
      age: { min: 18, max: 35 },
      states: ["All India"],
      education: [
        "Graduate (B.Tech / B.E)",
        "Graduate (B.Sc / B.Com / B.A)",
        "Diploma",
        "ITI / Vocational"
      ],
      employment_status: ["Unemployed", "Student"],
      additional_criteria: [
        "Completed Degree, Diploma, or ITI from recognized board/university",
        "Should not have completed prior statutory apprenticeship"
      ]
    },
    documents: [
      { name: "Graduation / Diploma Degree Certificate", mandatory: true, purpose: "Educational verification", issuing_authority: "University / State Board of Technical Education" },
      { name: "Aadhaar Card", mandatory: true, purpose: "Candidate identity", issuing_authority: "UIDAI" },
      { name: "Resume & Bank Account Details", mandatory: true, purpose: "Employer hiring & DBT stipend", issuing_authority: "Candidate / Bank" }
    ],
    application: {
      method: "online",
      portal_name: "Apprenticeship India Portal",
      official_url: "https://www.apprenticeshipindia.gov.in",
      steps: [
        "Register as Candidate on Apprenticeship India Portal",
        "Complete 100% profile with qualification and technical skills",
        "Search and apply to apprenticeship vacancies in corporate and public sector companies",
        "Sign digital apprenticeship contract and start training with direct stipend"
      ]
    },
    deadline: "Rolling (Continuous recruitment)",
    deadline_status: "rolling",
    source: {
      name: "National Skill Development Corporation (NSDC)",
      url: "https://www.apprenticeshipindia.gov.in",
      last_verified: "17 August 2026",
      nodal_agency: "MSDE / NSDC"
    },
    combination_rules: {
      stackable: true,
      incompatible_with: [],
      compatible_with: ["SCH007"],
      notes: "Apprenticeship contract allows full DBT stipend credit directly."
    },
    tags: ["Apprenticeship", "Engineering Graduates", "B.Tech", "Monthly Stipend", "Industry Training"],
    content: "NAPS-2 enables graduates and diploma holders to secure 1-year corporate apprenticeships with structured training and monthly stipends between ₹9,000 and ₹20,000."
  },
  {
    _id: "SCH013",
    id: "SCH013",
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    hindi_name: "प्रधानमंत्री रोजगार सृजन कार्यक्रम",
    category: "Entrepreneurship",
    ministry: "Ministry of Micro, Small and Medium Enterprises (MSME)",
    short_description: "Credit-linked capital subsidy (15% to 35%) for setting up new manufacturing (up to ₹50 Lakhs) and service projects (up to ₹20 Lakhs).",
    description: "A major credit-linked subsidy programme aimed at generating self-employment opportunities through establishment of micro-enterprises in non-farm sector by helping traditional artisans and unemployed youth.",
    benefit: {
      min: 100000,
      max: 1750000,
      type: "subsidy",
      display_text: "15% to 35% Capital Subsidy (Up to ₹17.5 Lakhs)",
      frequency: "one_time",
      currency: "INR"
    },
    eligibility: {
      age: { min: 18, max: 60 },
      states: ["All India"],
      education: [
        "10th Pass",
        "12th Pass",
        "Diploma",
        "Graduate (B.Tech / B.E)",
        "Graduate (B.Sc / B.Com / B.A)",
        "Post Graduate (M.Tech / M.Sc / M.A / MBA)"
      ],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      employment_status: ["Unemployed", "Self-Employed"],
      additional_criteria: [
        "Should be above 18 years of age",
        "For projects above ₹10 Lakhs in manufacturing and ₹5 Lakhs in service, minimum educational qualification is 8th pass"
      ]
    },
    documents: [
      { name: "Detailed Project Profile (DPR)", mandatory: true, purpose: "Bank appraisal", issuing_authority: "Certified MSME Consultant / CA" },
      { name: "Educational Qualification & EDP Training Certificate", mandatory: true, purpose: "Competency check", issuing_authority: "Institution / KVIC Portal" },
      { name: "Special Category / Rural Area Certificate (if claiming 35% subsidy)", mandatory: false, purpose: "Subsidy rate tiering", issuing_authority: "Tahsildar / Gram Panchayat" }
    ],
    application: {
      method: "online",
      portal_name: "KVIC PMEGP e-Portal",
      official_url: "https://www.kviconline.gov.in/pmegpeportal",
      steps: [
        "Submit online application on KVIC portal with Project Proposal",
        "Task Force Committee reviews and forwards to preferred bank",
        "Bank sanctions loan and disburses first tranche",
        "10-day online EDP training completed -> Subsidy kept in 3-year term deposit lock-in"
      ]
    },
    deadline: "Continuous Open Window",
    deadline_status: "rolling",
    source: {
      name: "Khadi and Village Industries Commission (KVIC)",
      url: "https://www.kviconline.gov.in",
      last_verified: "16 August 2026",
      nodal_agency: "KVIC / State MSME Departments"
    },
    combination_rules: {
      stackable: true,
      incompatible_with: ["SCH004"],
      compatible_with: ["SCH007"],
      notes: "Cannot claim duplicate capital subsidy under other central government programs."
    },
    tags: ["MSME", "Manufacturing", "Service Enterprise", "High Subsidy", "Self Employment"],
    content: "PMEGP provides up to 35% government margin money subsidy for new project investments up to ₹50 Lakhs for manufacturing and ₹20 Lakhs for services."
  },
  {
    _id: "SCH014",
    id: "SCH014",
    name: "Atal Innovation Mission (AIM) - Youth Innovation Fellowship & Grant",
    hindi_name: "अटल नवाचार मिशन - युवा नवाचार अनुदान",
    category: "Entrepreneurship",
    ministry: "NITI Aayog, Government of India",
    short_description: "Grant-in-aid of up to ₹10 Lakhs to ₹25 Lakhs for students and early-stage innovators solving societal challenges with hardware/software prototypes.",
    description: "Supports promising young student innovators and tech graduates in prototyping deep-tech, agri-tech, healthcare, and civic innovations through AIC (Atal Incubation Centres).",
    benefit: {
      min: 250000,
      max: 2500000,
      type: "subsidy",
      display_text: "Grant-in-aid ₹2.5L – ₹25L (Non-dilutive)",
      frequency: "one_time",
      currency: "INR"
    },
    eligibility: {
      age: { min: 18, max: 35 },
      states: ["All India"],
      education: [
        "Graduate (B.Tech / B.E)",
        "Post Graduate (M.Tech / M.Sc / M.A / MBA)",
        "Doctorate / Ph.D",
        "Diploma"
      ],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      student_status: true,
      additional_criteria: [
        "Working on innovative technology solution with proof-of-concept",
        "Willing to incubate at nearest Atal Incubation Centre"
      ]
    },
    documents: [
      { name: "Pitch Deck / Concept Note (Max 10 slides)", mandatory: true, purpose: "Technical evaluation", issuing_authority: "Applicant Team" },
      { name: "Recommendation Letter from College HOD / Incubator", mandatory: true, purpose: "Academic credentials", issuing_authority: "Engineering College / University" },
      { name: "Demo Video / Prototype Documentation", mandatory: true, purpose: "Proof of concept", issuing_authority: "Applicant" }
    ],
    application: {
      method: "online",
      portal_name: "AIM NITI Aayog Portal",
      official_url: "https://aim.gov.in",
      steps: [
        "Submit prototype proposal during active AIM Open Innovation challenges",
        "Screening by Technical Expert Committee",
        "Shortlisted teams pitch at partner Atal Incubation Centre",
        "Milestone-based non-dilutive grant release"
      ]
    },
    deadline: "15th October 2026",
    deadline_status: "active",
    source: {
      name: "NITI Aayog, Government of India",
      url: "https://aim.gov.in",
      last_verified: "15 August 2026",
      nodal_agency: "Atal Innovation Mission"
    },
    combination_rules: {
      stackable: true,
      incompatible_with: [],
      compatible_with: ["SCH003", "SCH004", "SCH010"],
      notes: "Non-dilutive innovation grant can be held alongside student fee reimbursements and scholarships."
    },
    tags: ["Innovation", "B.Tech", "Prototypes", "Grants", "NITI Aayog", "Hackathon"],
    content: "AIM NITI Aayog provides prototype grants from ₹2.5 Lakhs up to ₹25 Lakhs for students developing high-impact hardware or AI/software solutions."
  },
  {
    _id: "SCH015",
    id: "SCH015",
    name: "National Disability Fellowship & Divyangjan Scholarship",
    hindi_name: "राष्ट्रीय दिव्यांगजन छात्रवृत्ति योजना",
    category: "Social Welfare",
    ministry: "Department of Empowerment of Persons with Disabilities (DEPwD)",
    short_description: "Comprehensive scholarship covering tuition fees, book grants, and assistive computer/braille allowances for students with disabilities.",
    description: "Provides equal higher education opportunities to differently-abled students pursuing professional, technical, and general university degree courses.",
    benefit: {
      min: 30000,
      max: 75000,
      type: "scholarship",
      display_text: "₹30,000 – ₹75,000 / year + Assistive Device Allowance",
      frequency: "per_academic_year",
      currency: "INR"
    },
    eligibility: {
      age: { min: 16, max: 40 },
      states: ["All India"],
      has_disability: true,
      income: { max: 600000 },
      education: [
        "10th Pass",
        "12th Pass",
        "Diploma",
        "Graduate (B.Tech / B.E)",
        "Graduate (B.Sc / B.Com / B.A)",
        "Post Graduate (M.Tech / M.Sc / M.A / MBA)",
        "Doctorate / Ph.D"
      ],
      student_status: true,
      additional_criteria: [
        "Benchmark disability of 40% or more confirmed by UDID card",
        "Enrolled in recognized educational institution"
      ]
    },
    documents: [
      { name: "UDID Card (Unique Disability ID) / Disability Certificate", mandatory: true, purpose: "Disability percentage verification (>=40%)", issuing_authority: "Department of Health / DEPwD" },
      { name: "Income Certificate (< ₹6 Lakhs)", mandatory: true, purpose: "Income criteria", issuing_authority: "Revenue Authority" },
      { name: "Aadhaar Card", mandatory: true, purpose: "Identity", issuing_authority: "UIDAI" },
      { name: "College Bonafide & Fee Structure", mandatory: true, purpose: "Tuition disbursement", issuing_authority: "College" }
    ],
    application: {
      method: "online",
      portal_name: "National Scholarship Portal",
      official_url: "https://scholarships.gov.in",
      steps: [
        "Register on NSP and enter UDID number",
        "Select DEPwD Post-Matric / Top Class Education Scheme",
        "Upload certificates and submit for institutional scrutiny",
        "Direct DBT grant transfer into disability-registered bank account"
      ]
    },
    deadline: "15th November 2026",
    deadline_status: "active",
    source: {
      name: "DEPwD Ministry of Social Justice",
      url: "https://disabilityaffairs.gov.in",
      last_verified: "10 August 2026",
      nodal_agency: "Department of Empowerment of Persons with Disabilities"
    },
    combination_rules: {
      stackable: false,
      incompatible_with: ["SCH001", "SCH002"],
      compatible_with: ["SCH007", "SCH010"],
      notes: "Includes specialized allowances for screen readers and escort services."
    },
    tags: ["Divyangjan", "Disability", "UDID", "Higher Education", "Assistive Allowance"],
    content: "DEPwD scholarship provides up to ₹75,000 per academic year plus assistive device grants for students with >= 40% benchmark disability."
  }
];
