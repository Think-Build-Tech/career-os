import { Request, Response } from "express";
import { SkillService, StudentSkillService, SkillEvidenceService } from "./services";

const skillService = new SkillService();
const studentSkillService = new StudentSkillService();
const evidenceService = new SkillEvidenceService();

export async function getAllSkills(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 50;
    const skills = await skillService.paginate({ page, limit });
    return res.status(200).json({ success: true, skills });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getSkillById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const skill = await skillService.findById(id);
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
    return res.status(200).json({ success: true, skill });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function createSkill(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.name) {
      return res.status(400).json({ success: false, message: "Skill name is required" });
    }
    const skill = await skillService.create(data);
    return res.status(201).json({ success: true, skill });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getStudentSkills(req: Request, res: Response) {
  try {
    const studentId = req.params['studentId'] as string;
    const skills = await studentSkillService.findAll({
      where: { student_id: studentId } as any,
    });
    return res.status(200).json({ success: true, skills });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function addStudentSkill(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.student_id || !data.skill_id) {
      return res.status(400).json({ success: false, message: "student_id and skill_id are required" });
    }
    const studentSkill = await studentSkillService.create(data);
    return res.status(201).json({ success: true, studentSkill });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function addSkillEvidence(req: Request, res: Response) {
  try {
    const evidence = await evidenceService.create(req.body);
    return res.status(201).json({ success: true, evidence });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}
