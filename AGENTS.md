# CareerOS — API Agent Guide & cURL Reference (AGENTS.md)

This document provides a complete, canonical reference of all API endpoints across all **28 registered modules** in CareerOS. Coding agents, frontend engineers, integration partners, and automated testing tools must use these exact routes, HTTP verbs, headers, and JSON request/response formats.

---

## 1. Global Conventions & Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `BASE_URL` | `http://localhost:5000` | Base URL for the CareerOS Node.js / Express API |
| `API_PREFIX` | `/api` | Root prefix for all domain modules |
| `TENANT_ID` | `00000000-0000-0000-0000-000000000001` | UUID identifying the current college tenant |

### Standard Request Headers
```bash
-H "Content-Type: application/json" \
-H "x-tenant-id: 00000000-0000-0000-0000-000000000001"
```

### Standard Response Envelope
All standard endpoints return JSON with a `success` boolean:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-10-23T05:00:00.000Z"
}
```

---

## Table of Contents

1. [System & Health](#1-system--health)
2. [Platform Control Plane (`/api/control`)](#2-platform-control-plane-apicontrol)
3. [Platform Super Admin (`/api/admin`)](#3-platform-super-admin-apiadmin)
4. [Identity & RBAC (`/api/identity`)](#4-identity--rbac-apiidentity)
5. [Users (`/api/users`)](#5-users-apiusers)
6. [Students (`/api/students`)](#6-students-apistudents)
7. [Academic (`/api/academic`)](#7-academic-apiacademic)
8. [Institutions (`/api/institutions`)](#8-institutions-apiinstitutions)
9. [Departments (`/api/departments`)](#9-departments-apidepartments)
10. [Programs (`/api/programs`)](#10-programs-apiprograms)
11. [Cohorts (`/api/cohorts`)](#11-cohorts-apicohorts)
12. [Companies & CRM (`/api/companies`)](#12-companies--crm-apicompanies)
13. [Placements, Drives & Offers (`/api/placements`)](#13-placements-drives--offers-apiplacements)
14. [TACIE AI & Quotas (`/api/tacie`)](#14-tacie-ai--quotas-apitacie)
15. [Assessments & Proctoring (`/api/assessments`)](#15-assessments--proctoring-apiassessments)
16. [Alumni & Mentorship (`/api/alumni`)](#16-alumni--mentorship-apialumni)
17. [Chat & Messaging (`/api/chat`)](#17-chat--messaging-apichat)
18. [Skills & Evidence (`/api/skills`)](#18-skills--evidence-apiskills)
19. [Resumes (`/api/resumes`)](#19-resumes-apiresumes)
20. [Student Projects (`/api/projects`)](#20-student-projects-apiprojects)
21. [Notifications (`/api/notifications`)](#21-notifications-apinotifications)
22. [Learning Marketplace (`/api/learning`)](#22-learning-marketplace-apilearning)
23. [Moderation (`/api/moderation`)](#23-moderation-apimoderation)
24. [Reputation & Trust (`/api/reputation`)](#24-reputation--trust-apireputation)
25. [Rewards Ledger (`/api/rewards`)](#25-rewards-ledger-apirewards)
26. [Integrations & Sync (`/api/integrations`)](#26-integrations--sync-apiintegrations)
27. [Knowledge Base & RAG (`/api/knowledge`)](#27-knowledge-base--rag-apiknowledge)
28. [Audit & Access Logs (`/api/audit`)](#28-audit--access-logs-apiaudit)

---

## 1. System & Health

### 1.1 Root Info
```bash
curl -X GET "http://localhost:5000/"
```

### 1.2 System Health Check
```bash
curl -X GET "http://localhost:5000/api/health"
```

---

## 2. Platform Control Plane (`/api/control`)

### 2.1 Get All Tenants
```bash
curl -X GET "http://localhost:5000/api/control/tenants?page=1&limit=20"
```

### 2.2 Create Tenant (Onboard College)
```bash
curl -X POST "http://localhost:5000/api/control/tenants" \
  -H "Content-Type: application/json" \
  -d '{
    "college_code": "1042",
    "name": "Apex Institute of Technology",
    "slug": "apex-tech",
    "institution_type": "UNIVERSITY",
    "status": "ACTIVE"
  }'
```

### 2.3 Get Tenant by ID
```bash
curl -X GET "http://localhost:5000/api/control/tenants/TENANT_UUID"
```

### 2.4 Update Tenant
```bash
curl -X PUT "http://localhost:5000/api/control/tenants/TENANT_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apex Institute of Technology & Research",
    "status": "ACTIVE"
  }'
```

### 2.5 Delete Tenant
```bash
curl -X DELETE "http://localhost:5000/api/control/tenants/TENANT_UUID"
```

### 2.6 List Subscriptions
```bash
curl -X GET "http://localhost:5000/api/control/subscriptions?page=1&limit=20"
```

### 2.7 Create Subscription
```bash
curl -X POST "http://localhost:5000/api/control/subscriptions" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "TENANT_UUID",
    "plan_code": "ENTERPRISE",
    "status": "ACTIVE",
    "starts_at": "2026-01-01T00:00:00Z"
  }'
```

### 2.8 List Platform Admins
```bash
curl -X GET "http://localhost:5000/api/control/admins"
```

### 2.9 Create Platform Admin
```bash
curl -X POST "http://localhost:5000/api/control/admins" \
  -H "Content-Type: application/json" \
  -d '{
    "global_user_id": "GLOBAL_USER_UUID",
    "access_level": "SUPER_ADMIN",
    "status": "ACTIVE"
  }'
```

### 2.10 Update Platform Admin
```bash
curl -X PUT "http://localhost:5000/api/control/admins/ADMIN_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "access_level": "OPERATOR",
    "status": "ACTIVE"
  }'
```

### 2.11 Delete Platform Admin
```bash
curl -X DELETE "http://localhost:5000/api/control/admins/ADMIN_UUID"
```

### 2.12 List Provisioning Jobs
```bash
curl -X GET "http://localhost:5000/api/control/jobs?page=1&limit=20"
```

### 2.13 Create Provisioning Job
```bash
curl -X POST "http://localhost:5000/api/control/jobs" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "TENANT_UUID",
    "status": "QUEUED",
    "current_step": "DATABASE_PROVISIONING"
  }'
