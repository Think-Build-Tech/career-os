import { Request, Response } from "express";
import { StudentProjectService, ProjectSkillService } from "./services";

const projectService = new StudentProjectService();
const projectSkillService = new ProjectSkillService();

export async function getAllProjects(req: Request, res: Response) {
  try {
    const studentId = req.query['student_id'] as string;
    if (studentId) {
      const projects = await projectService.getStudentProjects(studentId);
      return res.status(200).json({ success: true, projects });
    }
    const projects = await projectService.findAll();
    return res.status(200).json({ success: true, projects });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getProjectById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const project = await projectService.findById(id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    return res.status(200).json({ success: true, project });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const { skill_ids, ...projectData } = req.body;
    if (!projectData.student_id || !projectData.title || !projectData.description) {
      return res.status(400).json({
        success: false,
        message: "student_id, title, and description are required",
      });
    }

    const project = await projectService.createProjectWithSkills(projectData, skill_ids || []);
    return res.status(201).json({ success: true, project });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const updated = await projectService.updateById(id, req.body);
    return res.status(200).json({ success: true, project: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function verifyProject(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const { verified_by, notes } = req.body;
    if (!verified_by) {
      return res.status(400).json({ success: false, message: "verified_by is required" });
    }
    const verified = await projectService.verifyProject(id, verified_by, notes);
    return res.status(200).json({ success: true, project: verified });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}
