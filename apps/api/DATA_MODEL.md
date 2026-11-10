# AGENTS.md


# 0. CURRENT CANONICAL CAREEROS UPDATE — FINAL STUDENT UX + DATA MODEL

> **This section supersedes any conflicting legacy guidance later in this file.**
>
> The document below contains earlier design history that remains useful, but coding agents must treat the rules, entities, and workflows in this section as the current canonical model.

CareerOS is now defined as a multi-tenant **College Placement ERP + Applicant Tracking System + Student Career Intelligence Platform + Trust/Verification Platform + Alumni Mentorship/Referral Network + AI Career Assistant**.

The current architecture has been cross-verified against the finalized Platform Super Admin UX and Student UX.

## 0.1 Canonical deployment and tenancy model

The non-negotiable architecture is:

```text
Platform Control Plane
        |
        +-- TENANT
        +-- TENANT_DATABASE
        +-- TENANT_PROVISIONING_JOB
        +-- SUBSCRIPTION
        +-- GLOBAL_USER
        +-- TENANT_MEMBERSHIP
        +-- PLATFORM_ADMIN
        |
        v
Shared stateless web/API/AI/background compute
        |
        v
Tenant-aware database router
        |
        +-- College A PostgreSQL Database
        +-- College B PostgreSQL Database
        +-- College C PostgreSQL Database
```

Rules:

1. Every college has its own isolated operational PostgreSQL database.
2. Database-per-college does **not** require server-per-college.
3. Several college databases may share one managed PostgreSQL cluster/server.
4. Large enterprise tenants may later move to dedicated database infrastructure without changing business logic.
5. The **core DB, chat DB, and vector DB are the same physical college database**.
6. Each college database contains core relational data, conversations/messages, RAG metadata, and pgvector embeddings.
7. Files remain in object storage.
8. Shared compute may serve multiple colleges.
9. The control-plane DB must not contain college-private operational records.
10. The frontend never chooses or receives the physical database name, secret reference, or credentials.

## 0.2 College code tenant discovery

Login uses a 4-digit college code to discover the tenant.

```text
4-digit code
→ TENANT lookup
→ ensure tenant ACTIVE
→ TENANT_DATABASE
→ resolve secret reference
→ connect to correct college DB
→ authenticate tenant USER
→ resolve ROLE_ASSIGNMENT + scopes
```

The code is not a password or security factor.

Rate-limit discovery and avoid tenant-enumeration responses.

JWT/session context may contain tenant/institution/user/role/scope identifiers but never raw database routing secrets.

## 0.3 Canonical tenant-local identity and RBAC

Use:

```text
USER
ROLE
PERMISSION
ROLE_PERMISSION
ROLE_ASSIGNMENT
```

Scopes are first-class:

```text
PLATFORM
INSTITUTION
DEPARTMENT
PROGRAM
COHORT
DRIVE
STUDENT / SELF
```

Examples:

```text
Central TPO       → INSTITUTION
Department TPO    → DEPARTMENT
Coordinator       → COHORT
Recruiter         → DRIVE / authorized candidate pool
Student           → SELF
```

Frontend visibility is never authorization.

A student must never become TPO/Admin merely because a client-side role switch was triggered. A production role switch is valid only when the authenticated `USER` owns the corresponding valid `ROLE_ASSIGNMENT`.

Any TPO/Admin switch shown in a student prototype is demo-only unless backed by real RBAC.

## 0.4 Current institution hierarchy

```text
INSTITUTION
  ↓
DEPARTMENT
  ↓
PROGRAM
  ↓
COHORT
  ↓
STUDENT_PROFILE
```

A placement drive can target multiple departments.

Never use only `PLACEMENT_DRIVE.department_id`.

Use:

```text
DRIVE_DEPARTMENT
- drive_id
- department_id
- eligibility_rule_set_id
- enabled
```

## 0.5 Canonical student data trust categories

### Institution-verified data

Students cannot directly mutate:

```text
PRN
roll number
department
program
cohort
graduation year
CGPA
SGPA
academic percentages
backlogs
academic history
institutional placement status
```

Correction happens via ERP/admin sync or `STUDENT_REQUEST`.

### Student-editable career data

Students may edit:

```text
headline
bio
preferred roles
preferred locations
work modes
career links
projects
self-declared skills
resume uploads
learning contributions
opportunity submissions
```

### Derived AI/system intelligence

Examples:

```text
resume score
job match score
candidate match score
skill gaps
readiness score
recommendations
moderation classifications
```

Derived intelligence is never authoritative institutional truth.

## 0.6 Current canonical student/profile entities

```text
STUDENT_PROFILE
STUDENT_ACADEMIC_MEMBERSHIP
STUDENT_ACADEMIC_RECORD
STUDENT_CAREER_PROFILE
ACADEMIC_EVENT
STUDENT_PRIVACY_PREFERENCE
```

`ACADEMIC_EVENT` supports timetable/exam conflicts for interviews, assessments, and duty-leave workflows.

`STUDENT_PRIVACY_PREFERENCE` may further restrict visibility but can never grant access beyond RBAC.

Correct access evaluation:

```text
RBAC allows
AND resource relationship allows
AND privacy preference allows
→ access
```

## 0.7 Generic student request workflow — NEW

Use one reusable entity:

```text
STUDENT_REQUEST
```

for:

```text
OFF_CAMPUS_NOC
DRIVE_EXCEPTION
INTERVIEW_RESCHEDULE
PLACEMENT_POLICY_EXCEPTION
ACADEMIC_CORRECTION
DUTY_LEAVE
DOCUMENT_REQUEST
OTHER
```

Do not add unrelated NOC/reschedule/correction columns to `JOB_APPLICATION`.

Flow:

```text
student request
→ pending review
→ authorized reviewer
→ approve/reject/request changes
→ optional generated document
→ audit
→ notification
```

## 0.8 Student SLA/action queue — NEW

Use:

```text
STUDENT_ACTION_ITEM
```

A notification says something happened.

An action item says the student must perform something before a deadline.

Examples:

```text
confirm interview
select assessment slot
accept/decline offer
sign NDA
upload document
respond to TPO request
```

Statuses:

```text
PENDING
COMPLETED
EXPIRED
WAIVED
CANCELLED
```

The finalized Student Home SLA queue must derive from this entity rather than static frontend countdowns.

## 0.9 Placement compliance / strikes — NEW

Use:

```text
PLACEMENT_COMPLIANCE_EVENT
STUDENT_PLACEMENT_COMPLIANCE
```

Possible event types:

```text
INTERVIEW_NO_SHOW
ASSESSMENT_NO_SHOW
LATE_WITHDRAWAL
POLICY_VIOLATION
DOCUMENTATION_MISSING
WARNING
STRIKE_ISSUED
STRIKE_REVERSED
EXCUSED_ABSENCE
```

`PLACEMENT_COMPLIANCE_EVENT` is immutable event history.

`STUDENT_PLACEMENT_COMPLIANCE` is a current summary/projection.

Never decrement a strike count without creating an explicit reversal/excusal event.

## 0.10 Skills and evidence

Canonical entities:

```text
SKILL
STUDENT_SKILL
SKILL_EVIDENCE
```

Verification hierarchy may include:

```text
PROCTORED_ASSESSMENT
TPO_VERIFIED
CERTIFICATE_VERIFIED
PROJECT_VERIFIED
SELF_DECLARED
```

A student skill summary must retain evidence provenance.

## 0.11 Student projects — UPDATED

`STUDENT_PROJECT` must now support:

```text
title
summary
description
project_type
student_role
contribution_description
impact_description
github_url
project_url
start_date
end_date
is_ongoing
visibility
verification_status
verified_by
verified_at
```

Use `PROJECT_SKILL` for skill mapping and `SKILL_EVIDENCE` for evidence provenance.

### AI project/resume integrity rule

TACIE must never invent unsupported:

```text
user counts
request volume
latency
throughput
revenue
accuracy
performance gains
scale metrics
business impact
```

If evidence does not support a metric, TACIE must ask for real evidence or rewrite without the metric.

## 0.12 Resume versioning

Use:

```text
RESUME
RESUME_VERSION
```

Never overwrite an old version.

Applications and analyses reference exact `RESUME_VERSION` IDs.

A submitted application must preserve the selected immutable resume version.

## 0.13 Job/JD versioning

Use:

```text
JOB_OPPORTUNITY
JOB_DESCRIPTION_VERSION
```

Historical TACIE analysis must bind exact:

```text
resume_version_id
job_description_version_id
```

Do not silently recompute a historical conversation using a newer JD.

## 0.14 Student-submitted opportunities

Canonical entities:

```text
OPPORTUNITY_SUBMISSION
OPPORTUNITY_VERIFICATION
SUBMISSION_REVIEW
```

Flow:

```text
student URL submission
→ web/source/domain checks
→ duplicate/scam checks
→ TPO review
→ approved JOB_OPPORTUNITY
→ optional reputation/reward events
```

Submission and published job remain separate entities.

## 0.15 Placement drives and eligibility

Canonical entities:

```text
PLACEMENT_DRIVE
DRIVE_ROUND
DRIVE_DEPARTMENT
ELIGIBILITY_RULE_SET
ELIGIBILITY_EVALUATION
```

Eligibility answers:

```text
Does the student satisfy this company's/drive's requirements?
```

Placement policy answers:

```text
Even if eligible, does the institution currently allow this application?
```

Never merge those concepts.

Possible final UI states include:

```text
ELIGIBLE
NOT_ELIGIBLE
POLICY_RESTRICTED
REQUEST_REQUIRED
```

`ELIGIBILITY_EVALUATION` is a historical snapshot and must not change when a later rule version changes.

## 0.16 Placement policy

Use:

```text
PLACEMENT_POLICY
PLACEMENT_POLICY_RULE
PLACEMENT_TIER
```

Possible rules:

```text
ONE_STUDENT_ONE_JOB
OFFER_TIER_RESTRICTION
DREAM_COMPANY_EXCEPTION
CTC_MULTIPLIER_UPGRADE
NO_SHOW_STRIKE_LIMIT
OFF_CAMPUS_NOC_REQUIRED
```

The finalized What-If Policy Simulator is a service-level projection using the same real policy engine.

Do not persist every simulation as authoritative state.

## 0.17 Applications and rounds

Use:

```text
JOB_APPLICATION
APPLICATION_STATUS_HISTORY
DRIVE_ROUND
STUDENT_ROUND_RESULT
```

Submission flow:

```text
current eligibility evaluation
+
current placement-policy evaluation
+
selected RESUME_VERSION
→ JOB_APPLICATION
→ APPLICATION_STATUS_HISTORY
```

Every transition is backend-authorized.

Client state is never authoritative for application stage.

## 0.18 Offers — UPDATED

Use:

```text
JOB_OFFER
OFFER_COMPENSATION_COMPONENT
PLACEMENT_RECORD
```

`JOB_OFFER` must support:

```text
student_id
application_id
company_id
placement_tier_id
total_ctc
currency
offer_date
decision_deadline
status
offer_letter_object_key
accepted_at
declined_at
decline_reason
signed_document_object_key
signature_reference
```

Use `OFFER_COMPENSATION_COMPONENT` for:

```text
BASE
JOINING_BONUS
PERFORMANCE_BONUS
VARIABLE
STOCK
ALLOWANCE
RETENTION_BONUS
OTHER
```

An offer is not the same thing as a final placement outcome.

`PLACEMENT_RECORD` remains the placement source of truth after institutional completion.

## 0.19 Agreements / NDA / acceptance — NEW

Use:

```text
USER_AGREEMENT
```

for:

```text
INTERVIEW_NDA
OFFER_ACCEPTANCE
ASSESSMENT_RULES
PLACEMENT_POLICY_ACKNOWLEDGEMENT
PRIVACY_CONSENT
```

Persist document/version/hash and acceptance/signature evidence.

A frontend checkbox alone is not a durable agreement record.

## 0.20 Generic artifact attestation — NEW

Use:

```text
ARTIFACT_ATTESTATION
```

for cryptographic/signature metadata attached to:

```text
academic records
resume snapshots
assessment credentials
offer documents
eligibility receipts
verified dossiers
```

Do not use product language such as:

```text
cryptographically signed
SHA-256 verified
cryptographic attestation
```

unless actual verifiable attestation/signature data is persisted and validated.

## 0.21 Assessments

Canonical entities:

```text
ASSESSMENT
ASSESSMENT_QUESTION
ASSESSMENT_ASSIGNMENT
ASSESSMENT_ATTEMPT
ASSESSMENT_RESPONSE
```

Verified outcomes must remain traceable to attempts/evidence.

## 0.22 Assessment slot booking — NEW

Use:

```text
ASSESSMENT_SLOT
ASSESSMENT_SLOT_BOOKING
```

`ASSESSMENT_SLOT` stores:

```text
starts_at
ends_at
capacity
booked_count
status
```

Booking is concurrency-sensitive and must be transactionally/atomically capacity checked.

Never trust a frontend `seats_left` value.

## 0.23 Proctoring — UPDATED

Use:

```text
PROCTOR_SESSION
PROCTOR_EVENT
PROCTOR_PREFLIGHT
```

`PROCTOR_PREFLIGHT` supports:

```text
camera
microphone
network
browser
monitor/display
identity
```

Pre-flight success does not imply that the later assessment was violation-free.

## 0.24 Badges

Use:

```text
BADGE_DEFINITION
STUDENT_BADGE
```

Badges remain derived from real attempts/evidence.

Do not use a badge as the sole source of truth for assessment history.

## 0.25 Alumni and referrals

Use:

```text
ALUMNI_PROFILE
ALUMNI_EMPLOYMENT
REFERRAL_POST
REFERRAL_REQUEST
ALUMNI_CONNECTION_REQUEST
```

Student-to-alumni continuity must preserve the historical student linkage.

Referral requests reference the exact selected resume version where appropriate.

Conversations normally open only after workflow permission is satisfied.

## 0.26 Mentorship / mock interview booking — NEW

Use:

```text
MENTORSHIP_AVAILABILITY_SLOT
MENTORSHIP_BOOKING
```

for:

```text
career guidance
resume review
technical mock interview
system-design mock interview
team/role Q&A
```

Availability is not only a boolean on `ALUMNI_PROFILE`.

Capacity-sensitive mentorship slots must be transactionally booked.

## 0.27 Learning marketplace

Canonical entities:

```text
LEARNING_POST
LEARNING_RESOURCE
LEARNING_TAG
LEARNING_POST_TAG
LEARNING_POST_SKILL
LEARNING_REACTION
LEARNING_COMMENT
LEARNING_SAVE
```

Skill tags support TACIE recommendations from `SKILL_GAP_ITEM`.

User-generated learning content may be moderated.

## 0.28 Trust and rewards remain separate

Use:

```text
REPUTATION_EVENT
STUDENT_REPUTATION_SUMMARY
REWARD_TRANSACTION
```

Never implement:

```text
trust_score = reward_points
```

Trust = integrity/reputation.

Rewards = earned/redeemed point ledger.

## 0.29 Saved items — NEW

Use:

```text
SAVED_ITEM
```

for generic saved resources:

```text
JOB
LEARNING_POST
ALUMNI
REFERRAL_POST
ASSESSMENT
```

Saved/favorite state must never be confused with workflow state.

Examples:

```text
saved job != application
saved alumni != connection
saved referral != referral request
```

## 0.30 Student privacy preferences — NEW

Use:

```text
STUDENT_PRIVACY_PREFERENCE
```

Possible fields:

```text
recruiter_discovery_enabled
resume_visibility
alumni_connection_enabled
learning_profile_visibility
assessment_visibility
```

Again: preferences can restrict, never grant RBAC access.

## 0.31 Protected resource access audit — NEW

Use:

```text
DATA_ACCESS_AUDIT
```

for protected resource reads/downloads such as:

```text
resume viewed/downloaded
academic transcript viewed
assessment scorecard viewed
verified badge inspected
```

This is separate from mutation/admin `AUDIT_LOG`.

A typical record preserves:

```text
resource owner
actor
organization
resource + version
access type
authorization basis
purpose
IP/user-agent
access time
```

Do not claim GDPR/DPDP compliance solely because an access log exists. Prefer product wording like `Data Access & Privacy Audit` unless compliance review supports stronger claims.

## 0.32 Notifications — UPDATED

Use:

```text
NOTIFICATION
NOTIFICATION_DELIVERY
NOTIFICATION_PREFERENCE
```

Supported channels:

```text
IN_APP
EMAIL
WHATSAPP
SMS
PUSH
```

Some placement-critical notification types may be mandatory by policy and therefore not disable-able by students.

## 0.33 TACIE AI remains advisory

Canonical AI entities include:

```text
AI_RUN
AI_USAGE_RECORD
RESUME_ANALYSIS
CANDIDATE_SEARCH
CANDIDATE_MATCH_RUN
CANDIDATE_MATCH_RESULT
MARKET_SKILL_SNAPSHOT
SKILL_GAP_ANALYSIS
SKILL_GAP_ITEM
```

TACIE must never:

- change verified CGPA/backlogs
- bypass RBAC
- override placement policy
- override eligibility rules
- approve a referral
- accept an offer
- invent project/resume metrics
- silently rewrite verified data

`AI_USAGE_RECORD` is written only by the Node API after it calls the stateless
AI framework. The AI framework has no database credentials or persistence path.

## 0.34 AI credit/quota management — NEW

Use:

```text
AI_USAGE_QUOTA
AI_CREDIT_EVENT
```