```

---

## 3. Platform Super Admin (`/api/admin`)

### 3.1 Get Super Admin Dashboard Metrics
Aggregated KPIs: institutions, active users, AI tokens, estimated costs, messages, integrations, and recent audit trails.
```bash
curl -X GET "http://localhost:5000/api/admin/dashboard"
```

### 3.2 Platform Admin Health Probe
```bash
curl -X GET "http://localhost:5000/api/admin/health"
```

### 3.3 Get Platform Settings
```bash
curl -X GET "http://localhost:5000/api/admin/settings"
```

### 3.4 Update Platform Settings (Maintenance Mode, AI flags, MFA)
```bash
curl -X PUT "http://localhost:5000/api/admin/settings" \
  -H "Content-Type: application/json" \
  -d '{
    "defaultAiModule": true,
    "assessmentHub": true,
    "alumniNetwork": true,
    "adminMfa": true,
    "supportApproval": true,
    "verboseAuthErrors": false,
    "provisioningPaused": false,
    "maintenanceMode": false
  }'
```

---

## 4. Identity & RBAC (`/api/identity`)

### 4.1 Get All Roles
```bash
curl -X GET "http://localhost:5000/api/identity/roles?page=1&limit=20"
```

### 4.2 Create Role
```bash
curl -X POST "http://localhost:5000/api/identity/roles" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Central TPO",
    "code": "CENTRAL_TPO",
    "description": "Institution-wide training and placement officer"
  }'
```

### 4.3 Get Role by ID
```bash
curl -X GET "http://localhost:5000/api/identity/roles/ROLE_UUID"
```

### 4.4 Update Role
```bash
curl -X PUT "http://localhost:5000/api/identity/roles/ROLE_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Head of Placement",
    "code": "HEAD_TPO"
  }'
```

### 4.5 Delete Role
```bash
curl -X DELETE "http://localhost:5000/api/identity/roles/ROLE_UUID"
```

### 4.6 Get All Permissions
```bash
curl -X GET "http://localhost:5000/api/identity/permissions?page=1&limit=50"
```

### 4.7 Create Permission
```bash
curl -X POST "http://localhost:5000/api/identity/permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Approve Job Drives",
    "code": "DRIVES:APPROVE",
    "description": "Authorize placement drives for department/college"
  }'
```

### 4.8 Delete Permission
```bash
curl -X DELETE "http://localhost:5000/api/identity/permissions/PERMISSION_UUID"
```

### 4.9 Map Permission to Role
```bash
curl -X POST "http://localhost:5000/api/identity/role-permissions" \
  -H "Content-Type: application/json" \
  -d '{
    "role_id": "ROLE_UUID",
    "permission_id": "PERMISSION_UUID"
  }'
```

### 4.10 Remove Permission from Role
```bash
curl -X DELETE "http://localhost:5000/api/identity/role-permissions/ROLE_PERMISSION_UUID"
```

### 4.11 Get All Role Assignments
```bash
curl -X GET "http://localhost:5000/api/identity/assignments?page=1&limit=20"
```

### 4.12 Create Scoped Role Assignment
Supported `scope_type`: `PLATFORM`, `INSTITUTION`, `DEPARTMENT`, `PROGRAM`, `COHORT`, `DRIVE`, `STUDENT`.
```bash
curl -X POST "http://localhost:5000/api/identity/assignments" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_UUID",
    "role_id": "ROLE_UUID",
    "scope_type": "DEPARTMENT",
    "scope_id": "DEPARTMENT_UUID"
  }'
```

### 4.13 Update Role Assignment
```bash
curl -X PUT "http://localhost:5000/api/identity/assignments/ASSIGNMENT_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "scope_type": "INSTITUTION",
    "scope_id": "INSTITUTION_UUID"
  }'
```

---

## 5. Users (`/api/users`)

### 5.1 List Users
```bash
curl -X GET "http://localhost:5000/api/users?page=1&limit=20"
```

### 5.2 Create User
```bash
curl -X POST "http://localhost:5000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aarav.sharma@apex.edu",
    "name": "Aarav Sharma",
    "status": "ACTIVE"
  }'
```

### 5.3 Get User by ID
```bash
curl -X GET "http://localhost:5000/api/users/USER_UUID"
```

### 5.4 Update User
```bash
curl -X PUT "http://localhost:5000/api/users/USER_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aarav K. Sharma",
    "status": "ACTIVE"
  }'
```

### 5.5 Delete User
```bash
curl -X DELETE "http://localhost:5000/api/users/USER_UUID"
```

---

## 6. Students (`/api/students`)

### 6.1 List Students
```bash
curl -X GET "http://localhost:5000/api/students?page=1&limit=20"
```

### 6.2 Create Student Profile
```bash
curl -X POST "http://localhost:5000/api/students" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_UUID",
    "enrollment_number": "EN2024CS0192",
    "batch_year": 2026,
    "degree": "B.Tech Computer Science",
    "is_placed": false
  }'
```

### 6.3 Get Student Profile by ID
```bash
curl -X GET "http://localhost:5000/api/students/STUDENT_UUID"
```

### 6.4 Update Student Profile
```bash
curl -X PUT "http://localhost:5000/api/students/STUDENT_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "degree": "B.Tech CSE (Hons in AI)"
  }'
```

### 6.5 Get Student Career Profile (Bio, Preferred Roles, Target CTC)
```bash
curl -X GET "http://localhost:5000/api/students/STUDENT_UUID/career-profile"
```

### 6.6 Update Student Privacy Preferences
```bash
curl -X PUT "http://localhost:5000/api/students/STUDENT_UUID/preferences" \
  -H "Content-Type: application/json" \
  -d '{
    "recruiter_discovery_enabled": true,
    "resume_visibility": "PUBLIC",
    "alumni_connection_enabled": true,
    "learning_profile_visibility": "PUBLIC",
    "assessment_visibility": "COMPANIES_ONLY"
  }'
