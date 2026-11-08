import { Request, Response } from "express";
import {
  PlacementSeasonService,
  JobOpportunityService,
  PlacementDriveService,
  JobApplicationService,
  JobOfferService,
  StudentPlacementComplianceService,
} from "./services";
import { JobApplication, JobOffer } from "./models/application.models";

const seasonService = new PlacementSeasonService();
const opportunityService = new JobOpportunityService();
const driveService = new PlacementDriveService();
const applicationService = new JobApplicationService();
const offerService = new JobOfferService();
const complianceService = new StudentPlacementComplianceService();

export async function getSeasons(req: Request, res: Response) {
  try {
    const seasons = await seasonService.findAll();
    return res.status(200).json({ success: true, seasons });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function createSeason(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.name || !data.academic_year) {
      return res.status(400).json({ success: false, message: "name and academic_year are required" });
    }
    const season = await seasonService.create(data);
    return res.status(201).json({ success: true, season });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getOpportunities(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const opportunities = await opportunityService.paginate({ page, limit });
    return res.status(200).json({ success: true, opportunities });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getOpportunityById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const opportunity = await opportunityService.findById(id);
    if (!opportunity) return res.status(404).json({ success: false, message: "Opportunity not found" });
    return res.status(200).json({ success: true, opportunity });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function createOpportunity(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.company_id || !data.title) {
      return res.status(400).json({ success: false, message: "company_id and title are required" });
    }
    const opportunity = await opportunityService.create(data);
    return res.status(201).json({ success: true, opportunity });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getDrives(req: Request, res: Response) {
  try {
    const drives = await driveService.findAll();
    return res.status(200).json({ success: true, drives });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getStudentApplications(req: Request, res: Response) {
  try {
    const studentId = String(req.query["student_id"] ?? "");
    if (!studentId) return res.status(400).json({ success: false, message: "student_id is required" });
    const applications = await JobApplication.findAll({ where: { student_id: studentId }, order: [["created_at", "DESC"]] });
    return res.status(200).json({ success: true, applications });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getStudentOffers(req: Request, res: Response) {
  try {
    const studentId = String(req.query["student_id"] ?? "");
    if (!studentId) return res.status(400).json({ success: false, message: "student_id is required" });
    const offers = await JobOffer.findAll({ where: { student_id: studentId }, order: [["created_at", "DESC"]] });
    return res.status(200).json({ success: true, offers });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function applyForJob(req: Request, res: Response) {
  try {
    const data = req.body;
    const oppId = data.opportunity_id || data.job_opportunity_id;
    const resId = data.resume_id || data.resume_version_id;
    if (!oppId || !data.student_id || !resId) {
      return res.status(400).json({ success: false, message: "opportunity_id, student_id, and resume_id are required" });
    }
    const application = await applicationService.apply({
      ...data,
      job_opportunity_id: oppId,
      resume_version_id: resId,
    });
    return res.status(201).json({ success: true, application });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function updateApplicationStatus(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const { status, remarks, changed_by } = req.body;
    if (!status || !changed_by) {
      return res.status(400).json({ success: false, message: "status and changed_by are required" });
    }
    const updated = await applicationService.updateStatus(id, status, remarks, changed_by);
    return res.status(200).json({ success: true, application: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function acceptOffer(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const { studentId, signed_document_object_key, signature_reference } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: "studentId is required" });
    }
    const offer = await offerService.acceptOffer(id, studentId, {
      signed_document_object_key,
      signature_reference,
    });
    return res.status(200).json({ success: true, offer });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

export async function getStudentCompliance(req: Request, res: Response) {
  try {
    const studentId = req.params['studentId'] as string;
    const compliance = await complianceService.getOrCreate(studentId);
    return res.status(200).json({ success: true, compliance });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, message: "Internal Server Error" });
  }
}

