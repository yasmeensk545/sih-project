import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserAccount, 
  Scheme, 
  EligibilityResult, 
  UserApplication, 
  SavedScheme,
  CopilotMessage 
} from '../types';
import { MOCK_SCHEMES } from '../data/schemes';
import { rankSchemesForProfile } from '../services/eligibilityEngine';

export const DEMO_PROFILE: UserProfile = {
  age: 24,
  gender: 'female',
  state: 'Telangana',
  district: 'Hyderabad',
  annual_income: 350000,
  income_source: 'Family Business & Part-time',
  education: 'Graduate (B.Tech / B.E)',
  occupation: 'Engineering Student / Tech Aspirant',
  student_status: true,
  employment_status: 'Student',
  category: 'General',
  is_farmer: false,
  has_disability: false,
  is_woman_entrepreneur: false,
  is_minority: false,
  bpl_card_holder: false
};

export const DEMO_USER: UserAccount = {
  id: 'usr_demo_123',
  name: 'Priya Sharma',
  email: 'demo@example.com',
  profile: DEMO_PROFILE,
  is_demo: true
};

const INITIAL_APPLICATIONS: UserApplication[] = [
  {
    _id: 'app_001',
    user_id: 'usr_demo_123',
    scheme_id: 'SCH003',
    scheme_name: 'Telangana TS ePASS Post-Matric Tuition Fee Reimbursement (RTF & MTF)',
    category: 'Education',
    status: 'under_review',
    application_number: 'TS-EPASS-2026-883921',
    applied_date: '12 Aug 2026',
    documents_uploaded: ['Aadhaar Card', 'Income Certificate', 'TS EAMCET Rank Card', 'College Bonafide'],
    notes: 'Submitted at college welfare desk. Pending state nodal scrutiny.',
    timeline: [
      { date: '12 Aug 2026', status: 'Submitted', description: 'Application submitted online on TS ePASS portal' },
      { date: '18 Aug 2026', status: 'Institute Verified', description: 'Principal & College Welfare Officer approved documents' },
      { date: '25 Aug 2026', status: 'Under Review', description: 'Forwarded to District Welfare Officer (DWO)' }
    ],
    created_at: '2026-08-12T10:00:00Z',
    updated_at: '2026-08-25T14:30:00Z'
  },
  {
    _id: 'app_002',
    user_id: 'usr_demo_123',
    scheme_id: 'SCH007',
    scheme_name: 'Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY)',
    category: 'Healthcare',
    status: 'approved',
    application_number: 'ABHA-PMJAY-994821',
    applied_date: '02 Jul 2026',
    documents_uploaded: ['Aadhaar Card', 'Ration Card'],
    notes: 'PVC Ayushman Golden card generated and downloaded.',
    timeline: [
      { date: '02 Jul 2026', status: 'Submitted', description: 'Self e-KYC completed on NHA beneficiary portal' },
      { date: '02 Jul 2026', status: 'Approved', description: 'Aadhaar biometric verified. Golden Card active.' }
    ],
    created_at: '2026-07-02T08:00:00Z',
    updated_at: '2026-07-02T08:15:00Z'
  },
  {
    _id: 'app_003',
    user_id: 'usr_demo_123',
    scheme_id: 'SCH010',
    scheme_name: 'Central Sector Interest Subsidy (CSIS) on Education Loans',
    category: 'Education',
    status: 'draft',
    application_number: 'VL-CSIS-DRAFT-441',
    applied_date: '24 Aug 2026',
    documents_uploaded: ['EWS Income Certificate', 'Admission Letter'],
    notes: 'Need to get final sanction letter from SBI Bank manager.',
    timeline: [
      { date: '24 Aug 2026', status: 'Draft', description: 'Application initiated on Vidya Lakshmi portal' }
    ],
    created_at: '2026-08-24T16:00:00Z',
    updated_at: '2026-08-24T16:00:00Z'
  }
];

