// src/app/models/api.models.ts

export type PageId = 'home' | 'jobs' | 'apps' | 'grow' | 'people' | 'msgs' | 'more';
export type BadgeTone = 'good' | 'acc' | 'bad' | 'warn';
export type ChatGroupKey = 'tacie' | 'alumni';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface SidebarNavItem {
  id: PageId;
  label: string;
  iconId: string;
  badgeText?: string;
  badgeTone?: 'default' | 'warn';
}

// 5. Users & 6. Students (/api/users & /api/students)
export interface UserDto {
  id: string;
  email: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface StudentProfileDto {
  id: string;
  user_id: string;
  enrollment_number: string;
  batch_year: number;
  degree: string;
  is_placed: boolean;
  user?: UserDto;
}

export interface StudentCareerProfileDto {
  student_id: string;
  headline: string;
  preferred_roles: string[];
  preferred_locations: string[];
  target_ctc: number;
  github_url?: string;
  linkedin_url?: string;
}

export interface StudentPreferencesDto {
  recruiter_discovery_enabled: boolean;
  resume_visibility: 'PUBLIC' | 'COMPANIES_ONLY' | 'PRIVATE';
  alumni_connection_enabled: boolean;
  learning_profile_visibility: 'PUBLIC' | 'PRIVATE';
  assessment_visibility: 'COMPANIES_ONLY' | 'PUBLIC';
}

export type StudentRequestType =
  | 'OFF_CAMPUS_NOC'
  | 'DRIVE_EXCEPTION'
  | 'INTERVIEW_RESCHEDULE'
  | 'PLACEMENT_POLICY_EXCEPTION'
  | 'ACADEMIC_CORRECTION'
  | 'DUTY_LEAVE'
  | 'DOCUMENT_REQUEST'
  | 'OTHER';

export interface CreateStudentRequestDto {
  student_id: string;
  request_type: StudentRequestType;
  title: string;
  details: Record<string, any>;
}

export interface StudentActionItemDto {
  id: string;
  student_id: string;
  title: string;
  action_type: 'OFFER_DECISION' | 'INTERVIEW_CONFIRM' | 'ASSESSMENT_SLOT' | string;
  reference_id: string;
  deadline: string;
  subtitle?: string;
  completed_at?: string | null;
}

// 7. Academic (/api/academic)
export interface AcademicRecordDto {
  id: string;
  student_id: string;
  cgpa: number;
  sgpa_history: number[];
  active_backlogs: number;
  total_backlogs_history: number;
  tenth_percentage: number;
  twelfth_percentage: number;
  verified_by_user_id: string;
  updated_at?: string;
}

export interface AcademicEventDto {
  id: string;
  title: string;
  event_type: 'EXAM' | 'INTERVIEW' | 'ASSESSMENT' | 'DRIVE_DEADLINE' | string;
  department_id: string;
  starts_at: string;
  ends_at: string;
  subtitle?: string;
}

export interface ConflictCheckRequest {
  department_id: string;
  starts_at: string;
  ends_at: string;
}

export interface ConflictCheckResponse {
  has_conflict: boolean;
  conflicting_events: AcademicEventDto[];
  summary_message?: string;
}

// 8. Institutions (/api/institutions)
export interface InstitutionDto {
  id: string;
  name: string;
  code: string;
  domain: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// 12. Companies & 13. Placements (/api/companies & /api/placements)
export interface CompanyDto {
  id: string;
  name: string;
  domain: string;
  tier: 'TIER_1_SUPER_DREAM' | 'DREAM' | 'CORE' | 'MASS';
  industry: string;
  headquarters: string;
}

export interface JobOpportunityDto {
  id: string;
  company_id: string;
  company_name?: string;
  job_code?: string;
  tier_label?: string;
  title: string;
  job_type: 'FULL_TIME' | 'INTERNSHIP';
  drive_type?: 'campus' | 'off';
  work_mode?: 'Hybrid' | 'Onsite' | 'Remote';
  base_salary: number;
  total_ctc: number;
  location: string;
  match_score?: number;
  eligibility_status?: 'ok' | 'policy' | 'no';
  eligibility_note?: string;
  application_status?: string;
  closes_in_days?: number;
  due_date_label?: string;
  referral_available?: boolean;
  skill_matches?: { name: string; status: 'good' | 'warn' }[];
}

export interface SubmitApplicationRequest {
  opportunity_id: string;
  student_id: string;
  resume_id: string;
}

export interface ApplicationRoundDto {
  title: string;
  date_label: string;
  status: 'ok' | 'cur' | 'wait' | 'bad';
  description: string;
  action_key?: string;
  action_label?: string;
}

export interface StudentApplicationDto {
  id: string;
  application_code: string;
  opportunity_id: string;
  company_name: string;
  role_title: string;
  tier_label: string;
  ctc_label: string;
  locked_resume_title: string;
  applied_date: string;
  current_stage_label: string;
  stage_tone: BadgeTone;
  sla_label: string;
  current_step: number;
  total_steps: number;
  rounds: ApplicationRoundDto[];
}

export interface PlacementOfferDto {
  id: string;
  offer_code: string;
  company_name: string;
  role_title: string;
  tier_label: string;
  total_ctc: number;
  base_salary: number;
  joining_bonus: number;
  variable_pay: number;
  deadline: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export interface AcceptOfferRequest {
  studentId: string;
  signed_document_object_key: string;
  signature_reference: string;
}

export interface PlacementComplianceDto {
  student_id: string;
  active_strikes: number;
  max_allowed_strikes: number;
  is_debarred: boolean;
  policy_standing: string;
}

// 14. TACIE AI & Quotas (/api/tacie)
export interface ReadinessBarMetric {
  label: string;
  score_percentage: number;
  tone: 'good' | 'warn' | 'bad' | 'default';
}

export interface SkillGapAnalysisDto {
  student_id: string;
  target_role: string;
  overall_readiness_score: number;
  cohort_percentile_label: string;
  benchmark_summary: string;
  breakdown: ReadinessBarMetric[];
  highest_roi_action?: {
    title: string;
    subtitle: string;
    recommended_tab: string;
  };
}

export interface TacieResumeAnalysisDto {
  id?: string;
  resume_id: string;
  overall_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  metrics: {
    impact: number;
    ats_readability: number;
    action_verbs: number;
  };
  bullet_fixes?: {
    id: string;
    project_context: string;
    issue_tag: string;
    old_text: string;
    new_text: string;
    points_gain: number;
    applied?: boolean;
  }[];
}

export interface TacieQuotaDto {
  id: string;
  user_id: string;
  monthly_limit: number;
  used_credits: number;
  remaining_credits: number;
  resets_at: string;
}

// 15. Assessments & Proctoring (/api/assessments)
export interface AssessmentDto {
  id: string;
  title: string;
  category: string;
  duration_minutes: number;
  total_marks: number;
  pass_marks: number;
  due_at?: string;
  is_mandatory?: boolean;
}

export interface AssessmentBadgeDto {
  id: string;
  assessment_id: string;
  title: string;
  score: number;
  percentile: number;
  sha256_hash: string;
  completed_at: string;
}

export interface ProctorPreflightRequest {
  student_id: string;
  assessment_id: string;
  camera_check: boolean;
  mic_check: boolean;
  screen_share_check: boolean;
  identity_match_score: number;
}

// 16. Alumni & Mentorship (/api/alumni)
export interface AlumniProfileDto {
  id: string;
  user_id: string;
  name?: string;
  initials?: string;
  graduation_year: number;
  current_company: string;
  current_role: string;
  is_available_for_mentorship: boolean;
  offers_referrals?: boolean;
  response_sla?: string;
  slots_summary?: string;
  bio?: string;
}

export interface ReferralPostDto {
  id: string;
  alumni_id: string;
  alumni_name?: string;
  graduation_year?: number;
  company_name: string;
  role_title: string;
  job_code?: string;
  job_url: string;
  max_referrals: number;
  remaining_slots?: number;
  min_match_required?: number;
  student_match_score?: number;
  closes_at?: string;
}

export interface RequestReferralDto {
  referral_post_id: string;
  student_id: string;
  resume_version_id: string;
  message: string;
}

export interface BookMentorshipRequest {
  slot_id: string;
  student_id: string;
  session_type: string;
}

// 17. Chat & Messaging (/api/chat)
export type ConversationType =
  | 'DIRECT'
  | 'TACIE_ADVISOR'
  | 'MENTORSHIP'
  | 'ALUMNI_REFERRAL'
  | 'PLACEMENT_SUPPORT';

export interface ConversationDto {
  id: string;
  conversation_type: ConversationType;
  title: string;
  participant_ids: string[];
  role_context?: string;
  context_description?: string;
  status_label?: string;
  status_tone?: BadgeTone;
  suggested_prompts?: string[];
  credits_used?: number;
}

export interface ChatMessageDto {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

// 18. Skills & Evidence (/api/skills)
export interface StudentSkillItemDto {
  id: string;
  skill_id: string;
  skill_name: string;
  proficiency_level: string;
  verification_tier_label: string;
  verification_tone: BadgeTone;
  score_percentage: number;
  target_benchmark_percentage: number;
  evidence_summary: string;
  recommended_action?: 'assess' | 'learn' | 'proof';
}

// 19. Resumes (/api/resumes)
export interface ResumeDocumentDto {
  id: string;
  student_id: string;
  title: string;
  latest_version_id?: string;
  ats_score?: number;
}

export interface ResumeVersionDto {
  id: string;
  resume_id: string;
  version_number: number;
  file_url: string;
  file_hash: string;
  extracted_text: string;
}

// 20. Student Projects (/api/projects)
export interface StudentProjectDto {
  id: string;
  student_id: string;
  title: string;
  summary: string;
  github_url: string;
  project_url: string;
  student_role: string;
  impact_description: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  verification_status?: 'VERIFIED' | 'PENDING';
}

// 21. Notifications (/api/notifications)
export interface NotificationDto {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read?: boolean;
  read_at?: string | null;
  created_at?: string;
}

// 22. Learning Marketplace & Bookmarks (/api/learning)
export interface LearningPostDto {
  id: string;
  author_id: string;
  author_name?: string;
  author_badge?: string;
  title: string;
  content: string;
  category: string;
  saves_count?: number;
}

export interface SavedItemDto {
  id: string;
  user_id: string;
  item_type: 'JOB' | 'LEARNING_POST' | 'ALUMNI' | 'REFERRAL_POST' | 'ASSESSMENT';
  item_id: string;
  title?: string;
  subtitle?: string;
}

// 24. Reputation & 25. Rewards (/api/reputation & /api/rewards)
export interface ReputationSummaryDto {
  id: string;
  student_id: string;
  trust_score: number;
  tier_label?: string;
}

export interface RewardTransactionDto {
  id: string;
  student_id: string;
  points: number;
  transaction_type: string;
  description: string;
}

// 28. Audit & Access Logs (/api/audit)
export interface DataAccessAuditLogDto {
  id: string;
  timestamp: string;
  actor_name: string;
  resource_accessed: string;
  authorization_basis: string;
}