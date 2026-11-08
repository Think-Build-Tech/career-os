// apps/mobile/src/types/student.types.ts

export type StudentNavTab = 'home' | 'jobs' | 'apps' | 'tacie' | 'profile';

export type JobTier = 'TIER_1_SUPER_DREAM' | 'TIER_2_DREAM' | 'TIER_3_MASS';

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  degree: string;
  department: string;
  batchYear: number;
  enrollmentNumber: string;
  prnNumber: string;
  collegeCode: string;
  collegeName: string;
  cgpa: number;
  sgpaHistory: number[];
  activeBacklogs: number;
  totalBacklogs: number;
  tenthPercentage: number;
  twelfthPercentage: number;
  placementStatus: 'SEEKING' | 'PLACED' | 'OPTED_OUT';
  profileCompletion: number;
  verifiedByTpo: boolean;
  verifiedBy?: string;
  targetRole: string;
  targetCtc: number;
  resumeName?: string;
  resumeAtsScore?: number;
  privacyPreferences?: {
    recruiterDiscovery: boolean;
    alumniConnection: boolean;
  };
}

export interface StudentActionItem {
  id: string;
  title: string;
  subtitle?: string;
  actionType: 'OFFER_DECISION' | 'INTERVIEW_CONFIRM' | 'ASSESSMENT_SLOT' | 'DOCUMENT_UPLOAD' | string;
  deadline: string;
  completedAt?: string | null;
  referenceId?: string;
}

export interface PlacementCompliance {
  studentId: string;
  activeStrikes: number;
  maxAllowedStrikes: number;
  isDebarred: boolean;
  policyStanding: string;
  attendanceRate: number;
}

export interface SkillGapMetric {
  label: string;
  scorePercentage: number;
  tone: 'good' | 'warn' | 'bad' | 'default';
}

export interface SkillGapAnalysis {
  targetRole: string;
  overallReadiness: number;
  cohortPercentile: string;
  benchmarkSummary: string;
  breakdown: SkillGapMetric[];
  highestRoiAction?: {
    title: string;
    subtitle: string;
  };
}

export interface AcademicEvent {
  id: string;
  title: string;
  eventType: 'EXAM' | 'INTERVIEW' | 'ASSESSMENT' | 'DRIVE_DEADLINE';
  startsAt: string;
  endsAt: string;
  subtitle?: string;
  hasConflict?: boolean;
}

export interface JobOpportunity {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  jobCode?: string;
  tier: JobTier;
  tierLabel: string;
  jobType: 'FULL_TIME' | 'INTERNSHIP';
  workMode: 'Hybrid' | 'Onsite' | 'Remote';
  location: string;
  baseSalary: number;
  totalCtc: number;
  ctcLabel: string;
  matchScore: number;
  eligibilityStatus: 'ELIGIBLE' | 'POLICY_BLOCKED' | 'NOT_ELIGIBLE';
  eligibilityNote: string;
  applicationStatus?: 'NOT_APPLIED' | 'APPLIED' | 'SHORTLISTED' | 'REJECTED';
  closesInDays: number;
  skills: string[];
  description: string;
  rounds: {
    roundNumber: number;
    title: string;
    description: string;
    id?: string;
    name?: string;
  }[];
  isEligible?: boolean;
  eligibilityCriteria?: {
    minCgpa: number;
    maxBacklogs: number;
  };
}

export interface ApplicationRound {
  title: string;
  dateLabel: string;
  status: 'COMPLETED' | 'CURRENT' | 'UPCOMING' | 'FAILED' | 'IN_PROGRESS';
  description: string;
  id?: string;
  name?: string;
}

export interface StudentApplication {
  id: string;
  opportunityId: string;
  companyName: string;
  roleTitle: string;
  tierLabel: string;
  ctcLabel: string;
  appliedDate: string;
  currentStep: number;
  totalSteps: number;
  currentStageLabel: string;
  stageTone: 'good' | 'warn' | 'bad' | 'default';
  lockedResumeTitle: string;
  rounds: ApplicationRound[];
  status?: string;
  jobTitle?: string;
  appliedAt?: string;
  nextStepSchedule?: string;
  resumeVersionName?: string;
}

export interface PlacementOffer {
  id: string;
  offerCode: string;
  companyName: string;
  roleTitle: string;
  tierLabel: string;
  totalCtc: number;
  baseSalary: number;
  joiningBonus: number;
  variablePay: number;
  deadline: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  signedDocumentKey?: string;
  jobTitle?: string;
  location?: string;
  ctcLabel?: string;
  performanceBonus?: number;
  signatureReference?: string;
  expiresAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'tacie' | 'user' | 'assistant' | 'system';
  text?: string;
  content?: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    tab: StudentNavTab;
  };
  metadata?: {
    model?: string;
    tokensUsed?: number;
    recommendedActions?: {
      title: string;
      actionType: string;
      payload?: Record<string, unknown>;
    }[];
  };
}

export interface TacieQuota {
  monthlyLimit: number;
  totalCredits?: number;
  usedCredits: number;
  remainingCredits: number;
  resetsInDays: number;
  resetsAt?: string;
}

export interface VerifiedSkill {
  id: string;
  name: string;
  level: 'Expert' | 'Proficient' | 'Intermediate' | 'Beginner' | string;
  verifiedTier: string;
  score: number;
  evidenceCount?: number;
}
