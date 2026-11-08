import { createHash } from "crypto";
import { Request, Response } from "express";
import { ResumeVersion } from "../resume/models/resume-version.model";
import { Resume } from "../resume/models/resume.model";
import {
  AiGatewayError,
  AiGatewayService,
  AiRunService,
  ResumeAnalysisService,
  CandidateSearchService,
  CandidateMatchRunService,
  SkillGapAnalysisService,
  AiUsageQuotaService,
  parseAiJson,
} from "./services";

const aiGateway = new AiGatewayService();
const aiRunService = new AiRunService();
const resumeAnalysisService = new ResumeAnalysisService();
const candidateSearchService = new CandidateSearchService();
const candidateMatchRunService = new CandidateMatchRunService();
const skillGapService = new SkillGapAnalysisService();
const quotaService = new AiUsageQuotaService();

const snapshotHash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

function sendError(res: Response, error: any) {
  const status = error instanceof AiGatewayError ? error.statusCode : 500;
  return res.status(status).json({
    success: false,
    code: error instanceof AiGatewayError ? error.code : undefined,
    error: error?.message || error,
    message: status === 500 ? "Internal Server Error" : error?.message,
  });
}

async function createCompletedRun(runType: string, input: unknown, result?: { usage?: { inputTokens: number; outputTokens: number } }) {
  return aiRunService.create({
    run_type: runType,
    model_name: process.env["AI_SERVICE_MODEL"] || "configured-ai-model",
    model_version: "gateway",
    input_snapshot_hash: snapshotHash(input),
    status: "COMPLETED",
    prompt_tokens: result?.usage?.inputTokens ?? null,
    completion_tokens: result?.usage?.outputTokens ?? null,
    completed_at: new Date(),
  });
}

export async function getAiRuns(req: Request, res: Response) {
  try {
    const page = Number(req.query["page"]) || 1;
    const limit = Number(req.query["limit"]) || 20;
    const runs = await aiRunService.paginate({ page, limit });
    return res.status(200).json({ success: true, runs });
  } catch (err: any) { return sendError(res, err); }
}

export async function createAiRun(req: Request, res: Response) {
  try {
    const data = req.body ?? {};
    if ((!data.feature_name && !data.run_type) || !data.user_id) {
      return res.status(400).json({ success: false, message: "feature_name/run_type and user_id are required" });
    }
    const run = await aiRunService.create({
      run_type: data.run_type ?? data.feature_name,
      model_name: data.model_name ?? process.env["AI_SERVICE_MODEL"] ?? "configured-ai-model",
      model_version: data.model_version ?? "gateway",
      input_snapshot_hash: data.input_snapshot_hash ?? snapshotHash(data),
      status: data.status ?? "QUEUED",
      prompt_tokens: data.prompt_tokens ?? null,
      completion_tokens: data.completion_tokens ?? null,
      estimated_cost: data.estimated_cost ?? null,
      started_at: data.started_at ?? new Date(),
    });
    return res.status(201).json({ success: true, run });
  } catch (err: any) { return sendError(res, err); }
}

export async function analyzeResume(req: Request, res: Response) {
  try {
    const data = req.body ?? {};
    if (!data.resume_id || !data.ai_run_id) {
      return res.status(400).json({ success: false, message: "resume_id and ai_run_id are required" });
    }
    const resume = await Resume.findByPk(data.resume_id);
    const latestVersion = data.resume_version_id
      ? undefined
      : await ResumeVersion.findOne({ where: { resume_id: data.resume_id }, order: [["version_number", "DESC"]] });
    const resumeVersionId = data.resume_version_id ?? latestVersion?.id;
    const studentId = data.student_id ?? resume?.student_id;
    if (!studentId || !resumeVersionId) {
      return res.status(400).json({ success: false, message: "A valid resume document with a version and student is required" });
    }
    const metrics = data.metrics ?? {};
    const analysis = await resumeAnalysisService.create({
      student_id: studentId,
      resume_version_id: resumeVersionId,
      ai_run_id: data.ai_run_id,
      match_score: data.overall_score ?? metrics.match_score ?? null,
      keyword_score: metrics.keyword_score ?? metrics.ats_readability ?? null,
      experience_score: metrics.experience_score ?? metrics.impact ?? null,
      skills_score: metrics.skills_score ?? metrics.action_verbs ?? null,
      analysis_data: data,
      recommendations: data.recommendations ?? [],
      missing_keywords: data.missing_keywords ?? [],
    });
    return res.status(201).json({ success: true, analysis });
  } catch (err: any) { return sendError(res, err); }
}

export async function searchCandidates(req: Request, res: Response) {
  try {
    const data = req.body ?? {};
    if (!data.recruiter_id || !data.query_text) return res.status(400).json({ success: false, message: "recruiter_id and query_text are required" });
    const search = await candidateSearchService.create({ ...data, requested_by: data.recruiter_id, natural_language_query: data.query_text });
    return res.status(201).json({ success: true, search });
  } catch (err: any) { return sendError(res, err); }
}

export async function runCandidateMatch(req: Request, res: Response) {
  try {
    const data = req.body ?? {};
    if (!data.job_opportunity_id) return res.status(400).json({ success: false, message: "job_opportunity_id is required" });
    const matchRun = await candidateMatchRunService.create(data);
    return res.status(201).json({ success: true, matchRun });
  } catch (err: any) { return sendError(res, err); }
}

