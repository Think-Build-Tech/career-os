// apps/mobile/src/services/api.service.ts

import { Platform } from 'react-native';
import {
  StudentProfile,
  StudentActionItem,
  PlacementCompliance,
  SkillGapAnalysis,
  AcademicEvent,
  JobOpportunity,
  StudentApplication,
  PlacementOffer,
  ChatMessage,
  TacieQuota,
  VerifiedSkill,
} from '../types/student.types';
import {
  MOCK_STUDENT_PROFILE,
  MOCK_SLA_ITEMS,
  MOCK_COMPLIANCE,
  MOCK_SKILL_GAP,
  MOCK_ACADEMIC_EVENTS,
  MOCK_JOB_OPPORTUNITIES,
  MOCK_APPLICATIONS,
  MOCK_OFFERS,
  MOCK_CHAT_MESSAGES,
  MOCK_QUOTA,
  MOCK_VERIFIED_SKILLS,
  PROTOTYPE_COLLEGES,
} from './mockData';

// Determine default host based on platform
const getBaseUrl = (): string => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) {
    const normalized = configuredUrl.replace(/\/$/, '');
    return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

class MobileApiService {
  private baseUrl = getBaseUrl();
  private tenantId = '00000000-0000-0000-0000-000000000001'; // Default SITRC
  private collegeCode = '4821';
  private isOnline = false;

  public setBaseUrl(url: string) {
    this.baseUrl = url.trim().replace(/\/$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setTenantId(id: string) {
    this.tenantId = id;
  }

  public setCollegeCode(code: string) {
    this.collegeCode = code;
  }

  public getCollegeCode(): string {
    return this.collegeCode;
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-tenant-id': this.tenantId,
    };
  }

  // Check backend server health
  public async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const ok = res.ok;
      this.isOnline = ok;
      return ok;
    } catch {
      this.isOnline = false;
      return false;
    }
  }

  // Resolve College by 4-digit code (e.g. 4821, 7314, 8899)
  public async resolveCollege(codeOrSlug: string): Promise<{ success: boolean; tenant?: any; message: string }> {
    const code = codeOrSlug.trim();
    try {
      const res = await fetch(`${this.baseUrl}/control/resolve/${encodeURIComponent(code)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.tenant) {
          this.tenantId = json.tenant.id;
          this.collegeCode = json.tenant.college_code;
          return {
            success: true,
            tenant: json.tenant,
            message: json.message || `Connected to ${json.tenant.name}`,
          };
        }
      }
    } catch {
      // Offline fallback lookup
    }

    const proto = PROTOTYPE_COLLEGES.find((c) => c.code === code || c.shortName.toLowerCase() === code.toLowerCase());
    if (proto) {
      this.collegeCode = proto.code;
      return {
        success: true,
        tenant: {
          college_code: proto.code,
          name: proto.name,
          slug: proto.shortName.toLowerCase(),
          database: { database_name: `careeros_${proto.shortName.toLowerCase()}` },
        },
        message: `Connected to ${proto.name} (Code: ${proto.code})`,
      };
    }

    return {
      success: false,
      message: `Invalid college code "${code}". Please use 4821, 7314, 8899, etc.`,
    };
  }

  // Fetch Student Profile
  public async getStudentProfile(): Promise<StudentProfile> {
    try {
      const res = await fetch(`${this.baseUrl}/students/${MOCK_STUDENT_PROFILE.id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.student || json.data) {
          const s = json.student || json.data;
          return {
            ...MOCK_STUDENT_PROFILE,
            id: s.id || MOCK_STUDENT_PROFILE.id,
            name: s.user?.name || s.name || MOCK_STUDENT_PROFILE.name,
            degree: s.degree || MOCK_STUDENT_PROFILE.degree,
            enrollmentNumber: s.enrollment_number || MOCK_STUDENT_PROFILE.enrollmentNumber,
            batchYear: s.batch_year || MOCK_STUDENT_PROFILE.batchYear,
            collegeCode: this.collegeCode,
          };
        }
      }
    } catch {
      // fallback
    }
    return { ...MOCK_STUDENT_PROFILE, collegeCode: this.collegeCode };
  }

  // Fetch Action Items / SLA Queue
  public async getActionItems(): Promise<StudentActionItem[]> {
    try {
      const res = await fetch(`${this.baseUrl}/students/action-items?student_id=${MOCK_STUDENT_PROFILE.id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        const items = json.actionItems || json.data || json.rows;
        if (Array.isArray(items) && items.length > 0) {
          return items.map((i: any) => ({
            id: i.id,
            title: i.title,
            subtitle: i.subtitle || i.action_type,
            actionType: i.action_type,
            deadline: i.deadline,
            completedAt: i.completed_at,
            referenceId: i.reference_id,
          }));
        }
      }
    } catch {
      // fallback
    }
    return MOCK_SLA_ITEMS;
  }

  // Complete an SLA Item
  public async completeActionItem(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/students/action-items/${id}/complete`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    return true;
  }

  // Fetch Placement Compliance Status
  public async getCompliance(): Promise<PlacementCompliance> {
    try {
      const res = await fetch(`${this.baseUrl}/placements/compliance/${MOCK_STUDENT_PROFILE.id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        const c = json.compliance || json.data;
        if (c) {
          return {
            studentId: MOCK_STUDENT_PROFILE.id,
            activeStrikes: c.active_strikes ?? 0,
            maxAllowedStrikes: c.max_allowed_strikes ?? 2,
            isDebarred: c.is_debarred ?? false,
            policyStanding: c.policy_standing || 'Active · In Good Standing',
            attendanceRate: 100,
          };
        }
      }
    } catch {
      // fallback
    }
    return MOCK_COMPLIANCE;
  }

  // Fetch Skill Gap & Career Readiness
  public async getSkillGap(targetRole = 'Backend Cloud Engineer'): Promise<SkillGapAnalysis> {
    try {
      const res = await fetch(`${this.baseUrl}/tacie/skill-gap`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          student_id: MOCK_STUDENT_PROFILE.id,
          target_role: targetRole,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const gap = json.analysis || json.data;
        if (gap) {
          return {
            targetRole,
            overallReadiness: gap.overall_readiness_score || 88,
            cohortPercentile: gap.cohort_percentile_label || 'Top 5% Cohort',
            benchmarkSummary: gap.benchmark_summary || MOCK_SKILL_GAP.benchmarkSummary,
            breakdown: gap.breakdown?.map((b: any) => ({
              label: b.label,
              scorePercentage: b.score_percentage,
              tone: b.tone,
            })) || MOCK_SKILL_GAP.breakdown,
            highestRoiAction: gap.highest_roi_action,
          };
        }
      }
    } catch {
      // fallback
    }
    return { ...MOCK_SKILL_GAP, targetRole };
  }

  // Fetch Academic Events & Conflict Detection
  public async getAcademicEvents(): Promise<AcademicEvent[]> {
    try {
      const res = await fetch(`${this.baseUrl}/academic/events`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        const evs = json.events || json.data || json.rows;
        if (Array.isArray(evs) && evs.length > 0) {
          return evs.map((e: any) => ({
            id: e.id,
            title: e.title,
            eventType: e.event_type || 'EXAM',
            startsAt: e.starts_at,
            endsAt: e.ends_at,
            subtitle: e.subtitle || 'SPPU Exam Cell',
            hasConflict: false,
          }));
        }
      }
    } catch {
      // fallback
    }
    return MOCK_ACADEMIC_EVENTS;
  }

  // Fetch Job Opportunities / Active Drives
  public async getJobOpportunities(): Promise<JobOpportunity[]> {
    try {
      const res = await fetch(`${this.baseUrl}/placements/opportunities?page=1&limit=20`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        const rows = json.opportunities?.rows || json.opportunities || json.data;
        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map((r: any, idx: number) => {
            const mockMatch = MOCK_JOB_OPPORTUNITIES[idx % MOCK_JOB_OPPORTUNITIES.length];
            const ctc = Number(r.total_ctc) || mockMatch.totalCtc;
            return {
              id: r.id,
              companyId: r.company_id || mockMatch.companyId,
              companyName: r.company?.name || mockMatch.companyName,
              title: r.title || mockMatch.title,
              jobCode: r.job_code || `DRIVE-${r.id.substring(0, 6).toUpperCase()}`,
              tier: (ctc >= 1800000 ? 'TIER_1_SUPER_DREAM' : ctc >= 1000000 ? 'TIER_2_DREAM' : 'TIER_3_MASS') as any,
              tierLabel: ctc >= 1800000 ? 'Tier 1 Super Dream' : ctc >= 1000000 ? 'Tier 2 Dream' : 'Tier 3 Core',
              jobType: r.job_type || 'FULL_TIME',
              workMode: r.work_mode || 'Hybrid',
              location: r.location || 'Pune / Bengaluru',
              baseSalary: Number(r.base_salary) || Math.round(ctc * 0.75),
              totalCtc: ctc,
              ctcLabel: `₹${(ctc / 100000).toFixed(1)} LPA`,
              matchScore: mockMatch.matchScore || 92,
              eligibilityStatus: 'ELIGIBLE',
              eligibilityNote: 'Verified 9.15 CGPA meets criteria and 0 active backlogs.',
              applicationStatus: idx === 0 || idx === 1 ? 'APPLIED' : 'NOT_APPLIED',
              closesInDays: 3 + idx,
              skills: mockMatch.skills || ['Backend', 'SQL', 'Algorithms'],
              description: mockMatch.description,
              rounds: mockMatch.rounds,
            };
          });
        }
      }
    } catch {
      // fallback
    }
    return MOCK_JOB_OPPORTUNITIES;
  }

  // 1-Click Apply for Job
  public async applyForJob(opportunityId: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/placements/apply`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          opportunity_id: opportunityId,
          student_id: MOCK_STUDENT_PROFILE.id,
          resume_id: 'resume-ver-3',
        }),
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    return true;
  }

  // Accept a Job Offer
  public async acceptOffer(offerId: string, studentId: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/placements/offers/${offerId}/accept`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          studentId,
          signed_document_object_key: `tenants/${this.tenantId}/offers/${offerId}_signed.pdf`,
          signature_reference: `DOCUSIGN_${Date.now()}`,
        }),
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    return true;
  }

  // Fetch Applications Tracker
  public async getApplications(): Promise<StudentApplication[]> {
    try {
      const res = await fetch(`${this.baseUrl}/placements/applications?student_id=${MOCK_STUDENT_PROFILE.id}`, { headers: this.getHeaders() });
      if (res.ok) {
        const json = await res.json();
        const rows = json.applications || json.data || [];
        if (Array.isArray(rows)) return rows.map((a: any) => ({
          id: a.id,
          opportunityId: a.job_opportunity_id,
          companyName: a.job_opportunity?.company?.name || a.company_name || 'Company',
          roleTitle: a.job_opportunity?.title || a.role_title || 'Role',
          tierLabel: a.job_opportunity?.tier || 'Placement Drive',
          ctcLabel: a.job_opportunity?.total_ctc ? `₹${(Number(a.job_opportunity.total_ctc) / 100000).toFixed(1)} LPA` : '—',
          appliedDate: a.applied_at || a.created_at || new Date().toISOString(),
          currentStep: 1,
          totalSteps: 4,
          currentStageLabel: a.status || 'Applied',
          stageTone: 'good' as const,
          lockedResumeTitle: a.resume_version_id || 'Resume version',
          rounds: [],
          status: a.status,
          appliedAt: a.applied_at || a.created_at,
          resumeVersionName: a.resume_version_id,
        })) as StudentApplication[];
      }
    } catch { /* offline fallback */ }
    return MOCK_APPLICATIONS;
  }

  // Fetch Offers
  public async getOffers(): Promise<PlacementOffer[]> {
    try {
      const res = await fetch(`${this.baseUrl}/placements/offers?student_id=${MOCK_STUDENT_PROFILE.id}`, { headers: this.getHeaders() });
      if (res.ok) {
        const json = await res.json();
        const rows = json.offers || json.data || [];
        if (Array.isArray(rows)) return rows.map((o: any) => ({
          id: o.id,
          offerCode: o.id,
          companyName: o.company?.name || o.company_name || 'Company',
          roleTitle: o.job_opportunity?.title || o.role_title || 'Offer',
          tierLabel: o.job_opportunity?.tier || 'Placement Offer',
          totalCtc: Number(o.total_ctc || o.compensation || 0),
          baseSalary: Number(o.base_salary || 0),
          joiningBonus: Number(o.joining_bonus || 0),
          variablePay: Number(o.variable_pay || 0),
          deadline: o.decision_deadline || '',
          status: (o.status === 'ACCEPTED' || o.status === 'DECLINED' ? o.status : 'PENDING') as 'PENDING' | 'ACCEPTED' | 'DECLINED',
          signedDocumentKey: o.signed_document_object_key,
          jobTitle: o.job_opportunity?.title,
          location: o.job_opportunity?.location,
          ctcLabel: o.total_ctc ? `₹${(Number(o.total_ctc) / 100000).toFixed(1)} LPA` : '—',
          expiresAt: o.decision_deadline,
        })) as PlacementOffer[];
      }
    } catch { /* offline fallback */ }
    return MOCK_OFFERS;
  }

  // Fetch Verified Skills
  public async getVerifiedSkills(): Promise<VerifiedSkill[]> {
    try {
      const res = await fetch(`${this.baseUrl}/skills/student/${MOCK_STUDENT_PROFILE.id}`, { headers: this.getHeaders() });
      if (res.ok) {
        const json = await res.json();
        const rows = json.skills || json.data || [];
        if (Array.isArray(rows)) return rows.map((s: any) => ({
          id: s.id,
          name: s.skill?.name || s.skill_name || s.name || 'Skill',
          level: s.proficiency_level || s.level || 'Intermediate',
          verifiedTier: s.evidence?.[0]?.verification_type || s.verification_type || 'Self-declared',
          score: Number(s.score || 0),
          evidenceCount: s.evidence?.length || 0,
        })) as VerifiedSkill[];
      }
    } catch { /* offline fallback */ }
    return MOCK_VERIFIED_SKILLS;
  }

  // Fetch AI Quota
  public async getTacieQuota(): Promise<TacieQuota> {
    try {
      const res = await fetch(`${this.baseUrl}/tacie/quota/${MOCK_STUDENT_PROFILE.userId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        const q = json.quota || json.data;
        if (q) {
          return {
            monthlyLimit: q.credit_limit ?? q.monthly_limit ?? 50,
            usedCredits: q.used_credits ?? 0,
            remainingCredits: q.remaining_credits ?? Math.max(0, (q.credit_limit ?? 50) - (q.used_credits ?? 0)),
            resetsInDays: 6,
          };
        }
      }
    } catch {
      // fallback
    }
    return MOCK_QUOTA;
  }

  // Send message to TACIE AI Advisor
  public async sendTacieMessage(content: string): Promise<ChatMessage> {
    // Attempt live API if available
    try {
      const res = await fetch(`${this.baseUrl}/tacie/advisor`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          student_id: MOCK_STUDENT_PROFILE.id,
          user_id: MOCK_STUDENT_PROFILE.userId,
          message: content,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const reply = json.data?.content || json.reply;
        if (reply) {
          return {
            id: `ai-${Date.now()}`,
            sender: 'tacie',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
      }
    } catch {
      // intelligent fallback
    }

    // Dynamic Intelligent Placement Copilot responses based on prompt keywords:
    const q = content.toLowerCase();
    let reply = '';
    let action: any = undefined;

    if (q.includes('google') || q.includes('sde') || q.includes('interview')) {
      reply =
        "For Google SDE-1 interviews, focus on:\n\n• **Graph Algorithms**: BFS/DFS on 2D matrices, Topological Sort (e.g. Course Schedule), and Union-Find.\n• **Dynamic Programming**: Memoization & bottom-up state transitions.\n• **Communication**: Always state your initial brute force, analyze its O(N) complexity, then optimize.\n\nYour SITRC verified CGPA (9.15) already meets the technical cutoff!";
      action = { label: 'View Google Drive', tab: 'jobs' };
    } else if (q.includes('barclays') || q.includes('offer')) {
      reply =
        "Congratulations on receiving the Barclays Graduate Tech Analyst offer! 🎉\n\n• **Total CTC**: ₹14.50 LPA (Base: ₹11L + Joining Bonus: ₹1.5L + Variable: ₹2L)\n• **Next Step**: Accept the offer in the Applications tab before the placement cell SLA expires to lock in your offer letter.";
      action = { label: 'Review Offer Letter', tab: 'apps' };
    } else if (q.includes('resume') || q.includes('ats')) {
      reply =
        "Your uploaded resume **Aarav_Sharma_Backend_2026_v3.pdf** has an ATS score of **88/100**!\n\n✅ Strengths: Strong action verbs ('architected', 'benchmarked'), quantified latency reductions (-35%).\n💡 Suggestion: Add 1 bullet highlighting Docker/Kubernetes container orchestration to reach 95%+ match.";
      action = { label: 'View Profile & Skills', tab: 'profile' };
    } else if (q.includes('redis') || q.includes('system design') || q.includes('cache')) {
      reply =
        "Great topic! In system design rounds, be ready to discuss:\n\n1. **Cache Eviction**: LRU vs. LFU policies.\n2. **Cache Patterns**: Cache-Aside vs. Write-Through vs. Write-Back.\n3. **Stampede Prevention**: Mutex locks or probabilistic early expiration to avoid DB spikes.";
    } else {
      reply = `I'm analyzing that in your context as a Final Year CSE student at ${MOCK_STUDENT_PROFILE.collegeName}.\n\nWith your 9.15 CGPA and 0 active backlogs, you have priority access to Tier 1 Super Dream drives. Keep your coding practice active!`;
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'tacie',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedAction: action,
    };
  }

  public async enhanceResume(payload: {
    resumeId?: string;
    resumeVersionId?: string;
    resumeText?: string;
    targetRole?: string;
    jobDescription?: string;
  }): Promise<any> {
    const res = await fetch(`${this.baseUrl}/tacie/resume-enhance`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        student_id: MOCK_STUDENT_PROFILE.id,
        resume_id: payload.resumeId,
        resume_version_id: payload.resumeVersionId,
        resume_text: payload.resumeText,
        target_role: payload.targetRole,
        job_description: payload.jobDescription,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || json.error || 'Resume enhancement failed');
    return json.data || json.analysis;
  }
}

export const mobileApi = new MobileApiService();
