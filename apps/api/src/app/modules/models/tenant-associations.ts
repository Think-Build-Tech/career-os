import { AcademicEvent, StudentAcademicMembership, StudentAcademicRecord } from "../academic/models";
import {
  AlumniConnectionRequest,
  AlumniEmployment,
  AlumniProfile,
  MentorshipAvailabilitySlot,
  MentorshipBooking,
  ReferralPost,
  ReferralRequest,
} from "../alumni/models";
import {
  Assessment,
  AssessmentAssignment,
  AssessmentAttempt,
  AssessmentQuestion,
  AssessmentResponse,
  AssessmentSlot,
  AssessmentSlotBooking,
  BadgeDefinition,
  ProctorEvent,
  ProctorPreflight,
  ProctorSession,
  StudentBadge,
} from "../assessment/models";
import { AuditLog, DataAccessAudit } from "../audit/models";
import {
  AiMessageMetadata,
  Conversation,
  ConversationContext,
  ConversationParticipant,
  Message,
  MessageCitation,
} from "../chat/models";
import {
  Company,
  CompanyContact,
  CrmActivity,
  CrmPipeline,
  RecruiterProfile,
  RecruitmentVisit,
} from "../company/models";
import { Department } from "../department/department.model";
import { RoleAssignment } from "../identity/models";
import { ExternalIdMapping, IntegrationConnection, SyncJob } from "../integration/models";
import { KnowledgeChunk, KnowledgeDocument } from "../knowledge/models";
import {
  LearningComment,
  LearningPost,
  LearningPostSkill,
  LearningPostTag,
  LearningReaction,
  LearningResource,
  LearningSave,
  LearningTag,
  SavedItem,
} from "../learning/models";
import {
  MessageModeration,
  MessageReport as ModerationMessageReport,
  ModerationCase,
} from "../moderation/models";
import {
  Notification,
  NotificationDelivery,
  NotificationPreference,
} from "../notification/models";
import {
  ApplicationStatusHistory,
  ArtifactAttestation,
  DriveDepartment,
  DriveRound,
  EligibilityEvaluation,
  EligibilityRuleSet,
  JobApplication,
  JobDescriptionVersion,
  JobOffer,
  JobOpportunity,
  OfferCompensationComponent,
  OpportunitySubmission,
  OpportunityVerification,
  PlacementComplianceEvent,
  PlacementDrive,
  PlacementPolicy,
  PlacementPolicyRule,
  PlacementRecord,
  PlacementSeason,
  PlacementTier,
  StudentPlacementCompliance,
  StudentRoundResult,
  SubmissionReview,
  UserAgreement,
} from "../placement/models";
import { ProjectSkill, StudentProject } from "../project/models";
import { Resume, ResumeVersion } from "../resume/models";
import { Skill, SkillEvidence, StudentSkill } from "../skill/models";
import {
  StudentActionItem,
  StudentCareerProfile,
  StudentPrivacyPreference,
  StudentProfile,
  StudentRequest,
} from "../student/models";
import {
  AiCreditEvent,
  AiRun,
  AiUsageQuota,
  CandidateMatchResult,
  CandidateMatchRun,
  CandidateSearch,
  MarketSkillSnapshot,
  ResumeAnalysis,
  SkillGapAnalysis,
  SkillGapItem,
} from "../tacie/models";
import { User } from "../user/user.model";

// Cross-domain associations live here to keep model modules acyclic.
User.hasMany(RoleAssignment, { foreignKey: "user_id", as: "role_assignments" });
RoleAssignment.belongsTo(User, { foreignKey: "user_id", as: "user" });

StudentProfile.hasMany(StudentSkill, { foreignKey: "student_id", as: "skills" });
StudentSkill.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
SkillEvidence.belongsTo(User, { foreignKey: "verified_by", as: "verifier" });