Possible quota scopes:

```text
INSTITUTION
DEPARTMENT
USER
FEATURE
```

`AI_CREDIT_EVENT` should link the consumed credit to the `AI_RUN` where possible.

Quota enforcement is backend-side and concurrency-safe.

## 0.35 RAG and pgvector

Use:

```text
KNOWLEDGE_DOCUMENT
KNOWLEDGE_CHUNK
KNOWLEDGE_EMBEDDING
KNOWLEDGE_INGESTION_JOB
```

These live in the same college PostgreSQL database as the core application data.

`KNOWLEDGE_EMBEDDING.embedding` uses pgvector.

### Critical vector authorization rule

Correct:

```text
determine authorized resource/candidate pool
→ run vector similarity within authorized scope
```

Incorrect:

```text
vector search everything
→ remove unauthorized results afterward
```

## 0.36 Conversations and messages

Use one generic model:

```text
CONVERSATION
CONVERSATION_PARTICIPANT
CONVERSATION_CONTEXT
MESSAGE
MESSAGE_ATTACHMENT
MESSAGE_READ_RECEIPT
AI_MESSAGE_METADATA
MESSAGE_CITATION
```

Do not create unrelated `resume_chat`, `job_chat`, `alumni_chat`, etc. tables.

Use `conversation_type` instead.

## 0.37 Moderation

Use:

```text
MESSAGE_MODERATION
MESSAGE_REPORT
MODERATION_CASE
MODERATION_ACTION
```

Possible CareerOS-specific categories include:

```text
RESUME_FRAUD
FAKE_CREDENTIAL_REQUEST
FAKE_EXPERIENCE_REQUEST
ASSESSMENT_CHEATING
PROCTORING_EVASION
REFERRAL_PAYMENT
RECRUITER_IMPERSONATION
ACADEMIC_RECORD_TAMPERING
PLACEMENT_POLICY_EVASION
```

TPO/admin users must not casually browse private messages. A valid report/moderation/support basis is required.

## 0.38 Object storage

Store binaries in object storage, not normal relational columns:

```text
resume PDFs
certificates
offer letters
signed offer documents
chat attachments
proctor evidence
profile images
learning files
generated reports
```

Recommended prefix:

```text
tenants/{tenantId}/...
```

## 0.39 Current student UX contract

The finalized student UX maps to the model as follows:

```text
HOME
→ STUDENT_ACTION_ITEM
→ JOB_APPLICATION
→ JOB_OFFER
→ SKILL_GAP_ANALYSIS
→ NOTIFICATION

JOBS
→ JOB_OPPORTUNITY
→ PLACEMENT_DRIVE
→ DRIVE_DEPARTMENT
→ ELIGIBILITY_EVALUATION
→ PLACEMENT_POLICY

APPLICATIONS
→ JOB_APPLICATION
→ APPLICATION_STATUS_HISTORY
→ DRIVE_ROUND
→ STUDENT_ROUND_RESULT
→ JOB_OFFER

GROW / SKILLS
→ STUDENT_SKILL
→ SKILL_EVIDENCE
→ SKILL_GAP_ANALYSIS

RESUME
→ RESUME
→ RESUME_VERSION
→ RESUME_ANALYSIS
→ AI_RUN

ASSESSMENTS
→ ASSESSMENT
→ ASSESSMENT_SLOT
→ ASSESSMENT_SLOT_BOOKING
→ ASSESSMENT_ATTEMPT
→ PROCTOR_SESSION
→ STUDENT_BADGE

PEOPLE / ALUMNI
→ ALUMNI_PROFILE
→ REFERRAL_POST
→ REFERRAL_REQUEST
→ MENTORSHIP_AVAILABILITY_SLOT
→ MENTORSHIP_BOOKING

MESSAGES
→ CONVERSATION
→ MESSAGE
→ MESSAGE_MODERATION
→ AI_USAGE_QUOTA

MY CAREER / PROFILE
→ STUDENT_PROFILE
→ STUDENT_ACADEMIC_RECORD
→ STUDENT_CAREER_PROFILE
→ STUDENT_PROJECT

MY CAREER / PLACEMENT
→ PLACEMENT_POLICY
→ PLACEMENT_COMPLIANCE_EVENT
→ STUDENT_PLACEMENT_COMPLIANCE
→ JOB_OFFER
→ PLACEMENT_RECORD

MY CAREER / CONTRIBUTIONS
→ OPPORTUNITY_SUBMISSION
→ OPPORTUNITY_VERIFICATION
→ SUBMISSION_REVIEW
→ REPUTATION_EVENT
→ REWARD_TRANSACTION

MY CAREER / PRIVACY
→ STUDENT_PRIVACY_PREFERENCE
→ DATA_ACCESS_AUDIT
→ NOTIFICATION_PREFERENCE
```

## 0.40 Canonical new/updated entity inventory

The following entities are now mandatory additions to the model:

```text
ACADEMIC_EVENT
STUDENT_PRIVACY_PREFERENCE
STUDENT_REQUEST
STUDENT_ACTION_ITEM
PLACEMENT_COMPLIANCE_EVENT
STUDENT_PLACEMENT_COMPLIANCE
OFFER_COMPENSATION_COMPONENT
ASSESSMENT_SLOT
ASSESSMENT_SLOT_BOOKING
PROCTOR_PREFLIGHT
MENTORSHIP_AVAILABILITY_SLOT
MENTORSHIP_BOOKING
SAVED_ITEM
AI_USAGE_QUOTA
AI_CREDIT_EVENT
NOTIFICATION_PREFERENCE
USER_AGREEMENT
ARTIFACT_ATTESTATION
DATA_ACCESS_AUDIT
```

The following existing entities are materially expanded:

```text
STUDENT_PROJECT
JOB_OFFER
```

## 0.41 Production hard rules introduced by the final UX

1. A student UI role switch never grants TPO/Admin authority.
2. Student privacy settings only restrict visibility; they never grant access.
3. AI cannot fabricate achievements or quantitative resume metrics.
4. Eligibility and placement policy remain separate engines.
5. Policy simulation must use the same policy engine as production enforcement.
6. SLA/action items are distinct from notifications.
7. NOC/correction/reschedule workflows use `STUDENT_REQUEST`.
8. Compliance strikes use immutable event history.
9. Offer and placement outcome remain separate entities.
10. Legally/operationally meaningful acceptance is durably persisted via `USER_AGREEMENT`.
11. Cryptographic wording requires real `ARTIFACT_ATTESTATION` or equivalent evidence.
12. Capacity-sensitive assessment/mentorship bookings must be transactional.
13. Saved/favorite state never implies workflow state.
14. Protected resource read audit and mutation audit remain separate.
15. AI quota consumption is server-side and idempotent/concurrency-safe.
16. Chat/RAG/vector data stay in the same tenant PostgreSQL database.
17. Vector search occurs only after authorization scope is resolved.
18. Binaries remain in object storage.
19. Background jobs/events must carry trusted `tenant_id` context.
20. Cache keys for shared cache infrastructure must be tenant-prefixed.

## 0.42 Quick reference — current canonical entities

### Control Plane

```text
TENANT
TENANT_DATABASE
TENANT_PROVISIONING_JOB
SUBSCRIPTION
GLOBAL_USER
TENANT_MEMBERSHIP
PLATFORM_ADMIN
```

### Tenant IAM / Organization

```text
INSTITUTION
DEPARTMENT
DEPARTMENT_SETTINGS
PROGRAM
COHORT
USER
ROLE
PERMISSION
ROLE_PERMISSION
ROLE_ASSIGNMENT
```

### Student

```text
STUDENT_PROFILE
STUDENT_ACADEMIC_MEMBERSHIP
STUDENT_ACADEMIC_RECORD
STUDENT_CAREER_PROFILE
ACADEMIC_EVENT
STUDENT_PRIVACY_PREFERENCE
STUDENT_REQUEST
STUDENT_ACTION_ITEM
SKILL
STUDENT_SKILL
SKILL_EVIDENCE
RESUME
RESUME_VERSION
STUDENT_PROJECT
PROJECT_SKILL
```

### Placement / Hiring

```text
COMPANY
COMPANY_CONTACT
RECRUITER_PROFILE
PLACEMENT_SEASON
CRM_PIPELINE
CRM_ACTIVITY
RECRUITMENT_VISIT
JOB_OPPORTUNITY
JOB_DESCRIPTION_VERSION
OPPORTUNITY_SUBMISSION
OPPORTUNITY_VERIFICATION
SUBMISSION_REVIEW
PLACEMENT_DRIVE
DRIVE_ROUND
DRIVE_DEPARTMENT
ELIGIBILITY_RULE_SET
ELIGIBILITY_EVALUATION
JOB_APPLICATION
APPLICATION_STATUS_HISTORY
STUDENT_ROUND_RESULT
PLACEMENT_POLICY
PLACEMENT_POLICY_RULE
PLACEMENT_TIER
JOB_OFFER
OFFER_COMPENSATION_COMPONENT
PLACEMENT_RECORD
PLACEMENT_COMPLIANCE_EVENT
STUDENT_PLACEMENT_COMPLIANCE
USER_AGREEMENT
ARTIFACT_ATTESTATION
```

### Assessment

```text
ASSESSMENT
ASSESSMENT_QUESTION
ASSESSMENT_ASSIGNMENT
ASSESSMENT_ATTEMPT
ASSESSMENT_RESPONSE
ASSESSMENT_SLOT
ASSESSMENT_SLOT_BOOKING
PROCTOR_SESSION
PROCTOR_EVENT
PROCTOR_PREFLIGHT
BADGE_DEFINITION
STUDENT_BADGE
```

### Alumni

```text
ALUMNI_PROFILE
ALUMNI_EMPLOYMENT
REFERRAL_POST
REFERRAL_REQUEST
ALUMNI_CONNECTION_REQUEST
MENTORSHIP_AVAILABILITY_SLOT
MENTORSHIP_BOOKING
```

### Learning / Trust

```text
LEARNING_POST
LEARNING_RESOURCE
LEARNING_TAG
LEARNING_POST_TAG
LEARNING_POST_SKILL
LEARNING_REACTION
LEARNING_COMMENT
LEARNING_SAVE
REPUTATION_EVENT
STUDENT_REPUTATION_SUMMARY
REWARD_TRANSACTION
SAVED_ITEM
```

### AI / RAG

```text
AI_RUN
AI_USAGE_RECORD
RESUME_ANALYSIS
CANDIDATE_SEARCH
CANDIDATE_MATCH_RUN
CANDIDATE_MATCH_RESULT
MARKET_SKILL_SNAPSHOT
SKILL_GAP_ANALYSIS
SKILL_GAP_ITEM
AI_USAGE_QUOTA
AI_CREDIT_EVENT
KNOWLEDGE_DOCUMENT
KNOWLEDGE_CHUNK
KNOWLEDGE_EMBEDDING
KNOWLEDGE_INGESTION_JOB
```

### Communication / Moderation

```text
CONVERSATION
CONVERSATION_PARTICIPANT
CONVERSATION_CONTEXT
MESSAGE
MESSAGE_ATTACHMENT
MESSAGE_READ_RECEIPT
AI_MESSAGE_METADATA
MESSAGE_CITATION
MESSAGE_MODERATION
MESSAGE_REPORT
MODERATION_CASE
MODERATION_ACTION
NOTIFICATION
NOTIFICATION_DELIVERY
NOTIFICATION_PREFERENCE
```

### Integration / Audit

```text
INTEGRATION_CONNECTION
SYNC_JOB
EXTERNAL_ID_MAPPING
AUDIT_LOG
DATA_ACCESS_AUDIT
```

## 0.43 Agent test additions required by the final UX

Every relevant implementation must test:

```text
student cannot become TPO through client state
privacy setting cannot grant recruiter access
NOC/correction review requires correct scope
duplicate action completion is idempotent
strike reversal leaves immutable history
policy simulator matches actual enforcement
application preserves exact resume version
offer acceptance is idempotent
compensation components remain tied to offer
assessment last-seat booking cannot overbook
mentorship last-slot booking cannot overbook
preflight does not equal proctor result
AI rewrite cannot add unsupported metrics
AI quota cannot be bypassed by concurrent requests
vector search cannot retrieve unauthorized students
data downloads create DATA_ACCESS_AUDIT where required
admin mutations create AUDIT_LOG
saved job does not create application
saved alumnus does not create connection
```

## 0.44 Updated implementation priorities

Recommended order from the finalized product model:

```text
1. tenant control plane + DB routing + migrations
2. IAM/RBAC + institution hierarchy
3. verified student profile + career profile
4. skills/evidence + projects + resume versioning
5. companies/jobs/drives/eligibility/policy
6. applications/rounds
7. student requests + action queue + compliance
8. offers + compensation + placement outcomes
9. assessments + slots + proctoring + badges
10. alumni/referrals + mentorship booking
11. learning + submissions + reputation/rewards
12. notifications/preferences + privacy/access audit
13. TACIE/RAG/pgvector + AI quotas
14. moderation + enterprise operational controls
```

## 0.45 Final decision rule

When uncertain, prefer the design that maximizes:

```text
tenant isolation
authorization clarity
historical traceability
source/version traceability
evidence provenance
auditability
explicit lifecycle state
idempotency
future configurability
data ownership clarity
```

and minimizes:

```text
frontend-enforced security
hardcoded workflow
destructive updates
cross-tenant dependencies
duplicate sources of truth
unexplained AI decisions
unverified claims
implicit state transitions
```

---

## 1. Purpose of This File

This file is the canonical engineering context for the College Placement Management Platform.

The platform should be treated as a **multi-tenant College Placement ERP + Applicant Tracking System + Student Career Identity Platform + Trust/Verification Platform + Alumni Mentorship and Referral Network**.

This document is intended for:

- AI coding agents
- backend engineers
- frontend engineers
- data engineers
- architects
- QA engineers
- DevOps engineers
- product engineers

Any agent modifying this repository should read this file before changing domain logic, database structures, authorization rules, placement workflows, verification logic, or AI-related behavior.

The goal is to prevent local implementation decisions from breaking important global invariants such as tenant isolation, identity continuity, scoped access, verification traceability, recruiter access boundaries, and placement workflow consistency.

---

# 2. Product Overview

The platform manages the full placement lifecycle of a college.

Its major actors are:

1. Students
2. Alumni
3. Department TPOs
4. Central TPOs
5. College administrators
6. Temporary recruiters
7. Platform administrators/operators

The system must support:

- complete tenant isolation between colleges
- student profile and career portfolio management
- student-submitted off-campus opportunities
- automated web verification of opportunities
- TPO approval/rejection
- student reputation/genuineness tracking
- recruiter placement drives
- dynamic job eligibility rules
- job applications
- AI resume tailoring
- AI job-readiness assessment
- recruiter candidate recommendations
- configurable hiring pipelines
- interview and stage evaluations
- placement outcomes
- alumni mentorship
- alumni referrals
- TPO verification badges
- college-level administration and revocation
- detailed audit trails

---

# 3. Core Architectural Principle: Database Per College

The most important architectural constraint is:

> **Every college must have its own isolated operational database and independent database credentials.**

The system must not use one shared tenant table-space where private college data is separated only by a `tenant_id` column.

`database-per-college` does **not** require `database-server-per-college`.

At lower infrastructure tiers, multiple college databases may share the same PostgreSQL server/cluster while remaining isolated through:

- separate databases
- separate database roles/users
- separate credentials
- tenant-aware connection routing
- least-privilege grants
- independent migration/version tracking

Large or enterprise tenants may later be moved to dedicated PostgreSQL infrastructure without changing the application-level tenancy model.

The high-level architecture is:

```text
Platform Control Plane
        |
        +---- Tenant Registry
        +---- Database Secret References
        +---- Tenant Status
        +---- Domain Routing
        +---- Feature Flags
        +---- Schema Versions
        |
        +---- College A Database
        +---- College B Database
        +---- College C Database
```

Each college database contains only data belonging to that college.

Private student, recruiter, application, placement, alumni, TPO, and verification data must never be stored in a shared cross-college database.

---

# 4. Control Plane vs Tenant Plane

## 4.1 Control Plane

The control plane is a small platform-level database.

It may contain:

### `tenants`

Represents a college tenant.

Suggested fields:

```text
id                  UUID PK
name                VARCHAR
slug                VARCHAR UNIQUE
status              ENUM
primary_domain      VARCHAR
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Suggested status values:

```text
ONBOARDING
ACTIVE
SUSPENDED
DISABLED
ARCHIVED
```

### `tenant_domains`

Maps custom or platform domains to tenants.

```text
id
tenant_id
domain
is_primary
verified_at
```

### `tenant_database_configs`

Contains connection metadata.

Important rule:

> Never store plain-text database credentials directly in application tables.

Prefer:

```text
tenant_id
database_identifier
region
secret_reference
status
```

Example:

```text
secret_reference =
aws-secrets-manager://career-platform/tenants/<tenant-id>/database
```

### `tenant_features`

Controls optional modules.

Examples:

```text
AI_RESUME_TAILORING
AI_READINESS
ALUMNI_NETWORK
PUBLIC_OPPORTUNITY_SHARING
ADVANCED_ANALYTICS
RECRUITER_PORTAL
```

### `schema_versions`

Tracks migration state for each tenant DB.

---

## 4.2 Tenant Plane

Each tenant DB contains the complete private operational dataset for one college.

Recommended PostgreSQL logical schemas:

```text
iam
organization
student
trust
placement
hiring
ai
alumni
communication
audit
configuration
```

Agents should prefer adding entities to the correct domain schema instead of putting all tables in `public`.

---

# 5. Tenant Resolution

Every authenticated request must resolve the tenant before any operational DB query occurs.

Typical resolution sources may include:

- subdomain
- custom domain
- authenticated tenant claim
- API gateway routing metadata
- trusted backend-to-backend request context

Example:

```text
sitrc.example.com
    ->
