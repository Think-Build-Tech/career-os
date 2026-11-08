import { Request, Response } from "express";
import { ProgramService } from "./services";

const programService = new ProgramService();

export async function getAllPrograms(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const programs = await programService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      programs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getProgramById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide program ID",
      });
    }

    const program = await programService.findById(id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    return res.status(200).json({
      success: true,
      program,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createProgram(req: Request, res: Response) {
  try {
    const data = req.body;
    if (
      !data.department_id ||
      !data.name ||
      !data.code ||
      !data.degree_type ||
      data.duration_years === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "department_id, name, code, degree_type, and duration_years are required",
      });
    }

    const program = await programService.create(data);
    return res.status(201).json({
      success: true,
      program,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateProgram(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide program ID",
      });
    }

    const program = await programService.updateById(id, data);
    return res.status(200).json({
      success: true,
      program,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function deleteProgram(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide program ID",
      });
    }

    await programService.deleteById(id);
    return res.status(200).json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