export async function analyzeSkillGap(req: Request, res: Response) {
  try {
    const data = req.body ?? {};
    if (!data.student_id || !data.target_role) return res.status(400).json({ success: false, message: "student_id and target_role are required" });
    const generation = await aiGateway.generate({
      signatureType: "skill_gap_analysis",
      messages: [
        { role: "system", content: "You are TACIE, a student career coach. Return only JSON with overall_readiness_score (0-100), cohort_percentile_label, benchmark_summary, breakdown (array of label, score_percentage, tone), and highest_roi_action." },
        { role: "user", content: JSON.stringify({ target_role: data.target_role, student_context: data.student_context ?? {} }) },
      ],
      metadata: { student_id: data.student_id, feature: "SKILL_GAP" },
    });
    const result = parseAiJson<Record<string, unknown>>(generation.content);
    const run = data.ai_run_id ? { id: data.ai_run_id } : await createCompletedRun("SKILL_GAP", data, generation);
    let skillGap: unknown = { ...result, student_id: data.student_id, target_role: data.target_role, ai_run_id: run.id };
    if (run.id && data.resume_version_id) {
      skillGap = await skillGapService.create({ student_id: data.student_id, target_role: data.target_role, resume_version_id: data.resume_version_id, ai_run_id: run.id, summary: result });
    }
    return res.status(201).json({ success: true, data: result, skillGap, ai_run_id: run.id });
  } catch (err: any) { return sendError(res, err); }
}

export async function enhanceResume(req: Request, res: Response) {
  try {
    const data = req.body ?? {};
    let resumeText = data.resume_text as string | undefined;
    let resumeVersionId = data.resume_version_id as string | undefined;
    if (resumeVersionId) {
      const version = await ResumeVersion.findByPk(resumeVersionId);
      resumeText = resumeText ?? version?.parsed_text ?? undefined;
    } else if (data.resume_id) {
      const version = await ResumeVersion.findOne({ where: { resume_id: data.resume_id }, order: [["version_number", "DESC"]] });
      resumeVersionId = version?.id;
      resumeText = resumeText ?? version?.parsed_text ?? undefined;
    }
    if (!resumeText?.trim()) return res.status(400).json({ success: false, message: "resume_text or a resume with parsed text is required" });
    const generation = await aiGateway.generate({
      signatureType: "resume_enhancement",
      messages: [
        { role: "system", content: "You are TACIE, an expert resume editor for college students. Return only JSON with score, summary, strengths (array), improvements (array), rewritten_bullets (array), and keywords (array). Do not invent facts; preserve the student's evidence." },
        { role: "user", content: JSON.stringify({ resume_text: resumeText, target_role: data.target_role ?? null, job_description: data.job_description ?? null, mode: data.mode ?? "enhance" }) },
      ],
      metadata: { student_id: data.student_id, resume_id: data.resume_id, feature: "RESUME_ENHANCEMENT" },
    });
    const result = parseAiJson<Record<string, unknown>>(generation.content);
    let run: any;
    try { run = await createCompletedRun("RESUME_ENHANCEMENT", data, generation); } catch { run = undefined; }
    if (run && data.student_id && resumeVersionId) {
      try {
        await resumeAnalysisService.create({
          student_id: data.student_id,
          resume_version_id: resumeVersionId,
          ai_run_id: run.id,
          recommendations: Array.isArray(result.improvements) ? result.improvements : [],
          missing_keywords: Array.isArray(result.keywords) ? result.keywords.filter((item): item is string => typeof item === "string") : [],
          analysis_data: result,
        });
      } catch { /* AI response remains useful even when persistence is unavailable. */ }
    }
    return res.status(200).json({ success: true, data: result, analysis: result, ai_run_id: run?.id, request_id: generation.requestId, usage: generation.usage });
  } catch (err: any) { return sendError(res, err); }
}

export async function advisor(req: Request, res: Response) {
  try {
    const data = req.body ?? {};
    if (!data.message?.trim()) return res.status(400).json({ success: false, message: "message is required" });
    const history = Array.isArray(data.history) ? data.history.slice(-12) : [];
    const generation = await aiGateway.generate({
      signatureType: "student_career_advisor",
      messages: [
        { role: "system", content: "You are TACIE, a practical and encouraging career advisor for students. Give concise, actionable guidance. Never claim to have completed an action you cannot perform and never invent a job, score, or credential." },
        ...history.filter((item: any) => item?.role && item?.content).map((item: any) => ({ role: item.role, content: String(item.content) })),
        { role: "user", content: data.message },
      ],
      metadata: { student_id: data.student_id, user_id: data.user_id, feature: "ADVISOR" },
    });
    return res.status(200).json({ success: true, data: { content: generation.content, request_id: generation.requestId, model: generation.model, usage: generation.usage, latency_ms: generation.latencyMs }, reply: generation.content });
  } catch (err: any) { return sendError(res, err); }
}

export async function getAiHealth(_req: Request, res: Response) {
  return res.status(200).json({ success: true, ai: await aiGateway.health() });
}

export async function getUserQuota(req: Request, res: Response) {
  try {
    const userId = req.params["userId"] as string;
    const defaultLimit = Number(req.query["defaultLimit"]) || 100;
    const quota = await quotaService.getOrCreateUserQuota(userId, defaultLimit);
    return res.status(200).json({ success: true, quota });
  } catch (err: any) { return sendError(res, err); }
}

export async function grantCredits(req: Request, res: Response) {
  try {
    const { quotaId, credits } = req.body ?? {};
    if (!quotaId || credits === undefined) return res.status(400).json({ success: false, message: "quotaId and credits are required" });
    const quota = await quotaService.grantCredits(quotaId, credits);
    return res.status(200).json({ success: true, quota });
  } catch (err: any) { return sendError(res, err); }
}
