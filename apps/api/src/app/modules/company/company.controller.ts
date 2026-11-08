import { Request, Response } from "express";
import {
  CompanyService,
  CompanyContactService,
  RecruiterProfileService,
  CrmPipelineService,
  CrmActivityService,
  RecruitmentVisitService,
} from "./services";

const companyService = new CompanyService();
const contactService = new CompanyContactService();
const recruiterService = new RecruiterProfileService();
const pipelineService = new CrmPipelineService();
const activityService = new CrmActivityService();
const visitService = new RecruitmentVisitService();

export async function getAllCompanies(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const companies = await companyService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getCompanyById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const company = await companyService.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createCompany(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const company = await companyService.create(data);
    return res.status(201).json({
      success: true,
      company,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateCompany(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const updated = await companyService.updateById(id, req.body);
    return res.status(200).json({
      success: true,
      company: updated,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function addContact(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.company_id || !data.full_name) {
      return res.status(400).json({
        success: false,
        message: "company_id and full_name are required",
      });
    }

    const contact = await contactService.create(data);
    return res.status(201).json({
      success: true,
      contact,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getRecruitmentVisits(req: Request, res: Response) {
  try {
    const visits = await visitService.findAll();
    return res.status(200).json({
      success: true,
      visits,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}