tenant_id = T123
    ->
load secret_reference for T123
    ->
connect to SITRC database
```

Never trust a client-supplied arbitrary database identifier.

Never allow a user to switch tenants merely by passing another tenant ID.

---

# 6. Tenant Isolation Invariants

The following rules are non-negotiable.

1. A student's personal data must exist only in their college database.
2. A recruiter attached to College A must never automatically gain access to College B data.
3. A cross-tenant search must not directly query student tables from multiple tenant DBs.
4. Private data must never be copied into the platform control plane.
5. Public sharing must use sanitized derived records.
6. Backups must preserve tenant boundaries.
7. Logs must avoid unnecessarily exposing private student data.
8. Database credentials must be independently rotatable per tenant.
9. Tenant migration jobs must run independently.
10. Test code must include tenant-leakage tests.

---

# 7. Public Opportunity Catalog

If an approved job should become visible outside the originating college, do not query the originating college database directly from the public portal.

Instead, publish a sanitized projection into a shared public catalog.

Possible entity:

### `public_opportunities`

```text
id
origin_tenant_id
origin_job_id
company_name
role_title
description_public
job_url
location
employment_type
deadline
published_at
expires_at
status
```

Must not contain:

- student identity
- submitting student identity
- TPO identity
- applicant data
- internal review comments
- college-private notes
- verification raw payloads
- internal reputation events

---

# 8. Identity Model

A central domain decision is:

> A person is not the same thing as a role.

Do not create unrelated identities for:

- student
- alumni
- TPO
- administrator

Instead create a permanent `PERSON` identity and attach profiles and roles.

---

# 9. Person Entity

### `iam.people`

Represents the long-lived human identity.

Suggested fields:

```text
id                  UUID PK
first_name          VARCHAR
middle_name         VARCHAR NULL
last_name           VARCHAR
primary_email       VARCHAR
phone               VARCHAR NULL
avatar_url          VARCHAR NULL
status              ENUM
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Status examples:

```text
ACTIVE
INACTIVE
SUSPENDED
ARCHIVED
```

Important:

A person can have multiple roles during their lifetime.

Example:

```text
2022-2026 -> STUDENT
2026+     -> ALUMNI
```

The person record must remain stable.

---

# 10. Account Entity

### `iam.accounts`

Authentication should be separate from domain identity.

Suggested fields:

```text
id
person_id
auth_provider
auth_provider_subject
account_status
last_login_at
created_at
updated_at
```

Possible providers:

```text
INTERNAL
GOOGLE
MICROSOFT
COLLEGE_SSO
```

One person may theoretically have multiple authentication methods.

---

# 11. Role Model

Roles must be represented independently.

### `iam.roles`

Examples:

```text
COLLEGE_ADMIN
CENTRAL_TPO
DEPARTMENT_TPO
TPO_ASSISTANT
STUDENT
ALUMNI
RECRUITER
```

### `iam.role_assignments`

Suggested fields:

```text
id
person_id
role_id
scope_type
scope_id
valid_from
valid_until
status
granted_by
created_at
updated_at
```

Suggested scope types:

```text
COLLEGE
DEPARTMENT
PLACEMENT_DRIVE
SELF
CUSTOM_RESOURCE
```

Example:

```text
person = TPO_001
role = DEPARTMENT_TPO
scope_type = DEPARTMENT
scope_id = COMPUTER_ENGINEERING
```

Another example:

```text
person = TPO_010
role = CENTRAL_TPO
scope_type = COLLEGE
scope_id = CURRENT_TENANT
```

---

# 12. Resource Access Grants

Role-based authorization alone is not enough for temporary recruiters.

Use explicit access grants where needed.

### `iam.resource_access_grants`

Suggested fields:

```text
id
principal_type
principal_id
resource_type
resource_id
permission
valid_from
valid_until
status
granted_by
created_at
```

Examples:

```text
RECRUITER -> PLACEMENT_DRIVE -> VIEW_CANDIDATES
RECRUITER -> JOB -> SHORTLIST
RECRUITER -> JOB -> UPDATE_HIRING_STAGE
```

Temporary recruiter access must expire automatically.

---

# 13. College Organization Model

## 13.1 Department

### `organization.departments`

```text
id
name
code
status
created_at
updated_at
```

Examples:

```text
Computer Engineering
Mechanical Engineering
Civil Engineering
Electrical Engineering
```

---

## 13.2 Program

### `organization.programs`

```text
id
department_id
name
degree_type
duration_years
status
```

Examples:

```text
B.E. Computer Engineering
B.Tech Information Technology
M.E. Computer Engineering
```

---

## 13.3 Academic Batch

### `organization.academic_batches`

```text
id
program_id
start_year
graduation_year
label
status
```

Example:

```text
2022-2026
```

---

# 14. Student Profile

### `student.student_profiles`

This table contains administrative and academic-placement identity fields.

Do not put all portfolio content here.

Suggested fields:

```text
id
person_id
department_id
program_id
batch_id
prn
roll_number
admission_year
graduation_year
cgpa
active_backlogs
placement_status
profile_completion_percentage
created_at
updated_at
```

Possible placement statuses:

```text
NOT_REGISTERED
AVAILABLE
NOT_ELIGIBLE
APPLYING
PLACED
HIGHER_STUDIES
ENTREPRENEURSHIP
OPTED_OUT
```

---

# 15. Student Career Profile

### `student.career_profiles`

Contains student-facing professional identity.

Suggested fields:

```text
id
student_id
headline
bio
career_objective
preferred_roles
preferred_locations
profile_visibility
verification_level
reputation_score_cached
created_at
updated_at
```

The career profile is the aggregate root for:

- skills
- projects
- achievements
- certifications
- external coding profiles
- internships
- experiences
- learning journal
- resumes
- verified claims

---

# 16. Student Skills

### `student.student_skills`

```text
id
career_profile_id
skill_name
skill_category
proficiency
years_of_experience
is_verified
created_at
updated_at
```

Categories may include:

```text
TECHNICAL
SOFT_SKILL
MANAGEMENT
LANGUAGE
DOMAIN
TOOL
```

---

# 17. Student Projects

### `student.student_projects`

Suggested fields:

```text
id
career_profile_id
title
description
role
start_date
end_date
repository_url
live_url
technology_stack
visibility
created_at
updated_at
```

Projects may later produce verification claims.

---

# 18. Certifications

### `student.certifications`

```text
id
career_profile_id
title
issuer
credential_id
credential_url
issued_at
expires_at
verification_status
created_at
updated_at
```

Never use `verification_status` alone as proof.

Verification history should remain in the generic trust subsystem.

---

# 19. Achievements

### `student.achievements`

Examples:

- hackathon wins
- scholarship
- coding contest rank
- research publication
- leadership recognition
- college award

Fields:

```text
id
career_profile_id
achievement_type
title
description
issuer
achieved_at
evidence_url
verification_status
```

---

# 20. Experiences

Recommended entity:

### `student.experiences`

```text
id
career_profile_id
experience_type
organization_name
role_title
description
start_date
end_date
is_current
verification_status
```

Experience types:

```text
INTERNSHIP
FULL_TIME
PART_TIME
FREELANCE
VOLUNTEER
RESEARCH
```

---

# 21. External Profiles

### `student.external_profiles`

Supported examples:

```text
GITHUB
LEETCODE
HACKERRANK
CODECHEF
CODEFORCES
LINKEDIN
PORTFOLIO
KAGGLE
```

Fields:

```text
id
career_profile_id
platform
username
profile_url
external_identifier
verification_status
last_synced_at
```

---

# 22. External Profile Snapshots

Never overwrite historical external metrics if trend analytics matter.

### `student.external_profile_snapshots`

```text
id
external_profile_id
metrics JSONB
captured_at
```

Example GitHub snapshot:

```json
{
  "public_repositories": 42,
  "followers": 18,
  "contributions_last_year": 712
}
```

Example LeetCode snapshot:

```json
{
  "total_solved": 534,
  "easy_solved": 212,
  "medium_solved": 276,
  "hard_solved": 46,
  "contest_rating": 1782
}
```

---

# 23. Learning Journal

Students can record daily progress.

### `student.learning_journal_entries`

Suggested fields:

```text
id
career_profile_id
entry_date
work_done
learned_today
challenges
next_steps
visibility
created_at
updated_at
```

Potential visibility values:

```text
PRIVATE
TPO_ONLY
RECRUITER
COLLEGE
PUBLIC
```

This feature should be treated as optional portfolio enrichment, not mandatory placement eligibility.

---

# 24. Resume Model

## 24.1 Resume

### `student.resumes`

Represents a logical resume.

```text
id
student_id
title
is_primary
status
created_at
updated_at
```

---

## 24.2 Resume Version

### `student.resume_versions`

Every important resume revision should be versioned.

```text
id
resume_id
version_number
storage_url
structured_content JSONB
source_type
created_at
```

Source types:

```text
UPLOADED
EDITOR_CREATED
AI_GENERATED
IMPORTED
```

The student's master resume must never be overwritten by AI tailoring.

---

# 25. Student Claims Model

A strong product principle is:

> Student-entered information is a claim until sufficiently verified.

### `trust.student_claims`

Suggested fields:

```text
id
student_id
claim_type
title
description
value JSONB
source
status
created_at
updated_at
```

Possible claim types:

```text
ACADEMIC
CERTIFICATION
ACHIEVEMENT
EXPERIENCE
PROJECT
SKILL
GITHUB
LEETCODE
EMPLOYMENT
AWARD
IDENTITY
```

Statuses:

```text
DRAFT
SUBMITTED
UNDER_VERIFICATION
VERIFIED
REJECTED
EXPIRED
REVOKED
```

---

# 26. Claim Evidence

### `trust.claim_evidence`

```text
id
claim_id
evidence_type
evidence_url
metadata JSONB
hash
created_at
```

Evidence types:

```text
DOCUMENT
URL
API_RESPONSE
CERTIFICATE
SCREENSHOT
GITHUB
LEETCODE
COLLEGE_RECORD
EXTERNAL_PROVIDER
```

A claim may have multiple evidence records.

---

# 27. Generic Verification Engine

Verification should be modeled as a reusable platform capability.

Do not create entirely unrelated verification frameworks for every entity.

### `trust.verification_requests`

Suggested fields:

```text
id
subject_type
subject_id
verification_type
status
confidence_score
requested_by
reviewer_id
result JSONB
reason
created_at
started_at
completed_at
expires_at
```

Possible subjects:

```text
STUDENT_CLAIM
STUDENT_PROFILE
CERTIFICATION
PROJECT
EXPERIENCE
JOB_OPPORTUNITY
COMPANY
ALUMNI_PROFILE
EXTERNAL_PROFILE
```

Verification types:

```text
AUTOMATED
WEB
API
DOCUMENT
TPO
ADMIN
THIRD_PARTY
```

Verification statuses:

```text
PENDING
IN_PROGRESS
VERIFIED
REJECTED
NEEDS_REVIEW
EXPIRED
REVOKED
ERROR
```

---

# 28. Verified Student Badge

Do not use one boolean such as:

```text
student.is_verified = true
```

A student's visible verification status should be derived from verification evidence.

Possible badge dimensions:

```text
IDENTITY_VERIFIED
ACADEMIC_VERIFIED
CAREER_PROFILE_VERIFIED
CERTIFICATIONS_VERIFIED
DEPARTMENT_VERIFIED
COLLEGE_VERIFIED
```

A UI badge may represent an aggregate result, but the underlying evidence must remain auditable.

---

# 29. Genuineness / Reputation System

Student reputation must use an event ledger.

Do not directly mutate an unexplained numeric score.

### `trust.reputation_events`

Suggested fields:

```text
id
student_id
event_type
reference_type
reference_id
score_delta
reason
created_by
created_at
```

Example events:

```text
VALID_OPPORTUNITY_SUBMISSION          +5
TPO_CONFIRMED_OPPORTUNITY             +8
FALSE_OPPORTUNITY                     -15
FAKE_CERTIFICATE                      -30
VERIFIED_CLAIM                         +3
CONFIRMED_SPAM                        -10
MANUAL_CORRECTION                     variable
```

The current score may be cached on `career_profiles`, but the ledger is the source of truth.

Suggested formula:

```text
current_reputation_score =
SUM(reputation_events.score_delta)
```

The exact weighting should remain configurable.

---

# 30. Reputation Rules

Important rules:

1. Reputation should not be the sole determinant of recruiter ranking.
2. A rejected opportunity should only reduce score after appropriate review.
3. Reputation changes must be auditable.
4. Corrections must be represented as compensating events, not deleted history.
5. Student-facing UI should explain material penalties.
6. TPO/admin manual changes require a reason.
7. Sensitive automatic penalties should support review/appeal.

---

# 31. Student-Submitted Opportunity Flow

The canonical flow is:

```text
Student Submission
      |
      v
Automated Web Verification
      |
      +---- invalid/fraud ----------> Rejected
      |
      v
TPO Review
      |
      +---- More Information Required
      |
      +---- Rejected ---------------> Reputation Event
      |
      v
Approved
      |
      v
Job Posting
      |
      +---- optional sanitized publish
             to Public Opportunity Catalog
```

---

# 32. Opportunity Submission Entity

### `placement.opportunity_submissions`

Suggested fields:

```text
id
submitted_by_student_id
company_name
job_title
job_url
source_url
description
location
employment_type
deadline
status
created_at
updated_at
```

Statuses:

```text
DRAFT
SUBMITTED
WEB_VERIFYING
WEB_VERIFIED
WEB_REJECTED
TPO_PENDING
MORE_INFO_REQUIRED
APPROVED
REJECTED
PUBLISHED
ARCHIVED
```

---

# 33. Opportunity Automated Verification

### `placement.opportunity_verification_runs`

Suggested fields:

```text
id
submission_id
source_accessible
company_verified
job_page_verified
domain_reputation
duplicate_probability
fraud_probability
confidence_score
raw_result JSONB
started_at
completed_at
```

Important:

Automated verification does not have final authority.

Its purpose is to support the human TPO decision.

---

# 34. Opportunity TPO Review

### `placement.opportunity_tpo_reviews`

```text
id
submission_id
reviewer_tpo_id
decision
remarks
created_at
```

Possible decisions:

```text
APPROVED
REJECTED
MORE_INFO_REQUIRED
ESCALATED
```

An approved submission may create a `job_posting`.

Keep the submission record permanently linked to the resulting job.

---

# 35. Company Model

### `placement.companies`

Companies should be long-lived entities.

Examples:

```text
Amazon
Microsoft
Google
Infosys
TCS
```

Suggested fields:

```text
id
name
legal_name
website
industry
company_size
headquarters
verification_status
created_at
updated_at
```

Do not recreate the same company for every placement drive.

---

# 36. Placement Drive

### `placement.placement_drives`

A placement drive represents a hiring engagement between a company and the college.

Suggested fields:

```text
id
company_id
title
description
academic_year
drive_type
status
starts_at
ends_at
registration_deadline
created_by
created_at
updated_at
```

Possible statuses:

```text
DRAFT
SCHEDULED
REGISTRATION_OPEN
ACTIVE
COMPLETED
CANCELLED
ARCHIVED
```

A placement drive may have multiple jobs.

---

# 37. Recruiter Temporary Profiles

Recruiter identities should usually be placement-drive scoped.

### `placement.recruiter_access`

Suggested fields:

```text
id
placement_drive_id
company_id
recruiter_name
recruiter_email
account_id NULL
invited_by_tpo_id
starts_at
expires_at
status
created_at
updated_at
```

Statuses:

```text
INVITED
ACTIVE
EXPIRED
REVOKED
```

Recruiter access must expire automatically.

Recruiters must not gain permanent college-wide access merely because they participated in one drive.

---

# 38. Recruiter Permissions

Possible recruiter permissions:

```text
VIEW_RECOMMENDED_STUDENTS
VIEW_ALLOWED_STUDENT_PROFILE
VIEW_APPLICATIONS
SHORTLIST
REJECT
CREATE_HIRING_STAGES
UPDATE_CANDIDATE_STAGE
ADD_EVALUATION
SCHEDULE_INTERVIEW
CREATE_OFFER
VIEW_DRIVE_ANALYTICS
```

Permissions must be restricted to their allowed drive/job resources.

---

# 39. Job Posting

### `placement.job_postings`

A job may originate from different sources.

Suggested fields:

```text
id
placement_drive_id NULL
company_id
source_type
source_reference_id NULL
title
description
employment_type
work_mode
location
minimum_package
maximum_package
currency
application_deadline
status
created_by
created_at
updated_at
```

Source types:

```text
RECRUITER
TPO
STUDENT_OPPORTUNITY
ALUMNI
ADMIN
EXTERNAL_IMPORT
```

Job statuses:

```text
DRAFT
PENDING_APPROVAL
OPEN
CLOSED
CANCELLED
COMPLETED
ARCHIVED
```

---

# 40. Job Eligibility Rule Engine

Do not put every eligibility condition as a column on `job_postings`.

Use rule sets.

### `placement.eligibility_rule_sets`

```text
id
job_id
name
version
status
created_at
```