```

### 6.7 Submit Student Request (NOC, Reschedule, Policy Exception)
Allowed `request_type`: `OFF_CAMPUS_NOC`, `DRIVE_EXCEPTION`, `INTERVIEW_RESCHEDULE`, `PLACEMENT_POLICY_EXCEPTION`, `ACADEMIC_CORRECTION`, `DUTY_LEAVE`, `DOCUMENT_REQUEST`, `OTHER`.
```bash
curl -X POST "http://localhost:5000/api/students/requests" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID",
    "request_type": "OFF_CAMPUS_NOC",
    "title": "NOC for Summer Research Internship at Microsoft Research",
    "details": {
      "company": "Microsoft Research",
      "duration_months": 2,
      "stipend": 125000
    }
  }'
```

### 6.8 Get Pending Student Requests (TPO Queue)
```bash
curl -X GET "http://localhost:5000/api/students/requests/pending"
```

### 6.9 Create Student Action Item (SLA Queue)
```bash
curl -X POST "http://localhost:5000/api/students/action-items" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID",
    "title": "Accept or Decline Goldman Sachs Full-Time Offer",
    "action_type": "OFFER_DECISION",
    "reference_id": "OFFER_UUID",
    "deadline": "2026-11-01T18:00:00Z"
  }'
```

### 6.10 Complete Action Item (Idempotent)
```bash
curl -X PATCH "http://localhost:5000/api/students/action-items/ACTION_ITEM_UUID/complete"
```

---

## 7. Academic (`/api/academic`)

### 7.1 List Academic Records (Append-only)
```bash
curl -X GET "http://localhost:5000/api/academic/records?page=1&limit=20"
```

### 7.2 Post Verified Academic Record
```bash
curl -X POST "http://localhost:5000/api/academic/records" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID",
    "cgpa": 9.15,
    "sgpa_history": [9.0, 9.2, 9.1, 9.3],
    "active_backlogs": 0,
    "total_backlogs_history": 0,
    "tenth_percentage": 94.5,
    "twelfth_percentage": 93.2,
    "verified_by_user_id": "TPO_USER_UUID"
  }'
```

### 7.3 Get Academic Record by ID
```bash
curl -X GET "http://localhost:5000/api/academic/records/RECORD_UUID"
```

### 7.4 List Academic Memberships
```bash
curl -X GET "http://localhost:5000/api/academic/memberships"
```

### 7.5 Create Academic Membership (Bind Student to Dept/Program/Cohort)
```bash
curl -X POST "http://localhost:5000/api/academic/memberships" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID",
    "department_id": "DEPARTMENT_UUID",
    "program_id": "PROGRAM_UUID",
    "cohort_id": "COHORT_UUID"
  }'
```

### 7.6 Update Academic Membership
```bash
curl -X PUT "http://localhost:5000/api/academic/memberships/MEMBERSHIP_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "cohort_id": "NEW_COHORT_UUID"
  }'
```

### 7.7 Detect Timetable & Exam Conflicts
Checks whether planned interviews or tests overlap with semester exams or classes.
```bash
curl -X POST "http://localhost:5000/api/academic/events/conflicts" \
  -H "Content-Type: application/json" \
  -d '{
    "department_id": "DEPARTMENT_UUID",
    "starts_at": "2026-11-10T09:00:00Z",
    "ends_at": "2026-11-10T14:00:00Z"
  }'
```

### 7.8 List Academic Events
```bash
curl -X GET "http://localhost:5000/api/academic/events"
```

### 7.9 Create Academic Event
```bash
curl -X POST "http://localhost:5000/api/academic/events" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Semester 7 Midterm Examinations",
    "event_type": "EXAM",
    "department_id": "DEPARTMENT_UUID",
    "starts_at": "2026-11-10T09:00:00Z",
    "ends_at": "2026-11-17T17:00:00Z"
  }'
```

---

## 8. Institutions (`/api/institutions`)

### 8.1 List Institutions
```bash
curl -X GET "http://localhost:5000/api/institutions?page=1&limit=20"
```

### 8.2 Create Institution
```bash
curl -X POST "http://localhost:5000/api/institutions" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MIT College of Engineering",
    "code": "MITCOE",
    "domain": "mitcoe.edu",
    "status": "ACTIVE"
  }'
```

### 8.3 Get Institution by ID
```bash
curl -X GET "http://localhost:5000/api/institutions/INSTITUTION_UUID"
```

### 8.4 Update Institution
```bash
curl -X PUT "http://localhost:5000/api/institutions/INSTITUTION_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MIT Academy of Engineering",
    "status": "ACTIVE"
  }'
```

### 8.5 Delete Institution
```bash
curl -X DELETE "http://localhost:5000/api/institutions/INSTITUTION_UUID"
```

---

## 9. Departments (`/api/departments`)

### 9.1 List Departments
```bash
curl -X GET "http://localhost:5000/api/departments?page=1&limit=20"
```

### 9.2 Create Department
```bash
curl -X POST "http://localhost:5000/api/departments" \
  -H "Content-Type: application/json" \
  -d '{
    "institution_id": "INSTITUTION_UUID",
    "name": "Computer Science and Engineering",
    "code": "CSE"
  }'
```

### 9.3 Get Department by ID
```bash
curl -X GET "http://localhost:5000/api/departments/DEPARTMENT_UUID"
```

### 9.4 Update Department
```bash
curl -X PUT "http://localhost:5000/api/departments/DEPARTMENT_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Computer Science & Engineering (AI/ML)"
  }'
```

### 9.5 Delete Department
```bash
curl -X DELETE "http://localhost:5000/api/departments/DEPARTMENT_UUID"
```

### 9.6 Get Department Placement Settings
```bash
curl -X GET "http://localhost:5000/api/departments/DEPARTMENT_UUID/settings"
```

---

## 10. Programs (`/api/programs`)

### 10.1 List Programs
```bash
curl -X GET "http://localhost:5000/api/programs"
```

### 10.2 Create Program
```bash
curl -X POST "http://localhost:5000/api/programs" \
  -H "Content-Type: application/json" \
  -d '{
    "department_id": "DEPARTMENT_UUID",
    "name": "Bachelor of Technology",
    "code": "BTECH",
    "duration_years": 4
  }'
