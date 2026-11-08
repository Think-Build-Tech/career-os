import { Request, Response } from "express";
import { CohortService } from "./services";

const cohortService = new CohortService();

export async function getAllCohorts(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const cohorts = await cohortService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      cohorts,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getCohortById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide cohort ID",
      });
    }

    const cohort = await cohortService.findById(id);
    if (!cohort) {
      return res.status(404).json({
        success: false,
        message: "Cohort not found",
      });
    }

    return res.status(200).json({
      success: true,
      cohort,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createCohort(req: Request, res: Response) {
  try {
    const data = req.body;
    if (
      !data.program_id ||
      data.admission_year === undefined ||
      data.graduation_year === undefined ||
      !data.batch_name
    ) {
      return res.status(400).json({
        success: false,
        message: "program_id, admission_year, graduation_year, and batch_name are required",
      });
    }

    const cohort = await cohortService.create(data);
    return res.status(201).json({
      success: true,
      cohort,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateCohort(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide cohort ID",
      });
    }

    const cohort = await cohortService.updateById(id, data);
    return res.status(200).json({
      success: true,
      cohort,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function deleteCohort(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide cohort ID",
      });
    }

    await cohortService.deleteById(id);
    return res.status(200).json({
      success: true,
      message: "Cohort deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