### `placement.eligibility_rules`

```text
id
rule_set_id
attribute
operator
expected_value JSONB
group_number
mandatory
failure_message
created_at
```

Supported operators may include:

```text
=
!=
>
>=
<
<=
IN
NOT_IN
CONTAINS
NOT_CONTAINS
BETWEEN
EXISTS
NOT_EXISTS
```

Example:

```text
attribute          operator      expected_value

cgpa               >=            7.5
active_backlogs    =             0
department         IN            ["CS", "IT"]
graduation_year    =             2027
skill              CONTAINS      "Java"
```

---

# 41. Eligibility Rules Must Be Versioned

Applications must record the eligibility rules used at application time.

A later change to job eligibility must not rewrite historical application decisions.

Store:

- rule set version
- evaluation timestamp
- evaluated input snapshot
- criteria results

---

# 42. Job Application

### `placement.job_applications`

Suggested fields:

```text
id
job_id
student_id
status
source
applied_at
withdrawn_at
created_at
updated_at
```

Application statuses:

```text
ELIGIBILITY_CHECK
INELIGIBLE
ELIGIBLE
DRAFT
APPLIED
SHORTLISTED
IN_PROCESS
SELECTED
REJECTED
WITHDRAWN
OFFERED
JOINED
```

The application is one of the most important aggregate roots.

Most job-specific student workflow data should reference `application_id`.

---

# 43. Application Eligibility Evaluation

### `ai.eligibility_evaluations`

Suggested fields:

```text
id
application_id
rule_set_id
rule_set_version
eligible
criteria_results JSONB
input_snapshot JSONB
evaluated_at
```

Example `criteria_results`:

```json
[
  {
    "attribute": "cgpa",
    "expected": ">= 7.5",
    "actual": 8.4,
    "result": "PASS"
  },
  {
    "attribute": "active_backlogs",
    "expected": "= 0",
    "actual": 0,
    "result": "PASS"
  }
]
```

---

# 44. Application Flow

Canonical flow:

```text
Student opens job
      |
      v
Eligibility evaluation
      |
      +---- fail ----> Ineligible
      |
      v
Eligible
      |
      +---- AI resume tailoring
      |
      +---- AI readiness assessment
      |
      v
Student reviews
      |
      v
Application submitted
      |
      v
Recruiter/TPO hiring workflow
```

---

# 45. AI Resume Tailoring

AI-generated resumes must be treated as derived versions.

Never overwrite the student's primary resume.

### `ai.tailored_resumes`

Suggested fields:

```text
id
application_id
student_id
job_id
base_resume_version_id
generated_content JSONB
changes_summary JSONB
model_provider
model_name
model_version
prompt_version
student_approved
created_at
```

The student should approve the generated resume before submission whenever the product flow requires it.

---

# 46. AI Resume Tailoring Rules

1. Never fabricate experience.
2. Never fabricate certifications.
3. Never fabricate projects.
4. Never change academic scores.
5. Rewording and prioritization are allowed.
6. Tailoring must use verified/student-provided source data.
7. AI-generated additions must remain traceable.
8. Model and prompt versions should be stored.
9. The student's master resume remains unchanged.

---

# 47. Job Readiness Assessment

### `ai.job_readiness_assessments`

Suggested fields:

```text
id
student_id
job_id
application_id
overall_score
skills_score
project_score
experience_score
coding_score
resume_score
communication_score
strengths JSONB
gaps JSONB
recommendations JSONB
model_provider
model_name
model_version
prompt_version
created_at
```

Possible score dimensions:

```text
technical_match
skills_match
project_relevance
experience_match
coding_readiness
resume_match
communication_readiness
academic_match
```

---

# 48. AI Job Readiness Rules

The readiness result is advisory.

It must not silently become an irreversible rejection mechanism unless explicitly configured and governed.

Store explanations.

Keep model versioning.

Avoid protected/sensitive personal attributes.

---

# 49. Candidate Recommendation Engine

Recruiter recommendations answer:

> Which eligible candidates should the recruiter review first?

This differs from:

> How ready is this individual student for this job?

Recommended entities:

### `ai.candidate_recommendation_runs`

```text
id
job_id
model_version
configuration JSONB
created_at
```

### `ai.candidate_recommendations`

```text
id
recommendation_run_id
job_id
student_id
rank
recommendation_score
eligibility_score
skills_score
projects_score
readiness_score
verification_score
explanation JSONB
created_at
```

---

# 50. Recommendation Safety Rules

1. Do not use protected characteristics for ranking.
2. Do not directly rank on caste, religion, gender, health status, or similar sensitive traits.
3. Genuineness/reputation should not dominate candidate quality.
4. Verified data may increase confidence, not substitute for competency.
5. Recommendation explanations should be inspectable.
6. Recruiters/TPOs remain responsible for hiring decisions.
7. Historical model outputs should be reproducible where reasonably possible.

---

# 51. Recruiter-Facing Student Profile

Recruiters should not automatically receive unrestricted access to the raw student record.

Expose a recruiter-specific projection based on:

- job access
- placement drive access
- profile visibility settings
- consent/policy
- relevant verified claims

Potential public/recruiter profile sections:

```text
Name
Headline
Department
Program
Batch
CGPA if permitted
Verified badge
Skills
Featured projects
Experience
Certifications
Achievements
GitHub
LeetCode
Learning highlights
Resume
Job readiness summary
```

---

# 52. Profile Visibility

Recommended entity:

### `student.profile_visibility_settings`

```text
id
student_id
field_key
visibility
updated_at
```

Visibility values:

```text
PRIVATE
TPO_ONLY
RECRUITER
COLLEGE
PUBLIC
```

Sensitive fields should default to restrictive visibility.

---

# 53. Hiring Process

Each job may define a configurable hiring workflow.

### `hiring.hiring_processes`

Suggested fields:

```text
id
job_id
name
version
status
created_by
created_at
updated_at
```

Do not hardcode fixed fields such as:

```text
technical_round_status
hr_round_status
```

into applications.

---

# 54. Hiring Stages

### `hiring.hiring_stages`

Suggested fields:

```text
id
hiring_process_id
sequence
name
stage_type
configuration JSONB
is_elimination_stage
created_at
updated_at
```

Stage types:

```text
SCREENING
ASSESSMENT
CODING
APTITUDE
GROUP_DISCUSSION
INTERVIEW
TECHNICAL_INTERVIEW
MANAGERIAL
HR
DOCUMENT_VERIFICATION
CUSTOM
OFFER
```

Example hiring process:

```text
Application
  ->
Online Assessment
  ->
Coding Round
  ->
Technical Interview I
  ->
Technical Interview II
  ->
HR
  ->
Offer
```

Another company may use:

```text
Application
  ->
Group Discussion
  ->
Technical
  ->
HR
```

No schema change should be required.

---

# 55. Candidate Stage Records

### `hiring.candidate_stage_records`

Tracks one student's progress through one hiring stage.

Suggested fields:

```text
id
application_id
stage_id
status
score
remarks
entered_at
scheduled_at
completed_at
updated_by
```

Statuses:

```text
PENDING
SCHEDULED
IN_PROGRESS
PASSED
FAILED
ON_HOLD
SKIPPED
CANCELLED
```

---

# 56. Candidate Evaluations

### `hiring.candidate_evaluations`

Suggested fields:

```text
id
candidate_stage_record_id
evaluator_person_id
technical_score
communication_score
problem_solving_score
culture_score
overall_score
recommendation
feedback
created_at
```

Recommendation values:

```text
STRONG_HIRE
HIRE
NEUTRAL
NO_HIRE
STRONG_NO_HIRE
```

Evaluation templates may later become configurable.

---

# 57. Interview Scheduling

Recommended supporting entity:

### `hiring.interviews`

```text
id
application_id
stage_id
scheduled_at
duration_minutes
mode
location_or_link
status
created_by
created_at
updated_at
```

Modes:

```text
IN_PERSON
VIDEO
PHONE
HYBRID
```

---

# 58. Offer Model

### `hiring.offers`

Suggested fields:

```text
id
application_id
job_id
student_id
company_id
offer_type
package
currency
joining_date
offer_letter_url
status
issued_at
accepted_at
declined_at
```

Statuses:

```text
DRAFT
ISSUED
ACCEPTED
DECLINED
WITHDRAWN
EXPIRED
```

---

# 59. Placement Outcome

Placement outcome must be a first-class entity.

Do not infer final placement statistics only from application states.

### `placement.placement_outcomes`

Suggested fields:

```text
id
student_id
application_id
job_id
company_id
outcome_type
package
currency
joining_date
verification_status
created_at
updated_at
```

Outcome types:

```text
PLACED
INTERNSHIP
INTERNSHIP_PPO
PPO
OFF_CAMPUS_PLACED
HIGHER_STUDIES
ENTREPRENEURSHIP
```

This entity should power placement analytics.

---

# 60. Placement Analytics

Possible college/TPO metrics:

```text
eligible_students
placement_registered_students
placed_students
placement_percentage
department_placement_percentage
average_package
median_package
highest_package
company_wise_selections
role_wise_selections
batch_wise_placement
offer_acceptance_rate
application_conversion_rate
stage_conversion_rate
off_campus_success_rate
```

Avoid calculating analytics from mutable raw states when a stable outcome record exists.

---

# 61. Student to Alumni Transition

A student graduating must not receive a new unrelated identity.

Canonical transition:

```text
PERSON stays unchanged

STUDENT role:
ACTIVE -> EXPIRED/INACTIVE

ALUMNI role:
created -> ACTIVE

ALUMNI_PROFILE:
created for same PERSON
```

Historical student data must remain available according to college policy.

Applications, achievements, claims, projects, and placement outcomes remain connected to the original person.

---

# 62. Alumni Profile

### `alumni.alumni_profiles`

Suggested fields:

```text
id
person_id
department_id
program_id
graduation_year
current_company
current_role
linkedin_url
mentorship_enabled
referral_enabled
verification_status
created_at
updated_at
```

---

# 63. Alumni Employment History

Recommended entity:

### `alumni.employment_history`

```text
id
alumni_id
company_name
role_title
start_date
end_date
is_current
verification_status
```

This data may improve mentorship/referral discovery.

---

# 64. Mentorship Offering

### `alumni.mentorship_offerings`

Suggested fields:

```text
id
alumni_id
topic
description
max_mentees
availability JSONB
status
created_at
updated_at
```

Topics may include:

```text
DSA
SYSTEM_DESIGN
BACKEND
FRONTEND
AI
CAREER_GUIDANCE
HIGHER_STUDIES
INTERVIEW_PREP
RESUME_REVIEW
MANAGEMENT
ENTREPRENEURSHIP
```

---

# 65. Mentorship Request

### `alumni.mentorship_requests`

Suggested fields:

```text
id
student_id
alumni_id
offering_id NULL
topic
message
status
requested_at
responded_at
completed_at
```

Statuses:

```text
REQUESTED
ACCEPTED
DECLINED
ACTIVE
COMPLETED
CANCELLED
```

---

# 66. Referral Opportunity

### `alumni.referral_opportunities`

Suggested fields:

```text
id
alumni_id
company_id
role
job_url
description
eligibility JSONB
expires_at
status
created_at
```

Statuses:

```text
OPEN
CLOSED
EXPIRED
PAUSED
```

---

# 67. Referral Request

### `alumni.referral_requests`

Supports both:

1. Student responding to a posted referral opportunity
2. Student directly requesting a referral from an alumni

Suggested fields:

```text
id
student_id
alumni_id
referral_opportunity_id NULL
company_id
job_url
message
resume_version_id
status
requested_at
responded_at
```

Statuses:

```text
REQUESTED
ACCEPTED
DECLINED
REFERRED
EXPIRED
CANCELLED
```

---

# 68. TPO Responsibilities

Department TPOs typically manage:

- students within their department
- student verification
- opportunity review
- department placement data
- department-specific jobs
- student profile validation
- placement eligibility support
- recruiter coordination where allowed

Central TPOs typically manage:

- college-wide drives
- company relations
- cross-department jobs
- global placement policies
- recruiter invitations
- college analytics
- department TPO coordination
- escalations

Do not assume all TPOs have college-wide access.

---

# 69. College Admin Responsibilities

College admin may manage:

- users
- TPO assignments
- central TPO assignments
- department configuration
- programs
- batches
- recruiter access
- tenant configuration
- access revocation
- policy settings
- data governance
- audit review

College admin should not bypass audit logging.

Privileged administrative actions must be recorded.

---

# 70. Access Revocation

Revocation must be immediate where technically possible.

Examples:

```text
RECRUITER access revoked
TPO removed from department
Student account suspended
Alumni referral privileges removed
```

Revoking access should disable future authorization checks without deleting historical activity.

---

# 71. Notifications

Recommended entity:

### `communication.notifications`

```text
id
recipient_person_id
notification_type
title
body
reference_type
reference_id
read_at
created_at
```

Possible notifications:

```text
JOB_POSTED
JOB_DEADLINE
APPLICATION_SUBMITTED
APPLICATION_SHORTLISTED
APPLICATION_REJECTED
HIRING_STAGE_SCHEDULED
HIRING_STAGE_RESULT
OFFER_ISSUED
VERIFICATION_REQUESTED
VERIFICATION_COMPLETED
OPPORTUNITY_REVIEWED
MENTORSHIP_REQUEST
REFERRAL_REQUEST
```

---

# 72. Communication Preference

Recommended entity:

### `communication.notification_preferences`

```text
id
person_id
channel
notification_type
enabled
```

Channels may include:

```text
IN_APP
EMAIL
SMS
WHATSAPP
PUSH
```

Actual provider integrations should remain modular.

---

# 73. Audit Events

Audit logging is mandatory for sensitive flows.

### `audit.audit_events`

Suggested fields:

```text
id
actor_person_id NULL
actor_type
action
resource_type
resource_id
before_state JSONB
after_state JSONB
metadata JSONB
ip_address
user_agent
created_at
```

Examples:

```text
ADMIN_REVOKED_TPO
TPO_VERIFIED_STUDENT
TPO_REJECTED_OPPORTUNITY
RECRUITER_SHORTLISTED_STUDENT
RECRUITER_REJECTED_STUDENT
STUDENT_UPDATED_CLAIM
AI_GENERATED_RESUME
HIRING_STAGE_UPDATED
OFFER_ISSUED
STUDENT_WITHDREW_APPLICATION
```

---

# 74. Audit Rules

1. Audit events should be append-only.
2. Privileged actions must include actor identity.
3. Sensitive before/after snapshots should avoid secrets.
4. Audit records should not be silently deleted.
5. System-generated actions should identify the service/agent.
6. AI-triggered actions should identify the model workflow where relevant.

---

# 75. Suggested Event-Driven Architecture

The system may use domain events for asynchronous side effects.

Possible events:

```text
student.created
student.graduated
claim.submitted
claim.verified
claim.rejected
reputation.changed

opportunity.submitted
opportunity.web_verified
opportunity.approved
opportunity.rejected
job.published

application.created
application.eligible
application.ineligible
application.submitted

resume.tailoring_requested
resume.tailored

readiness.requested
readiness.completed

candidate.shortlisted
candidate.stage_changed

offer.issued
offer.accepted
placement.recorded

mentorship.requested
referral.requested
```

Event handlers must be idempotent.

---

# 76. Idempotency

Flows likely to be retried must support idempotency.

Examples:

- opportunity publishing
- recruiter invitation
- resume tailoring
- readiness assessment
- notification delivery
- public opportunity synchronization
- placement outcome creation
- external profile synchronization

Use idempotency keys where appropriate.

Never assume network callbacks occur exactly once.

---

# 77. Soft Delete vs Hard Delete

Prefer soft deletion or archival for entities with audit/historical importance.

Examples that usually should not be hard deleted:

- applications
- hiring evaluations
- offers
- placement outcomes
- verification results
- reputation events
- audit events

Hard deletion may be acceptable for:

- abandoned drafts
- temporary generated artifacts
- non-historical cache records

Final policy must comply with applicable retention/legal requirements.

---

# 78. Important Foreign-Key Relationships

Core relationships include:

```text
PERSON
  -> ACCOUNT
  -> ROLE_ASSIGNMENT
  -> STUDENT_PROFILE
  -> ALUMNI_PROFILE

DEPARTMENT
  -> PROGRAM
  -> STUDENT_PROFILE

PROGRAM
  -> ACADEMIC_BATCH
  -> STUDENT_PROFILE

STUDENT_PROFILE
  -> CAREER_PROFILE
  -> RESUME
  -> JOB_APPLICATION
  -> OPPORTUNITY_SUBMISSION
  -> REPUTATION_EVENT

CAREER_PROFILE
  -> SKILL
  -> PROJECT
  -> CERTIFICATION
  -> ACHIEVEMENT
  -> EXTERNAL_PROFILE
  -> LEARNING_JOURNAL

STUDENT_CLAIM
  -> CLAIM_EVIDENCE
  -> VERIFICATION_REQUEST

COMPANY
  -> PLACEMENT_DRIVE
  -> JOB_POSTING

PLACEMENT_DRIVE
  -> RECRUITER_ACCESS
  -> JOB_POSTING

JOB_POSTING
  -> ELIGIBILITY_RULE_SET
  -> JOB_APPLICATION
  -> HIRING_PROCESS

JOB_APPLICATION
  -> ELIGIBILITY_EVALUATION
  -> TAILORED_RESUME
  -> READINESS_ASSESSMENT
  -> CANDIDATE_STAGE_RECORD
  -> OFFER
  -> PLACEMENT_OUTCOME

HIRING_PROCESS
  -> HIRING_STAGE

HIRING_STAGE
  -> CANDIDATE_STAGE_RECORD

CANDIDATE_STAGE_RECORD
  -> CANDIDATE_EVALUATION

ALUMNI_PROFILE
  -> MENTORSHIP_OFFERING
  -> MENTORSHIP_REQUEST
  -> REFERRAL_OPPORTUNITY
  -> REFERRAL_REQUEST
```

