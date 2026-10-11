# CareerOS - Agent Context & Knowledge Base
**Auto-Generated Context File for AI Agents / LLMs**

**Do not delete this file.** This file contains the complete architectural, product, and business context for CareerOS. Any AI agent assisting with the development of this repository MUST read and adhere to this context to ensure alignment with the V1 product goals.

---

## 1. Project Identity & Mission
*   **Project Name:** CareerOS (by ThinkBuild)
*   **Target Audience:** Tier 2 and Tier 3 Engineering Institutes.
*   **Core Mission:** Mathematically engineer higher placement ratios by automating the TPO (Placement Cell) workflow, providing AI tools to students/recruiters, and crowdsourcing off-campus jobs via the student/alumni network.
*   **Tech Stack:** pnpm + Turborepo Monorepo. Node.js (>=24.20.0), Express 5, Sequelize (PostgreSQL) for the API. React 19 + Vite for the Frontend (Admin).

---

## 2. Core Architecture (CRITICAL)
CareerOS is a true B2B Enterprise SaaS using a **Database-per-Tenant** architecture. 
*   **Central Identity (`ID_` and `CTRL_` tables):** Global user accounts (`ID_ACCOUNTS`) live in a central database. A user's identity is persistent across their entire career.
*   **Tenant Isolation (`CTRL_TENANT_DATABASE_REGISTRY`):** Every institute has its own completely isolated, private database. The backend must dynamically route queries to the correct database based on this registry.
*   **Role Mapping:** Roles are handled dynamically via the `ID_ACCOUNT_TENANT_MEMBERSHIPS` table (`membership_type` = 'STUDENT', 'ALUMNI', 'TPO', 'RECRUITER').

---

## 3. The 7-Role Model
The system is built around 7 interconnected actors:
1.  **Student:** Builds verified profiles, takes assessments, uses AI resume optimization.
2.  **TPO (Training & Placement Officer):** Automates placement drives, enforces policies, manages HR CRM.
3.  **Recruiter:** Uses AI to get instant batch recommendations instead of sorting through resumes manually.
4.  **Alumni:** Transitions from student to alumni, providing mentorship and posting referral jobs.
5.  **Faculty:** Academic support.
6.  **Institute Admin:** Manages ERP integration, roles, and tenant configuration.
7.  **ThinkBuild Super Admin:** Manages the SaaS platform globally.

---

## 4. Key V1 Features & Terminology (Must Know)

When developing features, refer to these specific CareerOS modules:

### A. COCS (Career Opportunity Contribution System)
*   **What it is:** The student and alumni-driven referral engine.
*   **Mechanic:** Users find off-campus job links -> Submit them to CareerOS -> TPO verifies -> Platform broadcasts to eligible students. If a peer gets hired, the original poster gets a physical/monetary reward from the college.
*   **Tables to reference/build:** `COCS_OPPORTUNITY`, `COCS_REWARDS_LEDGER`.

### B. TACIE (ThinkBuild AI Career Intelligence Engine)
*   **What it is:** The underlying AI layer utilizing LLMs.
*   **For Students:** **AI ATS Optimizer.** Scans a student's profile against a Job Description and warns them of missing keywords to prevent bot rejection.
*   **For Recruiters:** **AI Candidate Recommendation.** Recruiters input their exact needs (e.g., "Top 20 Java Devs"), and TACIE instantly outputs the perfect candidate shortlist based on verified platform data.

### C. Automated Offer Policy (The Placement Multiplier)
*   **What it is:** Mathematical enforcement to prevent "Offer Hoarding."
*   **Mechanic:** If a student secures a job (e.g., Tier-2), the system automatically locks their account from applying to any future Tier-2 or Tier-3 jobs, pushing those opportunities down to unplaced students.

### D. ERP Integration & Tamper-Proofing
*   **Mechanic:** Core academic data (`CGPA`, `active_backlogs`) is strictly **Read-Only** for students. It must be populated via TPO bulk CSV upload or direct ERP API integration to guarantee 100% data authenticity to recruiters.

### E. Assessments Module
*   **What it is:** Built-in LeetCode-styled coding tests.
*   **Mechanic:** Used for weekly upskilling and company-specific mock placement drives to help Tier 2/3 students clear the initial automated coding rounds of major IT firms.

---

## 5. Development Guidelines for Future Agents
1.  **Always respect the multi-tenant boundary.** Never write queries that mix tenant data.
2.  **Use `@repo/types`** for any payload definitions crossing the API/Frontend boundary.
3.  **Use `BaseRepository` and `BaseService`** inheritance for standard CRUD operations in the API.
4.  **Before writing new features**, always check if the logic belongs in the `identity` module (Central DB) or the `institute` module (Tenant DB).