StudentProfile.hasMany(StudentProject, { foreignKey: "student_id", as: "projects" });
StudentProject.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
StudentProject.belongsTo(User, { foreignKey: "verified_by", as: "verifier" });
ProjectSkill.belongsTo(Skill, { foreignKey: "skill_id", as: "skill" });
Skill.hasMany(ProjectSkill, { foreignKey: "skill_id", as: "project_skills" });

Company.hasMany(CompanyContact, { foreignKey: "company_id", as: "company_contacts" });
RecruiterProfile.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasOne(RecruiterProfile, { foreignKey: "user_id", as: "recruiter_profile" });
CrmActivity.belongsTo(Company, { foreignKey: "company_id", as: "company" });
CrmActivity.belongsTo(User, { foreignKey: "actor_user_id", as: "actor" });
CrmActivity.belongsTo(Department, { foreignKey: "department_id", as: "department" });
RecruitmentVisit.belongsTo(Company, { foreignKey: "company_id", as: "company" });
Company.hasMany(RecruitmentVisit, { foreignKey: "company_id", as: "recruitment_visits" });

Company.hasMany(JobOpportunity, { foreignKey: "company_id", as: "job_opportunities" });
JobOpportunity.belongsTo(Company, { foreignKey: "company_id", as: "company" });
PlacementSeason.hasMany(PlacementTier, { foreignKey: "placement_season_id", as: "tiers" });
PlacementTier.belongsTo(PlacementSeason, { foreignKey: "placement_season_id", as: "season" });
PlacementSeason.hasMany(PlacementDrive, { foreignKey: "placement_season_id", as: "drives" });
PlacementDrive.belongsTo(PlacementSeason, { foreignKey: "placement_season_id", as: "season" });
PlacementDrive.belongsTo(JobOpportunity, { foreignKey: "job_opportunity_id", as: "job_opportunity" });
JobOpportunity.hasMany(PlacementDrive, { foreignKey: "job_opportunity_id", as: "drives" });
PlacementDrive.belongsTo(PlacementTier, { foreignKey: "placement_tier_id", as: "tier" });
PlacementDrive.belongsToMany(Department, {
  through: DriveDepartment,
  foreignKey: "drive_id",
  otherKey: "department_id",
  as: "departments",
});
Department.belongsToMany(PlacementDrive, {
  through: DriveDepartment,
  foreignKey: "department_id",
  otherKey: "drive_id",
  as: "placement_drives",
});
DriveDepartment.belongsTo(Department, { foreignKey: "department_id", as: "department" });
EligibilityRuleSet.belongsTo(Department, { foreignKey: "department_id", as: "department" });
EligibilityEvaluation.belongsTo(EligibilityRuleSet, { foreignKey: "rule_set_id", as: "rule_set" });
EligibilityEvaluation.belongsTo(PlacementDrive, { foreignKey: "drive_id", as: "drive" });
EligibilityEvaluation.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });

JobApplication.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
JobApplication.belongsTo(JobOpportunity, { foreignKey: "job_opportunity_id", as: "job_opportunity" });
JobApplication.belongsTo(PlacementDrive, { foreignKey: "drive_id", as: "drive" });
JobApplication.belongsTo(ResumeVersion, { foreignKey: "resume_version_id", as: "resume_version" });
StudentRoundResult.belongsTo(DriveRound, { foreignKey: "drive_round_id", as: "drive_round" });
JobOffer.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
JobOffer.belongsTo(JobOpportunity, { foreignKey: "job_opportunity_id", as: "job_opportunity" });
JobOffer.belongsTo(Company, { foreignKey: "company_id", as: "company" });
JobOffer.belongsTo(PlacementTier, { foreignKey: "placement_tier_id", as: "tier" });
PlacementRecord.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
PlacementRecord.belongsTo(PlacementSeason, { foreignKey: "placement_season_id", as: "season" });
PlacementRecord.belongsTo(Company, { foreignKey: "company_id", as: "company" });
PlacementRecord.belongsTo(JobOffer, { foreignKey: "job_offer_id", as: "job_offer" });
PlacementSeason.hasMany(PlacementPolicy, { foreignKey: "placement_season_id", as: "policies" });
PlacementPolicy.belongsTo(PlacementSeason, { foreignKey: "placement_season_id", as: "season" });
OpportunitySubmission.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
SubmissionReview.belongsTo(User, { foreignKey: "reviewer_user_id", as: "reviewer" });
SubmissionReview.belongsTo(JobOpportunity, { foreignKey: "published_job_id", as: "published_job" });