---

# 79. Conceptual ER Relationship Diagram

```mermaid
flowchart TB

    PERSON["Person"]
    STUDENT["Student Profile"]
    ALUMNI["Alumni Profile"]
    TPO["TPO Role"]
    ADMIN["Admin Role"]

    PERSON --> STUDENT
    PERSON --> ALUMNI
    PERSON --> TPO
    PERSON --> ADMIN

    STUDENT --> CAREER["Career Profile"]
    CAREER --> CLAIMS["Claims"]
    CLAIMS --> VERIFY["Verification"]
    VERIFY --> TRUST["Verified Badge / Reputation"]

    STUDENT --> OPP["Opportunity Submission"]
    OPP --> WEB["Web Verification"]
    WEB --> TPOREV["TPO Review"]
    TPOREV --> JOB["Job Posting"]

    COMPANY["Company"] --> DRIVE["Placement Drive"]
    DRIVE --> JOB
    DRIVE --> RECRUITER["Temporary Recruiter"]

    STUDENT --> APP["Application"]
    JOB --> APP

    APP --> ELIG["Eligibility Evaluation"]
    APP --> RESUME["Tailored Resume"]
    APP --> READY["Readiness Assessment"]

    APP --> HIRING["Hiring Process"]
    HIRING --> STAGE["Hiring Stages"]
    STAGE --> EVAL["Evaluations"]
    EVAL --> OFFER["Offer"]
    OFFER --> OUTCOME["Placement Outcome"]

    ALUMNI --> MENTOR["Mentorship"]
    ALUMNI --> REFERRAL["Referral"]
    STUDENT --> MENTOR
    STUDENT --> REFERRAL
```

---

# 80. Domain Separation Principle

Agents must preserve these conceptual separations:

```text
Person != Student
Student != Career Profile
Career Profile != Claim
Claim != Verification
Verification != Reputation
Opportunity Submission != Job Posting
Company != Recruiter
Placement Drive != Job
Job != Application
Application != Hiring Process
Hiring Process != Hiring Stage
AI Assessment != Source of Truth
Role != Resource Access
Offer != Placement Outcome
Student != Alumni
```

These distinctions exist for long-term maintainability.

---

# 81. Avoid These Anti-Patterns

Do not:

### 81.1 Create one giant `students` table

Avoid columns such as:

```text
github_username
leetcode_score
certificate_1
certificate_2
project_1
project_2
resume_url
verified
job_1_status
job_2_status
```

Use normalized domain entities.

---

### 81.2 Create a new person when a student becomes alumni

Reuse the person identity.

---

### 81.3 Store recruiter access without expiration

Recruiter access should normally be drive-scoped and temporary.

---

### 81.4 Hardcode hiring rounds

Hiring processes must be configurable.

---

### 81.5 Hardcode eligibility columns into jobs

Use eligibility rules.

---

### 81.6 Let AI overwrite source-of-truth data

AI should create derived outputs.

---

### 81.7 Trust AI verification as final authority

High-impact verification should remain reviewable.

---

### 81.8 Store unexplained reputation score updates

Use reputation events.

---

### 81.9 Expose all student data to recruiters

Use scoped access and visibility projection.

---

### 81.10 Query tenant databases cross-college for public features

Publish sanitized derived data instead.

---

# 82. Recommended API Domain Boundaries

Possible REST API grouping:

```text
/api/v1/identity
/api/v1/organization
/api/v1/students
/api/v1/career
/api/v1/claims
/api/v1/verifications
/api/v1/reputation

/api/v1/opportunities
/api/v1/companies
/api/v1/placement-drives
/api/v1/jobs
/api/v1/applications

/api/v1/hiring
/api/v1/offers
/api/v1/outcomes

/api/v1/alumni
/api/v1/mentorship
/api/v1/referrals

/api/v1/ai
/api/v1/notifications
/api/v1/admin
/api/v1/audit
```

Actual implementation may be modular monolith or microservices.

Do not create microservices merely because domains exist.

---

# 83. Recommended Initial Architecture

For the first serious production version, a modular monolith is reasonable.

Suggested backend module structure:

```text
app/
  core/
    tenancy/
    auth/
    database/
    security/
    events/

  modules/
    identity/
    organization/
    students/
    career/
    trust/
    opportunities/
    companies/
    placement_drives/
    jobs/
    applications/
    hiring/
    ai/
    alumni/
    mentorship/
    referrals/
    notifications/
    audit/

  shared/
    enums/
    schemas/
    errors/
    utils/
```

Separate services later only where scaling or organizational needs justify it.

---

# 84. Transaction Boundaries

Use database transactions for state changes that must remain consistent.

Examples:

### Approving an opportunity

In one logical unit:

```text
mark opportunity APPROVED
create job posting
create positive reputation event if applicable
create audit event
enqueue publication event
```

The external publication itself may be asynchronous.

---

### Accepting offer

Possible logical unit:

```text
mark offer ACCEPTED
update application
create/update placement outcome
update student placement status
record audit event
emit placement.recorded
```

---

# 85. Concurrency Concerns

Agents should consider race conditions for:

- duplicate applications
- multiple recruiter stage updates
- offer acceptance
- placement outcome creation
- duplicate public job publication
- duplicate reputation events
- simultaneous TPO verification
- recruiter invite activation

Use:

- unique constraints
- optimistic version fields
- transactions
- idempotency keys
- status transition validation

---

# 86. Suggested Unique Constraints

Examples:

```text
people.primary_email
student_profiles.prn
student_profiles(person_id)
career_profiles(student_id)
alumni_profiles(person_id)

job_applications(job_id, student_id)

external_profiles(career_profile_id, platform)

placement_outcomes(application_id)

role_assignments(
  person_id,
  role_id,
  scope_type,
  scope_id,
  active period as applicable
)
```

Exact indexes depend on DB engine and product behavior.

---

# 87. Status Transition Validation

Do not allow arbitrary status updates.

Example application transition:

```text
DRAFT
  -> ELIGIBILITY_CHECK

ELIGIBILITY_CHECK
  -> ELIGIBLE
  -> INELIGIBLE

ELIGIBLE
  -> APPLIED

APPLIED
  -> SHORTLISTED
  -> REJECTED
  -> WITHDRAWN

SHORTLISTED
  -> IN_PROCESS
  -> REJECTED

IN_PROCESS
  -> SELECTED
  -> REJECTED

SELECTED
  -> OFFERED

OFFERED
  -> JOINED
  -> REJECTED
```

Implement transitions explicitly.

---

# 88. AI Data Governance

All AI features should store sufficient metadata.

Recommended metadata:

```text
model_provider
model_name
model_version
prompt_version
input_reference_ids
generated_at
confidence where meaningful
```

Do not necessarily store complete prompts if they include sensitive information unless required.

---

# 89. AI Failure Handling

AI workflows must fail gracefully.

Examples:

```text
resume tailoring unavailable
readiness assessment timeout
recommendation service unavailable
web verification failure
```

The core placement system must remain usable without AI.

AI features enhance workflows; they should not make core CRUD and hiring operations unavailable.

---

# 90. External Profile Sync Rules

External profile sync should:

1. validate ownership where possible
2. rate-limit API calls
3. store snapshots
4. track last successful sync
5. not treat unavailable external data as negative evidence
6. tolerate provider outages
7. distinguish user-entered profile URLs from verified ownership

---

# 91. Data Privacy Principles

Student data may include sensitive professional and educational information.

Agents should prefer:

- least privilege
- field-level visibility
- scoped recruiter access
- encryption in transit
- encryption at rest
- auditability
- explicit expiration
- minimal data replication

Do not expose phone/email merely because recruiter can see the profile.

---

# 92. File Storage

Large objects should not normally be stored directly in relational tables.

Use object storage for:

- resumes
- certificates
- offer letters
- evidence documents
- profile media

The DB should store:

```text
storage_key
content_type
checksum
size
uploaded_by
created_at
```

Prefer signed/authorized file access.

---

# 93. Verification Evidence Security

Evidence may contain personal data.

Rules:

1. Evidence must have access control.
2. Public profile views must not reveal raw evidence automatically.
3. Recruiters should typically see "verified" status, not internal evidence.
4. TPO/admin may receive broader access.
5. URLs to private files must be short-lived or authorized.

---

# 94. Search Strategy

Possible searchable domains:

```text
students
skills
projects
companies
jobs
alumni
mentorship topics
referral opportunities
```

Cross-tenant private student search is prohibited.

Within a tenant, searchable student projections should honor visibility and authorization.

---

# 95. Derived Student Profile Read Model

For recruiter performance, it may be useful to maintain a read projection:

```text
recruiter_student_profile_view
```

This projection can aggregate:

- student basics
- allowed academic details
- verified claims
- skills
- projects
- external profile stats
- application context
- readiness summary

The projection must be regenerated when source data changes.

It is not the source of truth.

---

# 96. Placement Drive Lifecycle

Suggested lifecycle:

```text
DRAFT
  ->
SCHEDULED
  ->
REGISTRATION_OPEN
  ->
ACTIVE
  ->
COMPLETED
  ->
ARCHIVED
```

Alternative branches:

```text
DRAFT -> CANCELLED
SCHEDULED -> CANCELLED
ACTIVE -> CANCELLED
```

Recruiter access typically expires when the drive completes.

---

# 97. Job Lifecycle

Suggested lifecycle:

```text
DRAFT
  ->
PENDING_APPROVAL
  ->
OPEN
  ->
CLOSED
  ->
COMPLETED
  ->
ARCHIVED
```

Possible cancellation:

```text
OPEN -> CANCELLED
```

Applications must preserve the job snapshot needed for history.

---

# 98. Opportunity Lifecycle

Suggested lifecycle:

```text
DRAFT
  ->
SUBMITTED
  ->
WEB_VERIFYING
  ->
WEB_VERIFIED
  ->
TPO_PENDING
  ->
APPROVED
  ->
PUBLISHED
```

Failure paths:

```text
WEB_VERIFYING -> WEB_REJECTED
TPO_PENDING -> REJECTED
TPO_PENDING -> MORE_INFO_REQUIRED
MORE_INFO_REQUIRED -> TPO_PENDING
```

---

# 99. Verification Lifecycle

Suggested lifecycle:

```text
PENDING
  ->
IN_PROGRESS
  ->
VERIFIED
```

Alternative results:

```text
IN_PROGRESS -> REJECTED
IN_PROGRESS -> NEEDS_REVIEW
IN_PROGRESS -> ERROR

VERIFIED -> EXPIRED
VERIFIED -> REVOKED
```

---

# 100. Mentorship Lifecycle

```text
REQUESTED
  ->
ACCEPTED
  ->
ACTIVE
  ->
COMPLETED
```

Alternative:

```text
REQUESTED -> DECLINED
REQUESTED -> CANCELLED
ACTIVE -> CANCELLED
```

---

# 101. Referral Lifecycle

```text
REQUESTED
  ->
ACCEPTED
  ->
REFERRED
```

Alternative:

```text
REQUESTED -> DECLINED
REQUESTED -> CANCELLED
REQUESTED -> EXPIRED
```

---

# 102. Placement Outcome Source of Truth

When placement analytics need to answer:

```text
Is this student placed?
At which company?
For which role?
At what package?
Was it campus or off-campus?
```

prefer `placement_outcomes`.

Do not rely solely on:

```text
student_profiles.placement_status
```

The student profile status may be a cached summary.

---

# 103. Suggested Database Naming Convention

Prefer:

```text
snake_case
plural table names
uuid id
created_at
updated_at
```

Example:

```text
job_applications
placement_drives
verification_requests
candidate_stage_records
```

Avoid ambiguous names such as:

```text
data
info
details
master
mapping1
status_data
```

---

# 104. JSONB Usage

Use relational columns for frequently queried structural fields.

Use JSONB for:

- variable AI explanations
- provider-specific metadata
- dynamic stage configuration
- external metrics
- eligibility expected values
- immutable snapshots

Do not use JSONB merely to avoid proper schema design.

---

# 105. Suggested Indexes

High-value indexes likely include:

```text
student_profiles(person_id)
student_profiles(department_id)
student_profiles(batch_id)

job_postings(company_id)
job_postings(placement_drive_id)
job_postings(status)

job_applications(job_id)
job_applications(student_id)
job_applications(status)

candidate_stage_records(application_id)
candidate_stage_records(stage_id)

verification_requests(subject_type, subject_id)
verification_requests(status)

reputation_events(student_id)

opportunity_submissions(submitted_by_student_id)
opportunity_submissions(status)

referral_requests(student_id)
referral_requests(alumni_id)

mentorship_requests(student_id)
mentorship_requests(alumni_id)
```

---

# 106. Domain-Level Authorization Examples

## Student

Allowed:

```text
view own profile
edit own career profile
submit own claims
upload resume
submit opportunity
apply to jobs
view own applications
request mentorship
request referral
```

Not allowed:

```text
verify own claims
edit recruiter decisions
edit other student profiles
access TPO-only notes
```

---

## Department TPO

Allowed within department scope:

```text
view department students
verify profiles
review opportunities
view applications
manage department placement workflows
```

Not automatically allowed:

```text
manage another department
change tenant configuration
access unrelated recruiter drives
```

---

## Central TPO

Allowed:

```text
college-wide placement coordination
company and drive management
cross-department jobs
recruiter invitations
college analytics
```

---

## Recruiter

Allowed only for granted resources:

```text
view permitted candidates
shortlist
move candidates through configured stages
evaluate
issue offers if permitted
```

Not allowed:

```text
browse every student in college
view unrelated applications
view internal TPO notes
manage tenant settings
```

---

## Alumni

Allowed:

```text
manage own alumni profile
publish mentorship offering
respond to mentorship requests
publish referral opportunity
respond to referral requests
```

---

# 107. Background Jobs

Likely background tasks:

```text
external profile synchronization
opportunity web verification
public opportunity publishing
AI resume generation
AI readiness scoring
candidate recommendation generation
notification delivery
recruiter access expiration
verification expiry
job expiration
referral expiration
analytics materialization
```

All background tasks should be retry-safe.

---

# 108. Recommended Service Boundaries

Even within a modular monolith, keep service responsibilities clear.

Examples:

```text
TenantService
IdentityService
AuthorizationService
StudentProfileService
CareerProfileService
ClaimService
VerificationService
ReputationService

OpportunityService
CompanyService
PlacementDriveService
JobService
EligibilityService
ApplicationService

ResumeTailoringService
ReadinessService
RecommendationService

HiringProcessService
CandidateStageService
EvaluationService
OfferService
PlacementOutcomeService

AlumniService
MentorshipService
ReferralService

NotificationService
AuditService
```

---

# 109. Agent Coding Guidance

When implementing a new feature:

1. Identify the owning domain.
2. Check tenant isolation.
3. Check role and resource scope.
4. Determine the aggregate/source of truth.
5. Avoid duplicating derived state.
6. Define lifecycle statuses.
7. Define allowed transitions.
8. Add audit events for sensitive actions.
9. Add domain events for asynchronous side effects.
10. Add idempotency where retries are possible.
11. Add tenant isolation tests.
12. Add authorization tests.
13. Add state-transition tests.
14. Preserve historical records.

---

# 110. Agent Migration Guidance

Before creating a migration, ask:

- Is this new information really a new entity?
- Is an existing entity the source of truth?
- Is this a derived/cached field?
- Does this need history?
- Does it need verification?
- Does it require tenant-specific constraints?
- Does it require a unique index?
- Does it affect existing tenant migrations?

Do not modify the control-plane schema for ordinary tenant-domain data.

---

# 111. Agent API Guidance

API handlers should remain thin.

Preferred pattern:

```text
Controller / Route
   ->
Authorization
   ->
Domain Service
   ->
Repository
   ->
Database
```

Do not put major business rules directly in route handlers.

---

# 112. Agent Testing Checklist

Every important feature should consider:

### Tenant isolation

```text
user from tenant A cannot access tenant B
```

### Authorization

```text
department TPO cannot access another department
recruiter cannot access unrelated drive
```

### State transitions

```text
cannot approve already rejected opportunity without defined restart
cannot move failed candidate to offer without authorized override
```

### Idempotency

```text
duplicate webhook does not duplicate job
duplicate offer acceptance does not duplicate outcome
```

### Historical integrity

```text
changing eligibility criteria does not rewrite previous evaluations
```

### AI traceability

```text
tailored resume stores source version and model metadata
```

---

# 113. Suggested Phase-Wise Implementation

## Phase 1 — Foundation

Build:

```text
tenant control plane
tenant DB routing
people
accounts
roles
role assignments
departments
programs
batches
student profiles
admin/TPO access
audit framework
```

---

## Phase 2 — Career Identity

Build:

```text
career profile
skills
projects
certifications
achievements
external profiles
learning journal
resume/versioning
visibility
```

---

## Phase 3 — Trust

Build:

```text
claims
evidence
verification
verified badge
reputation ledger
```

---

## Phase 4 — Opportunities

Build:

```text
student opportunity submission
web verification
TPO review
job creation
public sanitized catalog
```

---

## Phase 5 — Placement

Build:

```text
companies
placement drives
temporary recruiter access
jobs
eligibility rules
applications
```

---

## Phase 6 — AI Assistance

Build:

```text
resume tailoring
readiness assessment
candidate recommendations
model versioning
```

---

## Phase 7 — Hiring

Build:

```text
configurable process
stages
candidate stage records
evaluations
interviews
offers
placement outcomes
```

---

## Phase 8 — Alumni Network

Build:

```text
alumni conversion
alumni profile
mentorship
referrals
```

---

## Phase 9 — Advanced ERP

Build:

```text
analytics
placement reports
department dashboards
audit review
policy controls
exports
regulatory/accreditation reports
```

---

# 114. Important Product Philosophy

This system should be built around five major concepts.

## 114.1 Identity

A person has a long-lived identity.

Roles change over time.

---

## 114.2 Evidence

Claims should be backed by evidence when verification matters.

---

## 114.3 Scoped Trust

Verification and reputation increase trust but must remain explainable.

---

## 114.4 Workflow

Placement is not a single job/application table.

It is a lifecycle involving:

```text
company
drive
job
eligibility
application
hiring
offer
outcome
```

---

## 114.5 Isolation

Each college is a security boundary.

Tenant isolation must remain stronger than convenience.

---

# 115. Quick Reference: Primary Entities

```text
CONTROL PLANE
-------------
tenants
tenant_domains
tenant_database_configs
tenant_features
schema_versions

IAM
---
people
accounts
roles
role_assignments
resource_access_grants

ORGANIZATION
------------
departments
programs
academic_batches

STUDENT
-------
student_profiles
career_profiles
student_skills
student_projects
certifications
achievements
experiences
external_profiles
external_profile_snapshots
learning_journal_entries
resumes
resume_versions
profile_visibility_settings

TRUST
-----
student_claims
claim_evidence
verification_requests
reputation_events

PLACEMENT
---------
companies
placement_drives
recruiter_access
opportunity_submissions
opportunity_verification_runs
opportunity_tpo_reviews
job_postings
eligibility_rule_sets
eligibility_rules
job_applications
placement_outcomes

AI
--
eligibility_evaluations
tailored_resumes
job_readiness_assessments
candidate_recommendation_runs
candidate_recommendations

HIRING
------
hiring_processes
hiring_stages
candidate_stage_records
candidate_evaluations
interviews
offers

ALUMNI
------
alumni_profiles
employment_history
mentorship_offerings
mentorship_requests
referral_opportunities
referral_requests

COMMUNICATION
-------------
notifications
notification_preferences

AUDIT
-----
audit_events
```

---

# 116. Quick Reference: Core Flows

## Student verification

```text
Student enters profile information
-> Claim created
-> Evidence attached
-> Automated/manual verification
-> Verification result
-> Verified badge/projection updated
```

---

## Student opportunity posting

```text
Student submits opportunity
-> Automated web verification
-> TPO review
-> Approve/reject
-> Reputation event
-> Approved opportunity becomes job
-> Optional sanitized public publication
```

---

## Student job application

```text
Job
-> eligibility evaluation
-> AI resume tailoring
-> readiness analysis
-> student confirmation
-> application submitted
```

---

## Recruiter hiring

```text
Placement drive
-> recruiter temporary access
-> recommended students
-> applications
-> configurable hiring stages
-> evaluation
-> offer
-> placement outcome
```

---

## Student to alumni

```text
Person remains unchanged
-> Student role expires
-> Alumni role activates
-> Alumni profile created
-> Mentorship/referrals enabled
```

---

# 117. Core Engineering Invariants

Any future change must preserve the following:

1. **One college operational dataset = one isolated database.**
2. **The control plane contains no unnecessary student-private data.**
3. **Person is the persistent identity; roles are lifecycle assignments.**
4. **Student-to-alumni transition does not create a new person.**
5. **Recruiter access is temporary and resource-scoped.**
6. **Department TPO access is department-scoped unless explicitly elevated.**
7. **Claims and verification are separate concepts.**
8. **Reputation is event-sourced/auditable rather than arbitrary mutation.**
9. **Opportunity submission and published job remain separate entities.**
10. **Company and recruiter remain separate entities.**
11. **Placement drive and job remain separate entities.**
12. **Job eligibility is rule-driven and versioned.**
13. **Application eligibility stores a historical snapshot.**
14. **AI resume tailoring never overwrites the source resume.**
15. **AI results are derived/advisory and traceable.**
16. **Hiring stages are configurable rather than hardcoded.**
17. **Placement outcome is a first-class source of truth.**
18. **Recruiter views respect explicit resource access and visibility.**
19. **Sensitive actions are audited.**
20. **Public cross-college features use sanitized projections, never private cross-tenant queries.**

---

# 118. General Agent Decision Rule

When uncertain about a design change, prefer the option that maximizes:

```text
tenant isolation
historical traceability
authorization clarity
explicit lifecycle state
auditability
data ownership clarity
future configurability
```

and minimizes:

```text
hidden coupling
role duplication
hardcoded workflow
destructive updates
cross-tenant dependencies
unexplained AI decisions
untraceable derived state
```

This document should be updated whenever a new major domain, workflow, security boundary, or source-of-truth rule is introduced.
---

# 119. Development and Deployment Architecture

This section defines the preferred development, deployment, runtime, and infrastructure architecture.

The platform should optimize for:

1. low fixed monthly infrastructure cost
2. scale-to-zero or low-idle compute where practical
3. strong tenant isolation
4. simple operational ownership
5. minimal number of independently deployed services
6. predictable scaling
7. easy local development
8. independent AI scaling
9. migration to larger infrastructure without rewriting domain logic
10. avoidance of premature distributed-system complexity

The preferred high-level strategy is:

> **Shared stateless compute, isolated tenant state.**

This means the following components are shared across colleges:

```text
Web application
Mobile application binary
Node.js API deployment
AI service deployment
Background task infrastructure
Object storage platform
Monitoring stack
CI/CD pipelines
```

The following state is isolated per college:

```text
Operational relational database
Database credentials
Tenant-specific configuration
Tenant-scoped authorization
Private student/recruiter/TPO/alumni data
Private applications and hiring records
Private verification and placement records
```

---

# 120. Preferred Monorepo Strategy

Use a monorepo.

Preferred tooling:

```text
pnpm
+
Turborepo
+
TypeScript for shared JS/TS applications
```

The Python AI service may live inside the same monorepo while remaining an independently deployable unit.

The monorepo is intended to provide:

- atomic changes across API/web/mobile contracts
- shared type definitions
- shared validation
- shared linting and formatting
- affected-only CI builds
- unified dependency management for JS/TS packages
- consistent local development commands
- easier code discovery for engineers and coding agents

Do not interpret "monorepo" as "single deployment."

The repository contains multiple deployable applications.

---

# 121. Recommended Repository Layout

Preferred structure:

```text
career-platform/
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── mobile/
│   │   ├── app/
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── api/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── ai-service/
│       ├── app/
│       ├── tests/
│       ├── pyproject.toml
│       └── Dockerfile
│
├── packages/
│   ├── contracts/
│   ├── api-client/
│   ├── validation/
│   ├── auth/
│   ├── domain/
│   ├── config/
│   ├── logger/
│   ├── ui/
│   ├── types/
│   ├── eslint-config/
│   └── tsconfig/
│
├── database/
│   ├── control-plane/
│   │   ├── schema/
│   │   ├── migrations/
│   │   └── seeds/
│   │
│   ├── tenant/
│   │   ├── schema/
│   │   ├── migrations/
│   │   └── seeds/
│   │
│   └── scripts/
│
├── infra/
│   ├── terraform/
│   ├── docker/
│   ├── cloud-run/
│   ├── cloudflare/
│   └── scripts/
│
├── docs/
│   ├── architecture/
│   ├── adr/
│   ├── data-model/
│   └── operations/
│
├── .github/
│   └── workflows/
│
├── AGENTS.md
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

The exact folder names may evolve, but domain boundaries should remain clear.

---

# 122. Monorepo Dependency Rules

Preferred dependency direction:

```text
packages/contracts
        ↑
        │
 ┌──────┴────────┐
 │               │
web            mobile
 │               │
 └──────┬────────┘
        │
        v
      API
        │
        v
 domain/services
        │
        v
 repositories
        │
        v
 tenant database
```

The web and mobile clients must not directly understand relational persistence details.

Avoid importing server repositories, ORM models, or database adapters into frontend packages.

Shared packages should contain platform-neutral concerns such as:

```text
API DTOs
Zod schemas
enums
validation rules
shared UI tokens
API client types
feature flag types
safe utility functions
```

Do not share backend-only secrets/configuration through generic shared packages.

---

# 123. Web Application

Preferred stack:

```text
React
Vite
React Router
TanStack Query
Zustand
TypeScript
```

The main ERP application is primarily authenticated and therefore does not require server-side rendering by default.

Primary web actors include:

```text
Student
Department TPO
Central TPO
College Admin
Recruiter
Alumni
```

The web application should be a static client where practical.

Recommended deployment model:

```text
Git repository
   ->
CI build
   ->
static assets
   ->
Cloudflare Pages / equivalent edge static hosting
```

Avoid a dedicated always-on web server for the React bundle.

---

# 124. Web Tenant Configuration

Do not build and deploy a separate frontend for every college.

Use one application bundle.

Tenant-specific behavior should be loaded at runtime.

Example tenant configuration:

```json
{
  "tenantId": "uuid",
  "name": "Example Engineering College",
  "logoUrl": "https://...",
  "theme": {
    "primary": "#123456"
  },
  "features": {
    "aiReadiness": true,
    "alumniNetwork": true,
    "studentOpportunityPosting": true
  }
}
```

Tenant configuration may affect:

- college name
- branding
- logos
- allowed modules
- placement policy
- feature flags
- login behavior
- support contact
- public opportunity settings

Tenant branding must not require a separate source branch or deployment.

---

# 125. Mobile Application

Preferred stack:

```text
Expo
React Native
Expo Router
TanStack Query
Zustand
TypeScript
```

The student mobile application should consume the same public API surface as the web application.

Do not create a separate student-mobile backend unless a future requirement genuinely needs a backend-for-frontend layer.

Conceptually:

```text
React Web ───────┐
                 ├──> Shared Node API
Expo Mobile ─────┘
```

The same authorization and tenant rules apply to both clients.

---

# 126. Mobile Tenant Resolution

Possible tenant discovery mechanisms include:

```text
college code
email domain
invitation link
deep link
configured tenant selector
```

After tenant discovery, authentication must bind the account/session to the resolved tenant.

Do not permit arbitrary tenant switching using a client-supplied database name.

Example:

```text
student@college.edu
    ->
resolve tenant
    ->
authenticate
    ->
session contains tenant identity
```

---

# 127. API Technology

Preferred API stack:

```text
Node.js
TypeScript
Fastify
Zod
PostgreSQL
Drizzle ORM or another tenant-friendly data layer
```

NestJS is also acceptable if the team prefers its framework conventions.

Express is permissible but should not be chosen merely because it is familiar if stronger typing/validation and modularity are needed.

The exact ORM may change.

The more important architectural requirement is:

> The data-access layer must support dynamically resolved tenant databases safely.

---

# 128. API Architecture

The Node API is initially a modular monolith.

Preferred structure:

```text
API
│
├── Identity
├── Organization
├── Student
├── Career
├── Trust
├── Verification
├── Reputation
├── Opportunity
├── Company
├── Placement Drive
├── Jobs
├── Applications
├── Hiring
├── Offers
├── Placement Outcomes
├── Alumni
├── Mentorship
├── Referrals
├── Notifications
└── Audit
```

These are code/module boundaries, not separately deployed services.

Do not create one microservice per domain during the initial product stages.

---

# 129. Why the API Remains Shared

Do not deploy:

```text
college A -> API A
college B -> API B
college C -> API C
```

The preferred topology is:

```text
                  Shared API
                      |
                Tenant Resolver
                /      |      \
               /       |       \
              v        v        v
         College A  College B  College C
             DB         DB         DB
```

The API must be stateless with respect to tenant runtime state.

This keeps compute costs from growing linearly with tenant count.

---

# 130. API Request Context

Every authenticated request should construct an explicit request context.

Example:

```ts
interface RequestContext {
  requestId: string;
  tenantId: string;
  personId: string;
  accountId: string;
  roles: string[];
}
```

A separate internal tenant context may include database routing data:

```ts
interface TenantDatabaseContext {
  tenantId: string;
  clusterId: string;
  databaseName: string;
  secretReference: string;
}
```

Never expose database routing configuration to untrusted clients.

---

# 131. Preferred API Deployment

Preferred initial production deployment:

```text
Google Cloud Run
```

or a functionally equivalent serverless container platform.

Reasons:

- scale to zero
- container-based deployment
- automatic HTTPS
- managed horizontal scaling
- low idle cost
- concurrency support
- straightforward Docker workflow
- independent scaling from AI service

Preferred initial shape:

```text
CPU: small
Memory: 512 MB - 1 GB depending on observed usage
Minimum instances: 0
Maximum instances: explicitly capped initially
Concurrency: tuned through load testing
```

Do not provision large minimum instance counts during MVP.

---

# 132. Shared Compute / Isolated State Model

The canonical deployment pattern is:

```text
                 SHARED STATELESS COMPUTE

                  React / Expo
                       |
                       v
                    Node API
                       |
             +---------+----------+
             |                    |
             v                    v
        AI Service         Tenant Resolver
                                  |
                 +----------------+----------------+
                 |                |                |
                 v                v                v

                    ISOLATED TENANT STATE

              College A DB   College B DB   College C DB
```

The API and AI services may scale independently.

Tenant data remains isolated even though application compute is shared.

---

# 133. Tenant Database Topology

The architecture requires:

```text
One operational database per college
```

but not:

```text
One PostgreSQL server per college
```

Preferred initial topology:

```text
PostgreSQL Cluster A
│
├── platform_control
├── college_001
├── college_002
├── college_003
├── college_004
└── college_005
```

Each tenant database should have:

```text
independent database name
independent DB role/user
independent password/secret
restricted grants
independent schema-version tracking
```

A database role for College A must not be able to query College B's database.

---

# 134. Tenant Database Isolation Tiers

The application should support infrastructure tiers without changing domain code.

## Tier 1 — Shared PostgreSQL Cluster

```text
Cluster A
├── College 1 DB
├── College 2 DB
├── College 3 DB
└── College N DB
```

Recommended for:

```text
MVP
small colleges
low-to-medium load tenants
early production
```

This is the default low-cost model.

---

## Tier 2 — Sharded PostgreSQL Clusters

As tenant count/load grows:

```text
Cluster A
├── Colleges 1-25

Cluster B
├── Colleges 26-50

Cluster C
├── Colleges 51-75
```

The control plane maps each tenant to its cluster.

Example:

```json
{
  "tenantId": "tenant-42",
  "clusterId": "cluster-b",
  "databaseName": "college_042"
}
```

The application API should require no business-logic change.

---

## Tier 3 — Dedicated Enterprise Cluster

High-volume or contractual enterprise tenants may receive:

```text
College X
   ->
Dedicated PostgreSQL cluster
```

The control-plane database routing record changes.

The tenant-domain code does not.

This may later become a premium product capability.

---

# 135. Database Connection Strings

A shared cluster may still provide independent tenant connection strings.

Example:

```text
postgresql://college_001_user:***@postgres.example/college_001

postgresql://college_002_user:***@postgres.example/college_002
```

This satisfies the requirement that each college have a separately addressable and independently authorized database.

Do not use one superuser credential for normal tenant traffic.

---

# 136. Tenant Connection Manager

The API must not create a fresh database connection for every HTTP request.

Use a tenant-aware connection/pool manager.

Concept:

```text
TenantConnectionManager
│
├── College A pool
├── College B pool
├── College C pool
└── ...
```

The manager should support:

- lookup by tenant ID
- connection config resolution
- pool reuse
- idle pool eviction
- maximum active tenant pools
- connection health checks
- credential rotation
- graceful shutdown

A simple LRU/TTL strategy is acceptable initially.

---

# 137. Connection Pool Cost and Safety

Do not keep large pools open for every tenant indefinitely.

Bad example:

```text
500 colleges
x
10 persistent DB connections
=
5000 connections
```

Prefer:

```text
Active tenant -> active small pool
Idle tenant -> pool eventually closed
```

Pool limits should be configurable per environment.

Database connection behavior must be load-tested before high tenant counts.

---

# 138. ORM/Data Layer Requirements

A data layer that assumes exactly one global database URL may be unsuitable without adaptation.

Avoid architecture that requires:

```ts
const db = globallyBoundToOneTenantDatabase;
```

for all requests.

Preferred logical behavior:

```ts
const db = await tenantConnectionManager.get(requestContext.tenantId);
```

Then:

```text
service
  ->
tenant-scoped repository
  ->
resolved DB connection
```

Repositories must not accidentally fall back to another tenant or to a global operational database.

---

# 139. Control Plane Database Runtime Use

The control plane should remain small.

Typical API sequence:

```text
request
  ->
resolve authenticated tenant
  ->
load/cache tenant DB routing metadata
  ->
obtain tenant DB pool
  ->
perform domain query
```

Tenant database routing metadata may be cached in memory for a short period.

Credential material should be obtained from a secret manager or secure runtime configuration.

---

# 140. Tenant Provisioning Workflow

Tenant creation should become an automated platform workflow.

Canonical process:

```text
Create tenant record
    ->