```

### 10.3 Get Program by ID
```bash
curl -X GET "http://localhost:5000/api/programs/PROGRAM_UUID"
```

### 10.4 Update Program
```bash
curl -X PUT "http://localhost:5000/api/programs/PROGRAM_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "B.Tech (Honours)"
  }'
```

### 10.5 Delete Program
```bash
curl -X DELETE "http://localhost:5000/api/programs/PROGRAM_UUID"
```

---

## 11. Cohorts (`/api/cohorts`)

### 11.1 List Cohorts
```bash
curl -X GET "http://localhost:5000/api/cohorts"
```

### 11.2 Create Cohort
```bash
curl -X POST "http://localhost:5000/api/cohorts" \
  -H "Content-Type: application/json" \
  -d '{
    "program_id": "PROGRAM_UUID",
    "name": "CSE Batch of 2026 - Division A",
    "graduation_year": 2026
  }'
```

### 11.3 Get Cohort by ID
```bash
curl -X GET "http://localhost:5000/api/cohorts/COHORT_UUID"
```

### 11.4 Update Cohort
```bash
curl -X PUT "http://localhost:5000/api/cohorts/COHORT_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CSE 2026 Div A (Accelerated)"
  }'
```

### 11.5 Delete Cohort
```bash
curl -X DELETE "http://localhost:5000/api/cohorts/COHORT_UUID"
```

---

## 12. Companies & CRM (`/api/companies`)

### 12.1 List Companies
```bash
curl -X GET "http://localhost:5000/api/companies?page=1&limit=20"
```

### 12.2 Create Company
```bash
curl -X POST "http://localhost:5000/api/companies" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Google India Pvt Ltd",
    "domain": "google.com",
    "tier": "TIER_1_SUPER_DREAM",
    "industry": "Technology",
    "headquarters": "Bengaluru, India"
  }'
```

### 12.3 Get Company by ID
```bash
curl -X GET "http://localhost:5000/api/companies/COMPANY_UUID"
```

### 12.4 Update Company
```bash
curl -X PUT "http://localhost:5000/api/companies/COMPANY_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "DREAM"
  }'
```

### 12.5 List Recruiter Campus Visits
```bash
curl -X GET "http://localhost:5000/api/companies/visits"
```

### 12.6 Add Recruiter / Company Contact
```bash
curl -X POST "http://localhost:5000/api/companies/contacts" \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "COMPANY_UUID",
    "name": "Priya Nair",
    "designation": "University Relations Lead",
    "email": "pnair@company.com",
    "phone": "+919876543210"
  }'
```

---

## 13. Placements, Drives & Offers (`/api/placements`)

### 13.1 List Placement Seasons
```bash
curl -X GET "http://localhost:5000/api/placements/seasons"
```

### 13.2 Create Placement Season
```bash
curl -X POST "http://localhost:5000/api/placements/seasons" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Placement Season 2025-2026",
    "academic_year": "2025-2026",
    "status": "ACTIVE"
  }'
```

### 13.3 List Job Opportunities
```bash
curl -X GET "http://localhost:5000/api/placements/opportunities?page=1&limit=20"
```

### 13.4 Create Job Opportunity
```bash
curl -X POST "http://localhost:5000/api/placements/opportunities" \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "COMPANY_UUID",
    "title": "Software Development Engineer 1",
    "job_type": "FULL_TIME",
    "base_salary": 1800000,
    "total_ctc": 2400000,
    "location": "Hyderabad / Hybrid"
  }'
```

### 13.5 Get Job Opportunity by ID
```bash
curl -X GET "http://localhost:5000/api/placements/opportunities/OPPORTUNITY_UUID"
```

### 13.6 List Placement Drives
```bash
curl -X GET "http://localhost:5000/api/placements/drives"
```

### 13.7 Submit Job Application
Binds selected immutable `resume_id` to student and job opportunity.
```bash
curl -X POST "http://localhost:5000/api/placements/apply" \
  -H "Content-Type: application/json" \
  -d '{
    "opportunity_id": "OPPORTUNITY_UUID",
    "student_id": "STUDENT_UUID",
    "resume_id": "RESUME_VERSION_UUID"
  }'
```

### 13.8 Update Application Status (Interview / Shortlist / Reject)
Appends status transition to immutable `APPLICATION_STATUS_HISTORY`.
```bash
curl -X PATCH "http://localhost:5000/api/placements/applications/APPLICATION_UUID/status" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SHORTLISTED_FOR_INTERVIEW",
    "changed_by": "RECRUITER_USER_UUID",
    "remarks": "Cleared Online Technical Assessment Round 1"
  }'
```

### 13.9 Accept Job Offer with Agreement Evidence
Durably accepts offer and binds signed document keys.
```bash
curl -X POST "http://localhost:5000/api/placements/offers/OFFER_UUID/accept" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STUDENT_UUID",
    "signed_document_object_key": "tenants/tenant-1/offers/signed_offer_102.pdf",
    "signature_reference": "DOCUSIGN_ENV_891278"
  }'
```

### 13.10 Get Student Placement Compliance & Strike Status
```bash
curl -X GET "http://localhost:5000/api/placements/compliance/STUDENT_UUID"
```

---

## 14. TACIE AI & Quotas (`/api/tacie`)

### 14.1 List TACIE AI Runs
```bash
curl -X GET "http://localhost:5000/api/tacie/runs?page=1&limit=20"
```

### 14.2 Start AI Run
```bash
curl -X POST "http://localhost:5000/api/tacie/runs" \
  -H "Content-Type: application/json" \
  -d '{
    "feature_name": "RESUME_TAILORING",
    "user_id": "USER_UUID",
    "model_name": "gemini-1.5-pro",
    "prompt_tokens": 1240,
    "status": "RUNNING"
  }'
```

### 14.3 Run TACIE Resume Analysis
```bash
curl -X POST "http://localhost:5000/api/tacie/resume-analysis" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_id": "RESUME_UUID",
    "ai_run_id": "AI_RUN_UUID",
    "overall_score": 88,
    "metrics": {
      "impact": 92,
      "ats_readability": 90,
      "action_verbs": 84
    }
  }'
