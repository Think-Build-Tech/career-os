import { Request, Response } from "express";
import {
  AssessmentService,
  AssessmentAssignmentService,
  AssessmentAttemptService,
  BadgeDefinitionService,
  AssessmentSlotService,
  ProctorPreflightService,
} from "./services";

const assessmentService = new AssessmentService();
const assignmentService = new AssessmentAssignmentService();
const attemptService = new AssessmentAttemptService();
const badgeService = new BadgeDefinitionService();
const slotService = new AssessmentSlotService();
const preflightService = new ProctorPreflightService();

export async function getAssessments(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const assessments = await assessmentService.paginate({ page, limit });
    return res.status(200).json({ success: true, assessments });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getAssessmentById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const assessment = await assessmentService.findById(id);
    if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found" });
    return res.status(200).json({ success: true, assessment });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function createAssessment(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.title || !data.institution_id) {
      return res.status(400).json({ success: false, message: "title and institution_id are required" });
    }
    const assessment = await assessmentService.create(data);
    return res.status(201).json({ success: true, assessment });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function assignAssessment(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.assessment_id || !data.student_id) {
      return res.status(400).json({ success: false, message: "assessment_id and student_id are required" });
    }
    const assignment = await assignmentService.create(data);
    return res.status(201).json({ success: true, assignment });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function submitAttempt(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.assessment_id || !data.student_id) {
      return res.status(400).json({ success: false, message: "assessment_id and student_id are required" });
    }
    const attempt = await attemptService.create(data);
    return res.status(201).json({ success: true, attempt });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function bookSlot(req: Request, res: Response) {
  try {
    const { slotId, studentId } = req.body;
    if (!slotId || !studentId) {
      return res.status(400).json({ success: false, message: "slotId and studentId are required" });
    }
    const booking = await slotService.bookSlot(slotId, studentId);
    return res.status(201).json({ success: true, booking });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getBadges(req: Request, res: Response) {
  try {
    const badges = await badgeService.findAll();
    return res.status(200).json({ success: true, badges });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function recordPreflight(req: Request, res: Response) {
  try {
    const preflight = await preflightService.recordPreflight(req.body);
    return res.status(201).json({ success: true, preflight });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}