allocate cluster
    ->
create database
    ->
create restricted DB role
    ->
generate credential
    ->
store credential in secret manager
    ->
apply tenant migrations
    ->
seed base roles/settings
    ->
create initial college admin
    ->
verify health
    ->
mark tenant ACTIVE
```

Provisioning should be retry-safe and auditable.

A partially provisioned tenant should remain in an explicit provisioning/error state.

---

# 141. Tenant Migration Architecture

Because every college has its own database, tenant schema migrations must run across tenant DBs.

A migration runner should:

```text
read active tenants
    ->
group by target schema version
    ->
connect to each tenant DB
    ->
apply pending migration
    ->
verify result
    ->
record schema version
```

Do not assume one database migration command updates all tenants.

---

# 142. Backward-Compatible Migrations

Production migrations should favor expand/contract patterns.

Example:

```text
Deploy 1:
add nullable/new column
support old + new behavior

Deploy 2:
backfill data

Deploy 3:
switch reads/writes

Deploy 4:
remove obsolete field later
```

Avoid deploying code that requires every tenant DB to update successfully at the exact same instant.

Tenant migration failure should be isolated and observable.

---

# 143. Migration Tracking

Track:

```text
tenant_id
current_schema_version
target_schema_version
last_migration_at
last_migration_status
last_migration_error
```

The migration history itself may be stored inside each tenant DB and summarized in the control plane.

---

# 144. AI Service Deployment Boundary

The AI service is intentionally deployed separately from the Node API.

Preferred initial technology:

```text
Python
FastAPI
Pydantic
LLM/provider SDKs
```

The AI service exists separately because AI workloads have different:

- runtime duration
- dependency ecosystem
- scaling pattern
- CPU/memory characteristics
- model-provider concerns
- future GPU requirements

This is a justified service boundary from the beginning.

---

# 145. AI Service Responsibilities

The AI service may own:

```text
resume tailoring
job description parsing
skills extraction
readiness scoring
candidate reranking
candidate/job semantic analysis
profile summarization
structured generation
future embedding workflows
```

The AI service should not own:

```text
tenant authorization
application lifecycle
placement lifecycle
hiring-stage source of truth
student identity source of truth
recruiter permissions
database tenancy routing
```

---

# 146. AI Service Must Not Own Tenant Databases

Preferred boundary:

```text
Node API
    ->
authorize request
    ->
load minimum required data
    ->
sanitize/shape AI input
    ->
AI service
    ->
structured AI output
    ->
Node API validates output
    ->
Node API persists result
```

Do not give the AI service broad tenant database credentials.

This keeps:

- tenant isolation simpler
- AI service stateless
- database access centralized
- audit boundaries clearer
- model inputs intentional

---

# 147. AI Service Deployment

Preferred initial deployment:

```text
Cloud Run
minimum instances = 0
```

The AI service should be independently configurable from the API.

Example:

```text
API:
  smaller memory
  higher concurrency

AI:
  larger memory if needed
  lower concurrency if requests are heavy
```

Do not copy the API's runtime configuration blindly.

---

# 148. Do Not Self-Host Large LLMs Initially

Do not begin with a continuously running GPU model server unless measured usage economically justifies it.

Avoid initial infrastructure such as:

```text
GPU VM
vLLM cluster
Kubernetes GPU nodes
always-on Llama server
```

Prefer provider APIs initially.

Possible providers may include:

```text
OpenAI
Google Gemini
AWS Bedrock
other approved enterprise LLM providers
```

Model choice should be abstracted behind the AI service.

---

# 149. AI Provider Abstraction

Define a provider abstraction rather than calling one provider throughout the codebase.

Concept:

```python
class ModelProvider:
    async def generate(self, ...): ...
    async def generate_structured(self, ...): ...
    async def embed(self, ...): ...
```

Workflow services call the abstraction.

Example:

```text
ResumeTailoringService
         |
         v
    ModelGateway
     /    |    \
 OpenAI Gemini Bedrock
```

This supports:

- provider failover
- cost routing
- model upgrades
- tenant-specific provider policy
- testing
- future self-hosting

---

# 150. Synchronous vs Asynchronous AI

Not every AI task should block an HTTP request.

## Synchronous Examples

Use synchronous API -> AI calls for relatively small/interactive operations such as:

```text
rewrite one resume bullet
generate a short profile headline
extract a few skills
summarize a short job description
```

---

## Asynchronous Examples

Prefer asynchronous processing for:

```text
full job readiness report
complete resume tailoring
GitHub/repository analysis
candidate ranking across many students
large profile assessment
multi-document verification support
batch recommendations
```

---

# 151. Initial Async Architecture

Do not deploy Redis only to create a job queue at MVP.

Preferred managed task flow:

```text
Client
  ->
Node API
  ->
create domain job/status record
  ->
enqueue Cloud Task
  ->
AI service
  ->
complete generation
  ->
trusted API/internal callback
  ->
persist final result
  ->
notify user
```

Use a functionally equivalent managed task service if the deployment platform changes.

---

# 152. Async Job State

AI/background jobs should have explicit state.

Example:

```text
QUEUED
RUNNING
COMPLETED
FAILED
CANCELLED
```

Suggested generic metadata:

```text
job_id
job_type
tenant_id
requested_by
status
attempt_count
input_reference
result_reference
error_code
created_at
started_at
completed_at
```

Avoid storing huge AI inputs directly in queue messages.

Store references when appropriate.

---

# 153. Idempotent Background Processing

Cloud/background task delivery may retry.

Handlers must support repeated delivery.

Examples requiring idempotency:

```text
resume generation
readiness generation
public job publishing
notification sending
external profile sync
candidate recommendation
placement outcome synchronization
```

Use idempotency keys or unique constraints.

---

# 154. Redis Policy

Redis is not part of the mandatory initial architecture.

Do not add Redis merely because:

```text
"all scalable architectures have Redis"
```

Introduce it only when a measured requirement appears.

Possible future reasons:

- high-volume cache
- distributed rate limits
- distributed locks
- realtime presence
- advanced queues
- highly repeated computed data

Until then, prefer:

```text
in-process cache where safe
database
managed task service
CDN/edge caching
```

---

# 155. Object Storage

Do not store large files directly as relational BLOBs unless there is a specific reason.

Use object storage.

Preferred low-cost initial option:

```text
Cloudflare R2
```

or another S3-compatible object store.

Store files such as:

```text
resumes
certificates
verification evidence
offer letters
student project media
profile images
generated resume PDFs
```

---

# 156. Object Metadata

Relational records should store file metadata such as:

```text
id
storage_provider
bucket
storage_key
content_type
size_bytes
checksum
uploaded_by
tenant_id/reference context
created_at
```

The database record controls ownership and authorization.

The object storage key is not itself proof of access permission.

---

# 157. Direct-to-Object-Storage Uploads

Avoid proxying large uploads through the Node API.

Preferred upload flow:

```text
Client
   ->
API: request authorized upload
   ->
API: create signed upload URL
   ->
Client: upload directly to object storage
   ->