```

### 14.4 Recruiter Natural Language Candidate Search
```bash
curl -X POST "http://localhost:5000/api/tacie/candidate-search" \
  -H "Content-Type: application/json" \
  -d '{
    "recruiter_id": "RECRUITER_USER_UUID",
    "query_text": "Students with hands-on Kubernetes and Golang distributed systems experience"
  }'
```

### 14.5 Candidate Match Run for Job Opportunity
```bash
curl -X POST "http://localhost:5000/api/tacie/candidate-match" \
  -H "Content-Type: application/json" \
  -d '{
    "job_opportunity_id": "OPPORTUNITY_UUID"
  }'
```

### 14.6 Student Skill Gap Analysis
```bash
curl -X POST "http://localhost:5000/api/tacie/skill-gap" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID",
    "target_role": "Backend Cloud Engineer"
  }'
```

### 14.7 Get User AI Quota & Remaining Balance
```bash
curl -X GET "http://localhost:5000/api/tacie/quota/USER_UUID?defaultLimit=100"
```

### 14.8 Grant Additional AI Credits
```bash
curl -X POST "http://localhost:5000/api/tacie/credits/grant" \
  -H "Content-Type: application/json" \
  -d '{
    "quotaId": "QUOTA_UUID",
    "credits": 250
  }'
```

---

## 15. Assessments & Proctoring (`/api/assessments`)

### 15.1 List Assessments
```bash
curl -X GET "http://localhost:5000/api/assessments?page=1&limit=20"
```

### 15.2 Create Assessment
```bash
curl -X POST "http://localhost:5000/api/assessments" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Data Structures & Algorithms Benchmarking",
    "category": "TECHNICAL",
    "duration_minutes": 90,
    "total_marks": 100,
    "pass_marks": 60
  }'
```

### 15.3 Get Assessment Details
```bash
curl -X GET "http://localhost:5000/api/assessments/ASSESSMENT_UUID"
```

### 15.4 Concurrency-Safe Assessment Slot Booking
Uses row-level locking (`SELECT FOR UPDATE`) to guarantee zero overbooking.
```bash
curl -X POST "http://localhost:5000/api/assessments/slots/book" \
  -H "Content-Type: application/json" \
  -d '{
    "slot_id": "SLOT_UUID",
    "student_id": "STUDENT_UUID"
  }'
```

### 15.5 Submit Hardware & Identity Proctor Preflight
Preflight validation for camera, mic, network, display, and face identity.
```bash
curl -X POST "http://localhost:5000/api/assessments/preflight" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID",
    "assessment_id": "ASSESSMENT_UUID",
    "camera_check": true,
    "mic_check": true,
    "screen_share_check": true,
    "identity_match_score": 98.4
  }'
```

### 15.6 Assign Assessment to Student / Cohort
```bash
curl -X POST "http://localhost:5000/api/assessments/assignments" \
  -H "Content-Type: application/json" \
  -d '{
    "assessment_id": "ASSESSMENT_UUID",
    "student_id": "STUDENT_UUID",
    "due_at": "2026-11-15T23:59:59Z"
  }'
```

### 15.7 Submit Assessment Attempt & Proctor Log
```bash
curl -X POST "http://localhost:5000/api/assessments/attempts" \
  -H "Content-Type: application/json" \
  -d '{
    "assessment_id": "ASSESSMENT_UUID",
    "student_id": "STUDENT_UUID",
    "score": 85,
    "passed": true,
    "proctor_events_count": 0
  }'
```

### 15.8 List Earned Assessment Badges
```bash
curl -X GET "http://localhost:5000/api/assessments/badges"
```

---

## 16. Alumni & Mentorship (`/api/alumni`)

### 16.1 List Alumni Profiles
```bash
curl -X GET "http://localhost:5000/api/alumni/profiles?page=1&limit=20"
```

### 16.2 Create Alumni Profile
```bash
curl -X POST "http://localhost:5000/api/alumni/profiles" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "ALUMNI_USER_UUID",
    "graduation_year": 2022,
    "current_company": "Microsoft",
    "current_role": "Senior Software Engineer",
    "is_available_for_mentorship": true
  }'
```

### 16.3 Get Alumni Profile by ID
```bash
curl -X GET "http://localhost:5000/api/alumni/profiles/ALUMNI_UUID"
```

### 16.4 List Referral Posts
```bash
curl -X GET "http://localhost:5000/api/alumni/referrals"
```

### 16.5 Create Referral Post
```bash
curl -X POST "http://localhost:5000/api/alumni/referrals" \
  -H "Content-Type: application/json" \
  -d '{
    "alumni_id": "ALUMNI_UUID",
    "company_name": "Microsoft",
    "role_title": "Frontend Engineer 2",
    "job_url": "https://careers.microsoft.com/us/en/job/182910",
    "max_referrals": 5
  }'
```

### 16.6 Request Alumni Referral (Attach Exact Resume Version)
```bash
curl -X POST "http://localhost:5000/api/alumni/referrals/request" \
  -H "Content-Type: application/json" \
  -d '{
    "referral_post_id": "REFERRAL_POST_UUID",
    "student_id": "STUDENT_UUID",
    "resume_version_id": "RESUME_VERSION_UUID",
    "message": "Hi, I have built real-world microfrontends with Angular 22 and would appreciate a referral."
  }'
```

### 16.7 Book Mentorship / Mock Interview Slot
Capacity-sensitive booking with concurrency protection.
```bash
curl -X POST "http://localhost:5000/api/alumni/mentorship/book" \
  -H "Content-Type: application/json" \
  -d '{
    "slot_id": "MENTORSHIP_SLOT_UUID",
    "student_id": "STUDENT_UUID",
    "session_type": "SYSTEM_DESIGN_MOCK"
  }'
```

### 16.8 Send Alumni Connection Request
```bash
curl -X POST "http://localhost:5000/api/alumni/connections" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID",
    "alumni_id": "ALUMNI_UUID",
    "note": "Looking for advice on preparing for cloud infrastructure interviews."
  }'
