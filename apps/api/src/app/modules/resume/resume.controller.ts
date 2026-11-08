import { Request, Response } from "express";
import { ResumeService, ResumeVersionService } from "./services";

const resumeService = new ResumeService();
const versionService = new ResumeVersionService();

export async function getAllResumes(req: Request, res: Response) {
  try {
    const studentId = req.query['student_id'] as string;
    const where = studentId ? { student_id: studentId } : {};
    const resumes = await resumeService.findAll({ where: where as any });
    return res.status(200).json({ success: true, resumes });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getResumeById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const resume = await resumeService.findById(id);
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });
    return res.status(200).json({ success: true, resume });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function createResume(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.student_id || !data.title) {
      return res.status(400).json({ success: false, message: "student_id and title are required" });
    }
    const resume = await resumeService.create(data);
    return res.status(201).json({ success: true, resume });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function updateResume(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const updated = await resumeService.updateById(id, req.body);
    return res.status(200).json({ success: true, resume: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getResumeVersions(req: Request, res: Response) {
  try {
    const resumeId = req.params['id'] as string;
    const versions = await versionService.findAll({
      where: { resume_id: resumeId } as any,
      order: [["version_number", "DESC"]],
    });
    return res.status(200).json({ success: true, versions });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function createResumeVersion(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.resume_id || !data.content) {
      return res.status(400).json({ success: false, message: "resume_id and content are required" });
    }
    const version = await versionService.create(data);
    return res.status(201).json({ success: true, version });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}