Client/API: finalize metadata
```

Benefits:

- lower API CPU
- lower API memory
- less bandwidth through API containers
- shorter request duration
- better scalability

---

# 158. Private File Access

Resumes, certificates, evidence, and offer letters are private by default.

Use:

```text
authorized download endpoint
or
short-lived signed URL
```

Do not publish stable public object URLs for private material.

Recruiter access must respect job/drive/resource permissions.

---

# 159. Authentication Architecture

Authentication and authorization are separate.

Authentication answers:

```text
Who is this account/person?
```

Authorization answers:

```text
What may this person do within this tenant and resource scope?
```

Authentication options may include:

```text
email/password
Google OAuth
Microsoft OAuth
college SSO
```

The exact identity provider may evolve.

---

# 160. Session / Token Requirements

A token/session should securely identify:

```text
person/account
tenant
session
expiration
```

Example claims:

```json
{
  "sub": "person-uuid",
  "tenant_id": "tenant-uuid",
  "session_id": "session-uuid",
  "iat": 0,
  "exp": 0
}
```

Do not embed a long-lived, complete permission tree in the token if permissions can be revoked rapidly.

Prefer short-lived access tokens plus revocable session/refresh state.

---

# 161. Tenant Authorization on Every Request

The API must validate that:

```text
authenticated tenant
==
resolved request tenant
```

before tenant DB access.

Do not trust:

```text
query ?tenant=
header sent by arbitrary browser client
database name
tenant slug alone
```

without validating it against the authenticated session and trusted domain context.

---

# 162. Tenant Domain Routing

Possible tenant URLs:

```text
college-a.platform.example
college-b.platform.example
```

or custom domains.

The routing layer should resolve domain -> tenant.

Domain resolution must not itself grant authorization.

It only provides tenant context for the authentication flow.

---

# 163. Public and Private API Boundaries

Separate conceptual API categories.

Examples:

```text
/public/*
/auth/*
/api/v1/*
/internal/*
/platform/*
```

`/internal/*` should be protected for trusted service-to-service calls.

`/platform/*` should be restricted to platform operations and not tenant administrators unless explicitly intended.

---

# 164. CI/CD Architecture

Use GitHub Actions or an equivalent CI/CD system.

The monorepo pipeline should run affected builds/tests rather than rebuilding everything unnecessarily.

Concept:

```text
Pull Request
│
├── lint affected
├── typecheck affected
├── unit test affected
├── integration test affected
└── build affected

Merge to main
│
├── web changed -> deploy web
├── api changed -> build/deploy API
├── AI changed -> build/deploy AI
└── mobile changed -> run mobile checks/build policy
```

Turborepo caching should be used carefully to reduce repeated work.

---

# 165. Deployment Artifacts

Preferred deployable artifacts:

```text
Web:
static build output

API:
OCI/Docker image

AI:
OCI/Docker image

Mobile:
Expo/EAS application builds

Infrastructure:
Terraform plans/apply
```

Build once per commit where practical.

Avoid rebuilding a different API artifact for each tenant.

---

# 166. API Container Requirements

The API Docker image should:

- run as non-root where practical
- use a minimal runtime base image
- include only production dependencies
- expose a health endpoint
- support graceful shutdown
- handle SIGTERM
- avoid local persistent state
- read secrets from runtime configuration
- log structured JSON

---

# 167. AI Container Requirements

The AI container should:

- avoid embedding provider secrets in image layers
- expose health/readiness endpoints
- load model/provider clients lazily where useful
- support cancellation/timeouts
- have explicit request size limits
- validate structured output
- log model/provider metadata without logging private prompt content unnecessarily
- handle Cloud Run/serverless shutdown correctly

---

# 168. Environment Strategy

Keep the number of long-lived environments small.

Recommended:

```text
LOCAL
STAGING
PRODUCTION
```

Avoid a dedicated cloud stack for every developer unless there is a strong requirement.

---

# 169. Local Development

Preferred local developer workflow:

```text
Web/Mobile:
native local dev servers

API:
local Node process or Docker

AI:
local Python process or Docker

Database:
Docker PostgreSQL
```

A local Postgres instance should contain multiple databases:

```text
platform_control
college_demo_a
college_demo_b
```

This makes tenant-isolation testing part of daily development.

---

# 170. Local Docker Compose

A lightweight local compose stack may include:

```text
postgres
api
ai-service
optional local mail catcher
```

The web and Expo dev server do not necessarily need Docker.

Do not introduce many infrastructure emulators unless they materially improve development.

---

# 171. Staging Architecture

Staging should be shared and cost-controlled.

Typical topology:

```text
1 staging web deployment
1 staging API service
1 staging AI service
1 staging PostgreSQL cluster
several test tenant DBs
1 staging object storage namespace/bucket
```

Staging should contain synthetic/test data.

Do not use real student data unless explicitly governed.

---

# 172. Production Architecture

Initial production:

```text
Cloudflare
│
├── DNS
├── CDN
└── Web static hosting
        |
        v
    Node API (Cloud Run)
        |
        +---------> Control Plane DB
        |
        +---------> Tenant DB Router
        |                |
        |        PostgreSQL Cluster(s)
        |
        +---------> Object Storage
        |
        +---------> Managed Tasks
                         |
                         v
                 AI Service (Cloud Run)
                         |
                         v
                    LLM Providers
```

This is the preferred initial reference deployment.

---

# 173. Infrastructure as Code

Infrastructure should be reproducible.

Preferred:

```text
Terraform
```

Manage:

```text
Cloud Run services
service accounts
secret access
task queues
storage resources
DNS where appropriate
monitoring configuration
environment configuration
database infrastructure where provider supports it
```

Do not rely on undocumented manual console changes for production infrastructure.

---

# 174. Secret Management

Store secrets in a proper secret manager.

Examples:

```text
database passwords
JWT/session signing keys
OAuth client secrets
LLM provider keys
object-storage credentials
internal service authentication secrets
```

Do not store secrets:

```text
in Git
in frontend environment variables
inside Dockerfiles
inside AGENTS.md
inside database rows as plaintext when avoidable
```

Tenant DB config should store secret references rather than raw passwords where possible.

---

# 175. Service-to-Service Authentication

The Node API and AI service should use trusted service authentication.

Options include:

```text
cloud-native service identity
signed service token
private/internal ingress
mTLS in more advanced environments
```

The AI service should not accept arbitrary unauthenticated Internet traffic for internal workflows.

---

# 176. Observability Strategy

Avoid expensive observability platforms during MVP unless required.

Start with:

```text
structured logs
request IDs
tenant IDs
latency metrics
error metrics
Cloud Run/platform metrics
basic alerts
```

Example log:

```json
{
  "request_id": "uuid",
  "tenant_id": "uuid",
  "person_id": "uuid",
  "route": "/api/v1/jobs",
  "status_code": 200,
  "duration_ms": 47
}
```

Never log:

```text
passwords
access tokens
refresh tokens
database passwords
full resumes
certificate contents
raw confidential hiring feedback unless explicitly protected
```

---

# 177. OpenTelemetry

Instrument the application with OpenTelemetry-compatible tracing where practical.

Trace:

```text
HTTP request
tenant resolution
DB query timing
AI service request
LLM provider request
background task
object storage operations
```

Instrumentation may exist before a paid tracing backend.

This makes later observability migration easier.

---

# 178. Health Endpoints

At minimum:

```text
/health/live
/health/ready
```

Liveness should test process health.

Readiness may test critical dependencies conservatively.

Do not make liveness fail because one external AI provider is temporarily unavailable.

The core API can remain healthy even when AI features are degraded.

---

# 179. Cost Optimization Philosophy

Optimize fixed costs first.

Prefer:

```text
scale-to-zero compute
static web hosting
shared API compute
shared AI compute
shared PostgreSQL clusters with separate DBs
managed queues
object storage
usage-based AI providers
```

Avoid large idle infrastructure.

---

# 180. Expected Cost Drivers

The most important long-term cost drivers are likely to become:

```text
PostgreSQL compute/storage
AI token usage
file storage/egress
high-volume notification providers
mobile distribution/build services
observability at high volume
```

The Node API itself should usually not be the dominant cost when configured efficiently.

---

# 181. Explicit Initial Non-Requirements

Do not introduce the following without measured justification:

```text
Kubernetes
GKE/EKS/AKS
Kafka
self-managed RabbitMQ
Elasticsearch cluster
dedicated Redis cluster
database server per college
API deployment per college
AI deployment per college
frontend deployment per college
always-on GPU inference
service mesh
dozens of microservices
```

An agent proposing one of these must document:

```text
measured requirement
expected benefit
monthly cost impact
operational impact
simpler alternatives considered
```

---

# 182. AI Cost Control

AI usage must be intentionally controlled.

Do not generate expensive results every time a page renders.

AI output should be cached/reused when the relevant inputs have not changed.

---

# 183. AI Input Versioning

Define stable input/version references.

Example readiness cache key:

```text
student_id
+
career_profile_version
+
job_id
+
job_version
+
resume_version
+
assessment_prompt_version
+
model_version
```

If these inputs are unchanged, an existing completed assessment may be reused.

---

# 184. Readiness Assessment Cache

Concept:

```text
Student A
Job 123
Career Profile Version 8
Job Version 4
Model Version 3
      |
      v
hash/cache key
      |
   +--+--+
   |     |
 hit     miss
   |      |
 reuse   generate
```

Never assume every "view readiness" interaction requires a new LLM call.

Provide explicit regeneration when needed.

---

# 185. Tailored Resume Cache

Tailored resumes should be keyed by relevant immutable/versioned inputs:

```text
student_id
base_resume_version_id
job_version
prompt_version
model_version
```

Repeated requests with the same inputs should normally return/reuse the existing tailored result unless regeneration is requested.

---

# 186. Candidate Recommendation Cost Control

Do not call an LLM once per candidate for thousands of candidates on every page load.

Preferred funnel:

```text
all students
    ->
deterministic eligibility filtering
    ->
structured SQL/rule scoring
    ->
candidate subset
    ->
optional vector/semantic relevance
    ->
top candidate subset
    ->
optional AI reranking/explanation
```

Use AI only where it adds meaningful value.

---

# 187. AI Batch Processing

Where provider APIs support it economically and product latency permits it, consider batch/offline processing for:

```text
nightly candidate recommendation refresh
bulk job parsing
large batch readiness precomputation
profile enrichment
```

Interactive features should remain responsive and should not wait on unrelated batch work.

---

# 188. AI Failure Isolation

The platform's core placement ERP must remain usable when AI is unavailable.

If AI service/provider fails:

```text
jobs still load
applications can still be submitted according to product policy
TPO can still manage placement
recruiter hiring flow still works
alumni workflows still work
```

Features may show:

```text
AI assessment temporarily unavailable
generation queued
retry available
```

AI must enhance, not become a single point of failure for the entire ERP.

---

# 189. AI Rate Limits and Budgets

Implement configurable budget controls.

Potential dimensions:

```text
per tenant
per user
per feature
per day/month
per model
```

Examples:

```text
resume regenerations/day
readiness generations/job
candidate reranking runs/hour
```

High-cost operations should be protected from accidental loops.

---

# 190. Model Routing

The AI service may use different models for different workloads.

Example:

```text
small extraction -> low-cost model
resume rewriting -> medium-capability model
complex readiness reasoning -> stronger model
embedding -> embedding-specific model
```

Do not send every workload to the most expensive model.

---

# 191. Backup Strategy

Tenant isolation must extend to backup/restore operations.

Required capabilities:

```text
regular Postgres backups
point-in-time recovery if supported/justified
object storage durability
control-plane backup
restore testing
```

A restore procedure should be able to restore one college without unintentionally overwriting another college's active database.

---

# 192. Tenant-Level Restore

Because tenant data is separated by database, preferred operational capability is:

```text
restore College A
without
restoring College B
```

If the database provider restores at cluster level, define an extraction/recovery workflow for a single tenant database.

Test this before claiming tenant-level disaster recovery.

---

# 193. Disaster Recovery Priority

Recovery priority:

```text
1. control plane
2. tenant databases
3. authentication/session infrastructure
4. object storage metadata/files
5. API
6. AI service
7. derived caches/recommendations
```

Derived AI outputs can often be regenerated.

Source-of-truth placement data cannot.

---

# 194. Deployment Release Strategy

Deployments should be compatible with rolling/serverless updates.

Avoid requiring:

```text
all clients
all API containers
all tenant DBs
```

to switch atomically.

API changes should support a brief mixed-version deployment window when the platform performs rolling updates.

---

# 195. API Versioning

Use versioned external API routes where appropriate:

```text
/api/v1/
```

Do not version internal code modules merely because route APIs are versioned.

Mobile clients may remain installed for long periods, so breaking API changes require more care than web-only changes.

---

# 196. Mobile Backward Compatibility

Mobile application releases are not instantaneous.

Therefore:

- avoid removing an API field immediately
- maintain backward-compatible endpoints for supported app versions
- track minimum supported mobile version
- use remote feature flags carefully
- avoid backend changes that immediately break old clients

---

# 197. Feature Flags

Tenant-level feature flags are recommended for:

```text
AI readiness
AI resume tailoring
student opportunity posting
public opportunity publication
alumni mentorship
referrals
recruiter recommendations
new hiring workflow UI
```

Feature flags should live in trusted tenant configuration.

Do not implement tenant-specific code forks.

---

# 198. Scaling Signals

Do not split infrastructure based only on tenant count.

Use measured signals such as:

```text
DB CPU
DB IOPS
database size
connection pressure
API latency
API concurrency
AI queue depth
AI request duration
task retry rate
tenant-specific load
```

One large college may generate more load than dozens of small colleges.

---

# 199. When to Add Another PostgreSQL Cluster

Consider adding/sharding to another cluster when one or more of these become persistent:

```text
DB CPU saturation
connection pressure
storage/IOPS pressure
maintenance window risk
tenant noisy-neighbor problems
backup/restore constraints
enterprise isolation contract
```

Moving a tenant should be a controlled operational procedure.

---

# 200. Tenant Database Reassignment

The control plane should make physical DB location an implementation detail.

Conceptually:

```text
tenant_id
   ->
cluster_id
   ->
database_name
   ->
secret_reference
```

This allows tenant migration from:

```text
shared cluster A
```

to:

```text
shared cluster B
```

or:

```text
dedicated cluster X
```

without changing tenant ID or user-facing URLs.

---

# 201. When to Add Redis

Add Redis only after a concrete requirement.

Examples:

```text
distributed rate limit across many API instances
high-throughput shared cache
distributed locking
realtime online presence
queue semantics not served by managed task platform
```

Document cache invalidation and failure behavior before introducing Redis.

---

# 202. When to Add Search Infrastructure

Do not deploy Elasticsearch/OpenSearch initially unless PostgreSQL search becomes insufficient.

Start with:

```text
PostgreSQL indexes
full-text search
trigram search where appropriate
structured filters
```

Consider dedicated search only when:

```text
measured search latency is inadequate
complex relevance ranking is required
indexing volume demands it
cross-domain search requirements justify cost
```

Private cross-tenant student search remains prohibited regardless of search technology.

---

# 203. When to Introduce Additional Microservices

Split a module from the Node modular monolith only when there is a real reason such as:

```text
independent scaling need
different runtime
security isolation
ownership/team boundary
deployment frequency conflict
resource profile difference
fault isolation requirement
```

The AI service already meets these conditions.

Other domains do not automatically.

---

# 204. Potential Future Worker Service

A dedicated worker service may eventually process:

```text
notifications
exports
bulk reports
scheduled analytics
external profile refresh
large imports
```

Do not add it before asynchronous workload justifies independent scaling.

---

# 205. Notification Cost Strategy

Prefer notification routing by importance.

Example:

```text
in-app notification -> default
email -> important events
SMS/WhatsApp -> selected high-value/time-sensitive events
```

Avoid sending paid channels for every low-value state change.

Notification preferences must be honored where applicable.

---

# 206. Public Opportunity Architecture

Public job publication is a derived-data pipeline.

Preferred:

```text
Tenant DB
  ->
approved job domain event
  ->
sanitization/projection
  ->
public opportunity store
  ->
public website/API
```

Public pages must not query private tenant operational DBs directly.

---

# 207. Public Catalog Failure Handling

Failure to publish to the public catalog must not roll back the internal TPO approval.

Example:

```text
internal job approved
public publishing failed
```

should result in:

```text
job remains internally approved
public_sync_status = FAILED
retry task scheduled
```

This avoids coupling tenant workflow correctness to a shared public service.

---

# 208. Security Boundary Diagram

```text
Browser / Mobile
      |
      v
Public API Edge
      |
      v
Authentication
      |
      v
Tenant + Authorization Context
      |
      v
Node API Domain Service
      |
      +----------------------+
      |                      |
      v                      v
Tenant DB               Object Storage
      |
      v
Source of Truth

Node API
      |
      v
Minimal AI Payload
      |
      v
AI Service
      |
      v
Model Provider
```

AI providers must receive only the information necessary for the requested feature.

---

# 209. Data Sent to AI Providers

Minimize data sent to third-party AI services.

Prefer:

```text
skills
project summaries
resume content required for tailoring
job description
relevant verified facts
```

Avoid sending unrelated:

```text
phone numbers
home addresses
private TPO comments
unrelated academic records
internal admin data
other students' data
```

Provider policies should be reviewed before production use.

---

# 210. Development Workflow

Suggested day-to-day commands:

```text
pnpm install
pnpm dev:web
pnpm dev:mobile
pnpm dev:api
pnpm test
pnpm lint
pnpm typecheck
```

The AI service may expose wrapper scripts such as:

```text
pnpm dev:ai
```

that invoke the Python environment.

Use root scripts to hide unnecessary tooling differences from developers.

---

# 211. Shared Contracts

Use `packages/contracts` for request/response contracts shared between:

```text
web
mobile
api
```

Example:

```ts
export const JobSummarySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  companyName: z.string(),
  status: z.enum(["OPEN", "CLOSED"])
});

export type JobSummary = z.infer<typeof JobSummarySchema>;
```

Do not expose ORM entity types directly as public API DTOs.

---

# 212. Generated API Client

Consider generating a typed client from:

```text
OpenAPI
```

or maintaining a strongly typed shared client package.

The goal is:

```text
one API contract
used by web and mobile
```

not manually duplicated fetch logic.

---

# 213. Error Model

Define a consistent API error shape.

Example:

```json
{
  "code": "JOB_NOT_ELIGIBLE",
  "message": "You do not meet this job's eligibility criteria.",
  "requestId": "uuid",
  "details": {}
}
```

Do not leak:

```text
SQL errors
stack traces
database host names
secret identifiers
internal service tokens
```

to clients.

---

# 214. Timeouts

All external dependencies should have explicit timeouts.

Examples:

```text
database acquisition
AI service HTTP
LLM provider
object storage
web verification
email provider
```

Never rely on unlimited/default timeouts for expensive operations.

---

# 215. Retries

Retries should be intentional.

Retry:

```text
transient network errors
rate limits according to provider policy
managed task delivery
idempotent external sync
```

Do not blindly retry:

```text
validation failure
authorization failure
permanent provider rejection
duplicate business action
```

Use exponential backoff where appropriate.

---

# 216. Rate Limiting

Introduce rate limits for abuse-prone operations.

Examples:

```text
login attempts
AI generation
opportunity submission
referral requests
mentorship requests
file upload URL generation
public APIs
```

Rate limit keys may include:

```text
tenant
account/person
IP where appropriate
feature
```

Avoid globally throttling one college because another college is abusive.

---

# 217. Cost Attribution

Where practical, record usage by tenant for expensive shared resources.

Examples:

```text
AI tokens
AI requests
file storage
generated files
email/SMS notifications
background jobs
```

This enables:

- internal cost analysis
- pricing decisions
- tenant quotas
- abuse detection
- enterprise billing later

---

# 218. AI Usage Ledger

Recommended future entity:

```text
ai_usage_events
```

Possible fields:

```text
id
tenant_id
person_id
feature
provider
model
input_tokens
output_tokens
estimated_cost
request_id
created_at
```

This is operational/billing metadata, not a source of student scoring truth.

Avoid storing sensitive prompt bodies here.

---

# 219. Infrastructure Cost Guardrails

Production should have:

```text
Cloud Run max instances
AI rate limits
provider spending limits where available
queue depth alerts
database utilization alerts
object-storage growth alerts
budget alerts
```

A coding bug should not be able to spawn unlimited compute or AI calls silently.

---

# 220. Repository Agent Rules for Infrastructure Changes

When an AI coding agent proposes an infrastructure addition, it must answer:

```text
What requirement does this solve?
Can the current stack solve it?
What is the expected fixed monthly cost?
What is the variable cost?
Does it create another always-on service?
Who operates it?
How is it backed up?
How is it monitored?
What tenant-isolation risks does it create?
```

Prefer the simpler architecture unless evidence supports the added complexity.

---

# 221. Preferred Initial Production Stack

Canonical preferred stack:

```text
MONOREPO
pnpm
Turborepo

WEB
React
Vite
React Router
TanStack Query
Zustand

MOBILE
Expo
React Native
Expo Router
TanStack Query
Zustand

API
Node.js
TypeScript
Fastify
Zod
Drizzle/tenant-compatible ORM
PostgreSQL

AI
Python
FastAPI
Pydantic
provider abstraction

WEB HOSTING / EDGE
Cloudflare Pages
Cloudflare DNS/CDN

API COMPUTE
Google Cloud Run

AI COMPUTE
Google Cloud Run

ASYNC TASKS
Google Cloud Tasks

FILES
Cloudflare R2

DATABASE
PostgreSQL
separate database + credential per college
shared clusters initially

CI/CD
GitHub Actions
Turborepo affected builds

INFRASTRUCTURE AS CODE
Terraform

OBSERVABILITY
structured logs
platform metrics
OpenTelemetry instrumentation
```

Equivalent cloud services may be substituted when business requirements justify them, but architecture principles must remain.

---

# 222. Initial Deployment Topology

```mermaid
flowchart TB

    WEB["React Web\nStatic Hosting / CDN"]
    MOBILE["Expo Mobile"]

    API["Node.js TypeScript API\nCloud Run\nScale-to-zero"]

    CONTROL["Control Plane DB"]

    ROUTER["Tenant DB Resolver"]

    PG["PostgreSQL Cluster"]

    A["College A DB"]
    B["College B DB"]
    C["College C DB"]

    STORAGE["Object Storage\nR2"]

    TASKS["Managed Task Queue"]

    AI["Python FastAPI AI Service\nCloud Run\nScale-to-zero"]

    MODELS["External LLM Providers"]

    WEB --> API
    MOBILE --> API

    API --> CONTROL
    API --> ROUTER
    ROUTER --> PG

    PG --> A
    PG --> B
    PG --> C

    API --> STORAGE

    API --> TASKS
    TASKS --> AI

    API --> AI
    AI --> MODELS
```

---

# 223. Infrastructure Evolution

## MVP

```text
1 static web deployment
1 shared API deployment
1 shared AI deployment
1 PostgreSQL cluster
few tenant DBs
1 object storage bucket/namespace
1 managed queue
```

---

## Early Multi-College

```text
same web deployment
autoscaling shared API
autoscaling shared AI
shared Postgres cluster with many isolated DBs
```

No per-college compute duplication.

---

## Growth

```text
multiple PostgreSQL clusters
tenant routing by cluster
higher API max instances
worker service if justified
more advanced observability
```

---

## Enterprise

```text
dedicated DB cluster for selected tenant
optional regional isolation
custom SSO
stronger contractual backup/DR
dedicated quotas
```

Shared application compute may still remain unless a contract requires dedicated compute.

---

# 224. Updated Infrastructure Invariants

All future infrastructure work must preserve:

1. **One college = one isolated operational database.**
2. **Database isolation does not require one server per college.**
3. **Each tenant DB should use independent restricted credentials.**
4. **Application compute is shared and stateless by default.**
5. **The Node API is a modular monolith initially.**
6. **The AI service is independently deployed.**
7. **The AI service does not directly own tenant DB access.**
8. **Web and mobile consume the same primary API.**
9. **One frontend build should support many tenant brands/configurations.**
10. **Scale-to-zero/usage-based infrastructure is preferred for low-utilization compute.**
11. **Large files belong in object storage, not relational DBs.**
12. **Large uploads should bypass the API through authorized direct uploads.**
13. **Managed tasks are preferred before deploying a dedicated Redis queue.**
14. **Kubernetes is not an initial requirement.**
15. **Large self-hosted LLM/GPU infrastructure is not an initial requirement.**
16. **AI calls must be cached/versioned where outputs can safely be reused.**
17. **Candidate filtering should use deterministic logic before expensive AI reranking.**
18. **Tenant migration/provisioning must be automated and auditable.**
19. **Infrastructure should be reproducible through IaC.**
20. **Secrets must never be committed to the repository.**
21. **Cloud costs should be measurable by tenant for expensive shared features where practical.**
22. **Core ERP behavior must survive AI service/provider outages.**
23. **New always-on infrastructure requires measured justification.**
24. **Physical tenant DB location must remain abstracted behind control-plane routing.**
25. **Deployment architecture must allow a tenant to move from shared to dedicated DB infrastructure without domain-model changes.**

---

# 225. Infrastructure Decision Rule

When choosing between two technically valid deployment approaches, prefer the one that provides:

```text
lower fixed monthly cost
fewer always-on services
managed operational burden
clear tenant boundaries
simple rollback
simple local development
easy observability
controlled scaling
independent AI scaling
migration path to enterprise infrastructure
```

Do not optimize prematurely for hypothetical millions of users by creating expensive distributed infrastructure.

The architecture should instead make the next scaling step possible without paying for it before it is needed.

---

# 226. Complete System Architecture Summary

The canonical architecture is:

```text
                            PLATFORM CONTROL PLANE
                                      |
                        tenant / DB routing / features
                                      |
                                      v

WEB -----------------------> SHARED NODE API <----------------------- MOBILE
React/Vite                    Cloud Run                               Expo
                                  |
             +--------------------+--------------------+
             |                    |                    |
             v                    v                    v
       CONTROL DB          TENANT DB ROUTER       OBJECT STORAGE
                                  |
                         +--------+--------+
                         |        |        |
                         v        v        v
                       DB A     DB B     DB C
                    College A College B College C

                                  |
                           async/sync AI call
                                  |
                                  v
                            AI SERVICE
                          Python/FastAPI
                                  |
                                  v
                          MODEL PROVIDERS
```

Interpretation:

```text
shared code
shared compute
shared deployment pipelines

but

isolated tenant operational state
scoped authorization
independent tenant DB credentials
```

This is the default architectural baseline unless a future ADR explicitly supersedes it.

---

# 227. Final Agent Checklist Before Architectural Changes

Before changing backend architecture, deployment topology, or persistence, verify:

```text
[ ] Does this preserve DB-per-college isolation?
[ ] Does this accidentally require a server per tenant?
[ ] Can the shared API remain stateless?
[ ] Is the new service actually independently scalable?
[ ] Can this remain inside the modular monolith?
[ ] Is AI kept outside the source-of-truth boundary?
[ ] Are external AI calls minimized and versioned?
[ ] Are uploads using object storage appropriately?
[ ] Is a managed service simpler than another always-on service?
[ ] Does the design work locally?
[ ] Does CI deploy only affected applications?
[ ] Are schema migrations safe across all tenant DBs?
[ ] Are secrets stored outside Git?
[ ] Is tenant routing trusted and server-side?
[ ] Is authorization checked before tenant DB operations?
[ ] Is the feature observable?
[ ] Is it retry-safe?
[ ] Is it idempotent where required?
[ ] Can cost be bounded?
[ ] Is there a clear future scaling path?
```

If several answers are "no", reconsider the design before implementation.