```

---

## 17. Chat & Messaging (`/api/chat`)

### 17.1 List Conversations
```bash
curl -X GET "http://localhost:5000/api/chat/conversations"
```

### 17.2 Create Conversation
Allowed `conversation_type`: `DIRECT`, `TACIE_ADVISOR`, `MENTORSHIP`, `ALUMNI_REFERRAL`, `PLACEMENT_SUPPORT`.
```bash
curl -X POST "http://localhost:5000/api/chat/conversations" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_type": "TACIE_ADVISOR",
    "title": "TACIE Resume Guidance",
    "participant_ids": ["USER_UUID"]
  }'
```

### 17.3 Get Conversation Details
```bash
curl -X GET "http://localhost:5000/api/chat/conversations/CONVERSATION_UUID"
```

### 17.4 Get Messages in Conversation
```bash
curl -X GET "http://localhost:5000/api/chat/conversations/CONVERSATION_UUID/messages"
```

### 17.5 Send Message
```bash
curl -X POST "http://localhost:5000/api/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "CONVERSATION_UUID",
    "sender_id": "USER_UUID",
    "content": "Can you review my project bullets for the upcoming Google drive?"
  }'
```

### 17.6 Send Message Read Receipt
```bash
curl -X POST "http://localhost:5000/api/chat/messages/read" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "CONVERSATION_UUID",
    "user_id": "USER_UUID",
    "message_id": "MESSAGE_UUID"
  }'
```

---

## 18. Skills & Evidence (`/api/skills`)

### 18.1 List Skills Master Catalog
```bash
curl -X GET "http://localhost:5000/api/skills?page=1&limit=50"
```

### 18.2 Create Catalog Skill
```bash
curl -X POST "http://localhost:5000/api/skills" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PostgreSQL Performance Tuning",
    "category": "DATABASE",
    "description": "Query optimization, EXPLAIN ANALYZE, indexing strategies"
  }'
```

### 18.3 Get Skill Details
```bash
curl -X GET "http://localhost:5000/api/skills/SKILL_UUID"
```

### 18.4 Get Student Skill Profile
```bash
curl -X GET "http://localhost:5000/api/skills/student/STUDENT_UUID"
```

### 18.5 Add Skill to Student Profile
```bash
curl -X POST "http://localhost:5000/api/skills/student" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID",
    "skill_id": "SKILL_UUID",
    "proficiency_level": "ADVANCED"
  }'
```

### 18.6 Submit Verified Skill Evidence
Evidence types: `PROCTORED_ASSESSMENT`, `TPO_VERIFIED`, `CERTIFICATE_VERIFIED`, `PROJECT_VERIFIED`, `SELF_DECLARED`.
```bash
curl -X POST "http://localhost:5000/api/skills/evidence" \
  -H "Content-Type: application/json" \
  -d '{
    "student_skill_id": "STUDENT_SKILL_UUID",
    "verification_type": "CERTIFICATE_VERIFIED",
    "evidence_url": "https://storage.careeros.dev/certs/aws_saa_192.pdf",
    "verified_by": "TPO_USER_UUID"
  }'
```

---

## 19. Resumes (`/api/resumes`)

### 19.1 List Student Resumes
```bash
curl -X GET "http://localhost:5000/api/resumes"
```

### 19.2 Create Resume Document
```bash
curl -X POST "http://localhost:5000/api/resumes" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID",
    "title": "Software Engineering Resume - Backend Focus"
  }'
```

### 19.3 Get Resume by ID
```bash
curl -X GET "http://localhost:5000/api/resumes/RESUME_UUID"
```

### 19.4 Update Resume
```bash
curl -X PUT "http://localhost:5000/api/resumes/RESUME_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "SWE & Systems Engineering Resume"
  }'
```

### 19.5 Get Immutable Resume Versions
```bash
curl -X GET "http://localhost:5000/api/resumes/RESUME_UUID/versions"
```

### 19.6 Create Immutable Resume Version (Preserves Historical Snapshot)
```bash
curl -X POST "http://localhost:5000/api/resumes/RESUME_UUID/versions" \
  -H "Content-Type: application/json" \
  -d '{
    "version_number": 2,
    "file_url": "tenants/tenant-1/resumes/aarav_swe_v2.pdf",
    "file_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "extracted_text": "Full stack engineer proficient in TypeScript, Angular, Go..."
  }'
```

---

## 20. Student Projects (`/api/projects`)

### 20.1 List Projects
```bash
curl -X GET "http://localhost:5000/api/projects?page=1&limit=20"
```

### 20.2 Add Student Project
```bash
curl -X POST "http://localhost:5000/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID",
    "title": "Distributed Task Scheduler in Go",
    "summary": "Raft consensus task orchestrator with persistent write-ahead logs",
    "github_url": "https://github.com/aarav/go-raft-scheduler",
    "project_url": "https://scheduler-demo.dev",
    "student_role": "Lead Architect",
    "impact_description": "Benchmarked 12,000 tasks/second on single node",
    "visibility": "PUBLIC"
  }'
```

### 20.3 Get Project by ID
```bash
curl -X GET "http://localhost:5000/api/projects/PROJECT_UUID"
```

### 20.4 Update Project
```bash
curl -X PUT "http://localhost:5000/api/projects/PROJECT_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "impact_description": "Benchmarked 15,000 tasks/second with RocksDB storage engine"
  }'
```

### 20.5 TPO / Faculty Project Verification
```bash
curl -X POST "http://localhost:5000/api/projects/PROJECT_UUID/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "verifier_id": "FACULTY_USER_UUID",
    "status": "VERIFIED",
    "remarks": "Reviewed code repository and live deployment. Authentic implementation."
  }'
```

---

## 21. Notifications (`/api/notifications`)

### 21.1 List In-App Notifications
```bash
curl -X GET "http://localhost:5000/api/notifications"
```

### 21.2 Create Notification
```bash
curl -X POST "http://localhost:5000/api/notifications" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_UUID",
    "title": "Interview Slot Confirmed",
    "message": "Your interview with Goldman Sachs is confirmed for tomorrow at 10:00 AM.",
    "type": "PLACEMENT_DRIVE"
  }'