// Student requests, action items, privacy, and compliance
// Note: Intra-module associations (requests, action_items, privacy_preference) are defined in student models
StudentProfile.hasMany(PlacementComplianceEvent, { foreignKey: "student_id", as: "compliance_events" });
PlacementComplianceEvent.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
PlacementComplianceEvent.belongsTo(PlacementDrive, { foreignKey: "drive_id", as: "drive" });
PlacementComplianceEvent.belongsTo(JobApplication, { foreignKey: "application_id", as: "application" });

StudentProfile.hasOne(StudentPlacementCompliance, { foreignKey: "student_id", as: "placement_compliance" });
StudentPlacementCompliance.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });

// Agreements & Attestations
User.hasMany(UserAgreement, { foreignKey: "user_id", as: "agreements" });
UserAgreement.belongsTo(User, { foreignKey: "user_id", as: "user" });
StudentProfile.hasMany(UserAgreement, { foreignKey: "student_id", as: "user_agreements" });
UserAgreement.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
ArtifactAttestation.belongsTo(User, { foreignKey: "signer_user_id", as: "signer" });

// Assessment slots & proctor preflight
StudentProfile.hasMany(AssessmentSlotBooking, { foreignKey: "student_id", as: "assessment_bookings" });
AssessmentSlotBooking.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });

StudentProfile.hasMany(ProctorPreflight, { foreignKey: "student_id", as: "proctor_preflights" });
ProctorPreflight.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });

// Alumni & Mentorship
AlumniProfile.belongsTo(User, { foreignKey: "user_id", as: "user" });
AlumniProfile.belongsTo(StudentProfile, { foreignKey: "former_student_id", as: "former_student" });
ReferralRequest.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
ReferralRequest.belongsTo(ResumeVersion, { foreignKey: "resume_version_id", as: "resume_version" });
AlumniConnectionRequest.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
AlumniConnectionRequest.belongsTo(AlumniProfile, { foreignKey: "alumni_id", as: "alumni" });

StudentProfile.hasMany(MentorshipBooking, { foreignKey: "student_id", as: "mentorship_bookings" });
MentorshipBooking.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
AlumniProfile.hasMany(MentorshipBooking, { foreignKey: "alumni_id", as: "mentorship_bookings" });

// Saved items
User.hasMany(SavedItem, { foreignKey: "user_id", as: "saved_items" });
SavedItem.belongsTo(User, { foreignKey: "user_id", as: "user" });
StudentProfile.hasMany(SavedItem, { foreignKey: "student_id", as: "saved_items" });
SavedItem.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });

// Chat & Moderation
ConversationParticipant.belongsTo(User, { foreignKey: "user_id", as: "user" });
ConversationContext.belongsTo(Conversation, { foreignKey: "conversation_id", as: "conversation" });
Message.belongsTo(User, { foreignKey: "sender_user_id", as: "sender" });
Message.belongsTo(Message, { foreignKey: "parent_message_id", as: "parent_message" });
Message.hasMany(Message, { foreignKey: "parent_message_id", as: "replies" });
MessageCitation.belongsTo(KnowledgeChunk, { foreignKey: "knowledge_chunk_id", as: "knowledge_chunk" });
AiMessageMetadata.belongsTo(AiRun, { foreignKey: "ai_run_id", as: "ai_run" });