interface AppContextType {
  user: UserAccount | null;
  profile: UserProfile;
  isLoggedIn: boolean;
  schemes: Scheme[];
  eligibilityResults: EligibilityResult[];
  savedSchemeIds: string[];
  applications: UserApplication[];
  selectedSchemeForModal: Scheme | null;
  selectedEligibilityResult: EligibilityResult | null;
  copilotMessages: CopilotMessage[];
  isCopilotLoading: boolean;
  currentPage: string;
  login: (email?: string, password?: string) => boolean;
  register: (name: string, email: string, password?: string) => boolean;
  logout: () => void;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  runEligibilityCheck: (overrideProfile?: UserProfile) => EligibilityResult[];
  toggleSaveScheme: (schemeId: string) => void;
  isSchemeSaved: (schemeId: string) => boolean;
  openWhyEligibleModal: (scheme: Scheme) => void;
  closeWhyEligibleModal: () => void;
  createOrUpdateApplication: (appData: Partial<UserApplication>) => void;
  sendCopilotMessage: (text: string) => Promise<void>;
  clearCopilotChat: () => void;
  navigateTo: (page: string, params?: any) => void;
  activeSchemeId: string | null;
  quickDemoLogin: () => void;
  loadDemoProfile: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    const savedUser = localStorage.getItem('bb_user');
    return savedUser ? JSON.parse(savedUser) : DEMO_USER;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('bb_profile');
    return savedProfile ? JSON.parse(savedProfile) : DEMO_PROFILE;
  });

  const [schemes] = useState<Scheme[]>(MOCK_SCHEMES);
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('bb_saved_schemes');
    return saved ? JSON.parse(saved) : ['SCH003', 'SCH002', 'SCH007'];
  });

  const [applications, setApplications] = useState<UserApplication[]>(() => {
    const saved = localStorage.getItem('bb_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [eligibilityResults, setEligibilityResults] = useState<EligibilityResult[]>([]);
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState<Scheme | null>(null);
  const [selectedEligibilityResult, setSelectedEligibilityResult] = useState<EligibilityResult | null>(null);
  
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [activeSchemeId, setActiveSchemeId] = useState<string | null>(null);

  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: "Namaste! I am your **Bharat Benefits Copilot**. I can help you discover verified government schemes, explain required documents, check if benefits can be combined, or analyze application rejections grounded in official ministry directives.\n\nHow can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggested_followups: [
        "What scholarships can a B.Tech student apply for?",
        "What documents do I need for Telangana TS ePASS?",
        "Can I combine PM Kisan with other schemes?",
        "Why was my scholarship rejected for income criteria?"
      ]
    }
  ]);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('bb_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bb_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bb_profile', JSON.stringify(profile));
    // Automatically calculate eligibility results on profile change
    const results = rankSchemesForProfile(schemes, profile);
    setEligibilityResults(results);
  }, [profile, schemes]);

  useEffect(() => {
    localStorage.setItem('bb_saved_schemes', JSON.stringify(savedSchemeIds));
  }, [savedSchemeIds]);

  useEffect(() => {
    localStorage.setItem('bb_applications', JSON.stringify(applications));
  }, [applications]);

  const login = (email?: string, password?: string): boolean => {
    const activeUser: UserAccount = {
      id: 'usr_custom_1',
      name: email?.split('@')[0] || 'Demo Citizen',
      email: email || 'demo@example.com',
      profile: profile,
      is_demo: email === 'demo@example.com'
    };
    setUser(activeUser);
    return true;
  };

  const quickDemoLogin = () => {
    setUser(DEMO_USER);
    setProfile(DEMO_PROFILE);
    setCurrentPage('dashboard');
  };

  const loadDemoProfile = () => {
    setProfile(DEMO_PROFILE);
  };

  const register = (name: string, email: string, password?: string): boolean => {
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: name || 'Indian Citizen',
      email: email || 'citizen@example.com',
      profile: profile,
      is_demo: false
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...newProfile };
      if (user) {
        setUser({ ...user, profile: updated });
      }
      return updated;
    });
  };

  const runEligibilityCheck = (overrideProfile?: UserProfile): EligibilityResult[] => {
    const prof = overrideProfile || profile;
    const results = rankSchemesForProfile(schemes, prof);
    setEligibilityResults(results);
    return results;
  };

  const toggleSaveScheme = (schemeId: string) => {
    setSavedSchemeIds(prev => 
      prev.includes(schemeId) ? prev.filter(id => id !== schemeId) : [...prev, schemeId]
    );
  };

  const isSchemeSaved = (schemeId: string) => savedSchemeIds.includes(schemeId);

  const openWhyEligibleModal = (scheme: Scheme) => {
    setSelectedSchemeForModal(scheme);
    const result = eligibilityResults.find(r => r.scheme_id === scheme.id) || 
                   rankSchemesForProfile([scheme], profile)[0];
    setSelectedEligibilityResult(result);
  };

  const closeWhyEligibleModal = () => {
    setSelectedSchemeForModal(null);
    setSelectedEligibilityResult(null);
  };

  const createOrUpdateApplication = (appData: Partial<UserApplication>) => {
    if (!appData.scheme_id) return;
    
    setApplications(prev => {
      const existingIndex = prev.findIndex(a => a.scheme_id === appData.scheme_id);
      const targetScheme = schemes.find(s => s.id === appData.scheme_id);
      const schemeName = targetScheme?.name || appData.scheme_name || 'Government Scheme';
      const category = targetScheme?.category || appData.category || 'Social Welfare';

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...appData,
          updated_at: new Date().toISOString()
        };
        return updated;
      } else {
        const newApp: UserApplication = {
          _id: `app_${Date.now()}`,
          user_id: user?.id || 'guest_user',
          scheme_id: appData.scheme_id,
          scheme_name: schemeName,
          category: category,
          status: appData.status || 'draft',
          application_number: appData.application_number || `BB-${Date.now().toString().slice(-6)}`,
          applied_date: appData.applied_date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          documents_uploaded: appData.documents_uploaded || ['Aadhaar Card'],
          notes: appData.notes || 'Application initiated via Bharat Benefits Navigator',
          timeline: [
            {
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              status: appData.status ? appData.status.toUpperCase() : 'DRAFT',
              description: 'Application record created'
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return [newApp, ...prev];
      }
    });
  };

  const sendCopilotMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: CopilotMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCopilotMessages(prev => [...prev, userMsg]);
    setIsCopilotLoading(true);

    try {
      // Call server RAG API endpoint
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text.trim(),
          profile: profile,
          conversation_history: copilotMessages.slice(-4)
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: CopilotMessage = {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: data.answer || "Based on government portal guidelines, here are the verified details.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: data.sources || [],
          suggested_followups: data.suggested_followups || [
            "What is the official application portal?",
            "Can I combine this with other schemes?"
          ]
        };
        setCopilotMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('API server returned error');
      }
    } catch (err) {
      // Local fallback RAG engine if offline or server endpoint in dev
      const lower = text.toLowerCase();
      let matchedScheme = schemes.find(s => 
        lower.includes(s.name.toLowerCase()) || 
        lower.includes(s.category.toLowerCase()) ||
        (s.id === 'SCH003' && (lower.includes('telangana') || lower.includes('epass'))) ||
        (s.id === 'SCH006' && lower.includes('kisan')) ||
        (s.id === 'SCH007' && (lower.includes('ayushman') || lower.includes('health'))) ||
        (s.id === 'SCH001' && (lower.includes('scholarship') || lower.includes('post-matric')))
      );

      if (!matchedScheme) {
        matchedScheme = schemes[0];
      }

      let fallbackAnswer = "";
      let sources = [
        {
          title: matchedScheme.source.name,
          url: matchedScheme.source.url,
          department: matchedScheme.ministry,
          scheme_id: matchedScheme.id
        }
      ];

      if (lower.includes("document") || lower.includes("need")) {
        const docsList = matchedScheme.documents.map(d => `• **${d.name}** (${d.mandatory ? 'Mandatory' : 'Optional'}) – *${d.purpose}* [Issuing: ${d.issuing_authority || 'Govt'}]`).join('\n');
        fallbackAnswer = `For **${matchedScheme.name}**, the required documents according to official guidelines are:\n\n${docsList}\n\n**Application Portal:** [${matchedScheme.application.portal_name}](${matchedScheme.application.official_url})\n*Note: Final verification is conducted by the ${matchedScheme.source.nodal_agency}.*`;
      } else if (lower.includes("combine") || lower.includes("stack")) {
        fallbackAnswer = `**Benefit Combination Rules for ${matchedScheme.name}:**\n\n• **Stackability:** ${matchedScheme.combination_rules.stackable ? 'Yes, stackable with compatible welfare schemes.' : 'Single-scholarship restriction applies.'}\n• **Guidance:** ${matchedScheme.combination_rules.notes}\n\n*Important: Always declare all active government benefits during submission to avoid duplicate rejection.*`;
      } else if (lower.includes("b.tech") || lower.includes("scholarship") || lower.includes("student")) {
        const studentSchemes = schemes.filter(s => s.category === 'Scholarship' || s.category === 'Education' || s.tags.includes('B.Tech'));
        const list = studentSchemes.map(s => `• **${s.name}** (Benefit: ${s.benefit.display_text}) - *Deadline: ${s.deadline}*`).join('\n');
        fallbackAnswer = `Based on your profile (${profile.education}, State: ${profile.state}, Income: ₹${profile.annual_income.toLocaleString('en-IN')}), here are the top matching education schemes:\n\n${list}\n\nYou can click on any scheme in **Explore Schemes** to view full application checklists.`;
      } else {
        fallbackAnswer = `Regarding your query about government benefits in India:\n\nFor **${matchedScheme.name}** (${matchedScheme.ministry}), eligible beneficiaries can receive **${matchedScheme.benefit.display_text}**.\n\n**Official Portal:** [${matchedScheme.application.portal_name}](${matchedScheme.application.official_url})\n**Current Status:** ${matchedScheme.deadline}\n\n*Disclaimer: Information should always be verified on the official government source before applying.*`;
      }

      const assistantMsg: CopilotMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: fallbackAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: sources,
        suggested_followups: [
          "What is the official application portal?",
          "Can I combine this benefit with other schemes?",
          "Check my eligibility score"
        ]
      };
      setCopilotMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const clearCopilotChat = () => {
    setCopilotMessages([
      {
        id: 'msg_reset',
        role: 'assistant',
        content: "Conversation cleared. How can I help you explore government schemes and benefits today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_followups: [
          "What scholarships can a B.Tech student apply for?",
          "What documents do I need for Telangana TS ePASS?",
          "Can I combine PM Kisan with other schemes?"
        ]
      }
    ]);
  };

  const navigateTo = (page: string, params?: any) => {
    if (page.startsWith('scheme_details:')) {
      const schemeId = page.split(':')[1];
      setActiveSchemeId(schemeId);
      setCurrentPage('scheme_details');
    } else if (page === 'scheme_details' && params?.id) {
      setActiveSchemeId(params.id);
      setCurrentPage('scheme_details');
    } else {
      setCurrentPage(page);
      if (page !== 'scheme_details') {
        setActiveSchemeId(null);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider value={{
      user,
      profile,
      isLoggedIn: !!user,
      schemes,
      eligibilityResults,
      savedSchemeIds,
      applications,
      selectedSchemeForModal,
      selectedEligibilityResult,
      copilotMessages,
      isCopilotLoading,
      currentPage,
      activeSchemeId,
      login,
      register,
      logout,
      updateProfile,
      runEligibilityCheck,
      toggleSaveScheme,
      isSchemeSaved,
      openWhyEligibleModal,
      closeWhyEligibleModal,
      createOrUpdateApplication,
      sendCopilotMessage,
      clearCopilotChat,
      navigateTo,
      quickDemoLogin,
      loadDemoProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