```

### 21.3 Mark Notification as Read
```bash
curl -X PATCH "http://localhost:5000/api/notifications/NOTIFICATION_UUID/read"
```

### 21.4 Get Notification by ID
```bash
curl -X GET "http://localhost:5000/api/notifications/NOTIFICATION_UUID"
```

### 21.5 List Delivery History (Multi-channel)
Channels: `IN_APP`, `EMAIL`, `WHATSAPP`, `SMS`, `PUSH`.
```bash
curl -X GET "http://localhost:5000/api/notifications/deliveries/all"
```

### 21.6 Log External Notification Delivery Attempt
```bash
curl -X POST "http://localhost:5000/api/notifications/deliveries" \
  -H "Content-Type: application/json" \
  -d '{
    "notification_id": "NOTIFICATION_UUID",
    "channel": "WHATSAPP",
    "status": "DELIVERED"
  }'
```

### 21.7 Get User Notification Preferences
```bash
curl -X GET "http://localhost:5000/api/notifications/preferences/USER_UUID"
```

### 21.8 Update User Notification Preferences
```bash
curl -X POST "http://localhost:5000/api/notifications/preferences" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_UUID",
    "email_enabled": true,
    "whatsapp_enabled": true,
    "sms_enabled": false,
    "push_enabled": true
  }'
```

---

## 22. Learning Marketplace (`/api/learning`)

### 22.1 List Learning Posts
```bash
curl -X GET "http://localhost:5000/api/learning/posts?page=1&limit=20"
```

### 22.2 Create Learning Resource Post
```bash
curl -X POST "http://localhost:5000/api/learning/posts" \
  -H "Content-Type: application/json" \
  -d '{
    "author_id": "USER_UUID",
    "title": "System Design Handbook: Scaling to 10M Concurrent WebSockets",
    "content": "Deep dive into Redis PUB/SUB, Epoll sockets, and zero-copy buffers...",
    "category": "SYSTEM_DESIGN"
  }'
```

### 22.3 Get Learning Post by ID
```bash
curl -X GET "http://localhost:5000/api/learning/posts/POST_UUID"
```

### 22.4 Update Learning Post
```bash
curl -X PUT "http://localhost:5000/api/learning/posts/POST_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "System Design Handbook: Scaling to 20M Concurrent WebSockets"
  }'
```

### 22.5 Delete Learning Post
```bash
curl -X DELETE "http://localhost:5000/api/learning/posts/POST_UUID"
```

### 22.6 Add External Learning Resource Link
```bash
curl -X POST "http://localhost:5000/api/learning/resources" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "PostgreSQL Internals and Architecture",
    "resource_url": "https://www.postgresql.org/docs/current/internals.html",
    "resource_type": "DOCUMENTATION"
  }'
```

### 22.7 Add Comment to Post
```bash
curl -X POST "http://localhost:5000/api/learning/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": "POST_UUID",
    "author_id": "USER_UUID",
    "content": "Great explanation! Did you benchmark memory per idle connection?"
  }'
```

### 22.8 Toggle Saved Item (Bookmark)
Supported `item_type`: `JOB`, `LEARNING_POST`, `ALUMNI`, `REFERRAL_POST`, `ASSESSMENT`.
```bash
curl -X POST "http://localhost:5000/api/learning/saves/toggle" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_UUID",
    "item_type": "JOB",
    "item_id": "OPPORTUNITY_UUID"
  }'
```

### 22.9 Check if Item is Saved
```bash
curl -X GET "http://localhost:5000/api/learning/saves/check?userId=USER_UUID&itemType=JOB&itemId=OPPORTUNITY_UUID"
```

### 22.10 List All Saved Items for User
```bash
curl -X GET "http://localhost:5000/api/learning/saves/USER_UUID"
```

---

## 23. Moderation (`/api/moderation`)

### 23.1 List Automated Moderation Scans
```bash
curl -X GET "http://localhost:5000/api/moderation/moderations"
```

### 23.2 Run Content Moderation Scan
Categories: `RESUME_FRAUD`, `FAKE_EXPERIENCE_REQUEST`, `ASSESSMENT_CHEATING`, `PROCTORING_EVASION`, `REFERRAL_PAYMENT`, `RECRUITER_IMPERSONATION`.
```bash
curl -X POST "http://localhost:5000/api/moderation/moderations" \
  -H "Content-Type: application/json" \
  -d '{
    "message_id": "MESSAGE_UUID",
    "flagged": false,
    "confidence_score": 0.99
  }'
```

### 23.3 List User Reports
```bash
curl -X GET "http://localhost:5000/api/moderation/reports"
```

### 23.4 Submit Abuse / Fraud Report
```bash
curl -X POST "http://localhost:5000/api/moderation/reports" \
  -H "Content-Type: application/json" \
  -d '{
    "reporter_id": "USER_UUID",
    "reported_user_id": "OFFENDER_USER_UUID",
    "reason": "Offering paid referrals on behalf of company"
  }'
```

### 23.5 Update Report Review Status
```bash
curl -X PATCH "http://localhost:5000/api/moderation/reports/REPORT_UUID/status" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "INVESTIGATING"
  }'
```

### 23.6 List Moderation Cases
```bash
curl -X GET "http://localhost:5000/api/moderation/cases"
```

### 23.7 Create Formal Moderation Case
```bash
curl -X POST "http://localhost:5000/api/moderation/cases" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Investigation: Resume credential fabrication",
    "status": "OPEN",
    "assigned_to": "TPO_ADMIN_UUID"
  }'
```

### 23.8 Apply Moderation Action (Strike / Ban / Revoke)
```bash
curl -X POST "http://localhost:5000/api/moderation/actions" \
  -H "Content-Type: application/json" \
  -d '{
    "case_id": "CASE_UUID",
    "action_type": "ISSUE_STRIKE",
    "details": "Strike 1 issued due to unauthorized external contact sharing."
  }'