MessageModeration.belongsTo(Message, { foreignKey: "message_id", as: "message" });
ModerationMessageReport.belongsTo(Message, { foreignKey: "message_id", as: "message" });
ModerationCase.belongsTo(Message, { foreignKey: "message_id", as: "message" });

// TACIE AI, RAG & Quotas
ResumeAnalysis.belongsTo(AiRun, { foreignKey: "ai_run_id", as: "ai_run" });
ResumeAnalysis.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
ResumeAnalysis.belongsTo(ResumeVersion, { foreignKey: "resume_version_id", as: "resume_version" });
ResumeAnalysis.belongsTo(JobOpportunity, { foreignKey: "job_opportunity_id", as: "job_opportunity" });
ResumeAnalysis.belongsTo(JobDescriptionVersion, {
  foreignKey: "job_description_version_id",
  as: "job_description_version",
});
CandidateSearch.belongsTo(User, { foreignKey: "requested_by", as: "requested_by_user" });
CandidateMatchRun.belongsTo(AiRun, { foreignKey: "ai_run_id", as: "ai_run" });
SkillGapAnalysis.belongsTo(AiRun, { foreignKey: "ai_run_id", as: "ai_run" });
SkillGapAnalysis.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });

User.hasMany(AiCreditEvent, { foreignKey: "user_id", as: "ai_credit_events" });
AiCreditEvent.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Assessments
AssessmentAssignment.belongsTo(User, { foreignKey: "created_by", as: "creator" });
AssessmentAttempt.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
AssessmentAttempt.belongsTo(AssessmentAssignment, { foreignKey: "assignment_id", as: "assignment" });
AssessmentResponse.belongsTo(AssessmentQuestion, { foreignKey: "question_id", as: "question" });
StudentBadge.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
StudentBadge.belongsTo(AssessmentAttempt, { foreignKey: "assessment_attempt_id", as: "assessment_attempt" });

// Learning
LearningPost.belongsTo(User, { foreignKey: "author_user_id", as: "author" });
LearningResource.belongsTo(LearningPost, { foreignKey: "learning_post_id", as: "post" });
LearningPostSkill.belongsTo(Skill, { foreignKey: "skill_id", as: "skill" });
LearningReaction.belongsTo(User, { foreignKey: "user_id", as: "user" });
LearningComment.belongsTo(User, { foreignKey: "user_id", as: "user" });
LearningSave.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Notifications
Notification.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(NotificationPreference, { foreignKey: "user_id", as: "notification_preferences" });
NotificationPreference.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Integrations & Audits
SyncJob.belongsTo(IntegrationConnection, { foreignKey: "integration_connection_id", as: "connection" });
ExternalIdMapping.belongsTo(IntegrationConnection, {
  foreignKey: "integration_connection_id",
  as: "connection",
});
AuditLog.belongsTo(User, { foreignKey: "actor_user_id", as: "actor" });

StudentProfile.hasMany(DataAccessAudit, { foreignKey: "resource_owner_id", as: "data_access_audits" });
DataAccessAudit.belongsTo(StudentProfile, { foreignKey: "resource_owner_id", as: "resource_owner" });
User.hasMany(DataAccessAudit, { foreignKey: "actor_user_id", as: "performed_data_access_audits" });
DataAccessAudit.belongsTo(User, { foreignKey: "actor_user_id", as: "actor" });

// Keep imports that are association targets visible to tree-shaking builds.
void AcademicEvent;
void StudentAcademicRecord;
void StudentAcademicMembership;
void StudentCareerProfile;
void CrmPipeline;
void KnowledgeDocument;
void LearningTag;
void LearningPostTag;
void NotificationDelivery;
void OpportunityVerification;
void PlacementPolicyRule;
void Resume;
void MarketSkillSnapshot;
void SkillGapItem;
void CandidateMatchResult;
void AiUsageQuota;