```

---

## 24. Reputation & Trust (`/api/reputation`)

### 24.1 List Reputation Events
```bash
curl -X GET "http://localhost:5000/api/reputation/events"
```

### 24.2 Issue Reputation Event
```bash
curl -X POST "http://localhost:5000/api/reputation/events" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID",
    "points": 50,
    "reason": "Submitted authentic job opportunity verified by TPO"
  }'
```

### 24.3 Get Student Reputation Summary
```bash
curl -X GET "http://localhost:5000/api/reputation/summaries/student/STUDENT_UUID"
```

### 24.4 Update Student Reputation Summary
```bash
curl -X PUT "http://localhost:5000/api/reputation/summaries/SUMMARY_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "trust_score": 96
  }'
```

---

## 25. Rewards Ledger (`/api/rewards`)

### 25.1 List Reward Transactions
```bash
curl -X GET "http://localhost:5000/api/rewards?page=1&limit=20"
```

### 25.2 Create Reward Transaction (Earn / Redeem Ledger)
Trust score and Reward points remain strictly decoupled ledgers.
```bash
curl -X POST "http://localhost:5000/api/rewards" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID",
    "points": 200,
    "transaction_type": "EARNED_PEER_HELP",
    "description": "Mentored 3 junior students in mock coding rounds"
  }'
```

### 25.3 Get Reward Transaction by ID
```bash
curl -X GET "http://localhost:5000/api/rewards/TRANSACTION_UUID"
```

---

## 26. Integrations & Sync (`/api/integrations`)

### 26.1 List ERP / SIS Integration Connections
```bash
curl -X GET "http://localhost:5000/api/integrations/connections"
```

### 26.2 Create Integration Connection (e.g. ERP, SAP, Ellucian)
```bash
curl -X POST "http://localhost:5000/api/integrations/connections" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Campus ERP Sync",
    "integration_type": "COLLEGE_ERP",
    "status": "ACTIVE"
  }'
```

### 26.3 Get Integration Connection by ID
```bash
curl -X GET "http://localhost:5000/api/integrations/connections/CONNECTION_UUID"
```

### 26.4 Update Integration Connection
```bash
curl -X PUT "http://localhost:5000/api/integrations/connections/CONNECTION_UUID" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PAUSED"
  }'
```

### 26.5 Delete Integration Connection
```bash
curl -X DELETE "http://localhost:5000/api/integrations/connections/CONNECTION_UUID"
```

### 26.6 Trigger Sync Job
```bash
curl -X POST "http://localhost:5000/api/integrations/sync-jobs" \
  -H "Content-Type: application/json" \
  -d '{
    "connection_id": "CONNECTION_UUID",
    "job_type": "STUDENT_ACADEMIC_SYNC",
    "status": "IN_PROGRESS"
  }'
```

### 26.7 Add External SIS ID Mapping
```bash
curl -X POST "http://localhost:5000/api/integrations/mappings" \
  -H "Content-Type: application/json" \
  -d '{
    "internal_id": "STUDENT_UUID",
    "external_id": "SIS_STUDENT_89410",
    "system_name": "BANNER_SIS"
  }'
```

---

## 27. Knowledge Base & RAG (`/api/knowledge`)

### 27.1 List College Policy Documents
```bash
curl -X GET "http://localhost:5000/api/knowledge/documents"
```

### 27.2 Register College Document for RAG Ingestion
```bash
curl -X POST "http://localhost:5000/api/knowledge/documents" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "College Placement Policy 2025-2026 Edition",
    "file_url": "tenants/tenant-1/docs/placement_policy_v2.pdf",
    "document_type": "PLACEMENT_POLICY"
  }'
```

### 27.3 List Chunks of Document
```bash
curl -X GET "http://localhost:5000/api/knowledge/chunks"
```

### 27.4 Add Parsed Text Chunk
```bash
curl -X POST "http://localhost:5000/api/knowledge/chunks" \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "DOCUMENT_UUID",
    "content": "Section 4.1: A student who secures an offer in a Dream category company (CTC >= 12 LPA) is eligible to participate only in Super Dream drives.",
    "chunk_index": 4
  }'
```

### 27.5 Save pgvector Embedding Vector (1536-dim or 768-dim)
```bash
curl -X POST "http://localhost:5000/api/knowledge/embeddings" \
  -H "Content-Type: application/json" \
  -d '{
    "chunk_id": "CHUNK_UUID",
    "embedding": [0.0124, -0.0412, 0.0891, 0.0031]
  }'
```

### 27.6 Create Document Ingestion Job
```bash
curl -X POST "http://localhost:5000/api/knowledge/jobs" \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "DOCUMENT_UUID",
    "status": "QUEUED"
  }'
```

---

## 28. Audit & Access Logs (`/api/audit`)

### 28.1 List Mutation Audit Logs
Records all administrative mutations, policy changes, and grade corrections.
```bash
curl -X GET "http://localhost:5000/api/audit?page=1&limit=20"
```

### 28.2 Create Mutation Audit Log
```bash
curl -X POST "http://localhost:5000/api/audit" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "UPDATE_POLICY",
    "entity_type": "PLACEMENT_POLICY",
    "entity_id": "POLICY_UUID",
    "actor_user_id": "TPO_ADMIN_UUID",
    "previous_value": { "dream_ctc_threshold": 1000000 },
    "new_value": { "dream_ctc_threshold": 1200000 }
  }'
```

### 28.3 Query Audit Logs for Specific Student
```bash
curl -X POST "http://localhost:5000/api/audit/student-logs" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_UUID"
  }'
```

### 28.4 Log Protected Resource Read / Download (`DATA_ACCESS_AUDIT`)
Mandatory audit log whenever resumes, transcripts, or proctor logs are viewed or downloaded.
```bash
curl -X POST "http://localhost:5000/api/audit/log-access" \
  -H "Content-Type: application/json" \
  -d '{
    "resource_owner_id": "STUDENT_UUID",
    "actor_user_id": "RECRUITER_USER_UUID",
    "resource_type": "RESUME_VERSION",
    "resource_id": "RESUME_VERSION_UUID",
    "access_type": "DOWNLOAD",
    "purpose": "Technical round candidate screening"
  }'
```

