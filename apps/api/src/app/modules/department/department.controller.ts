import { Request, Response } from "express";
import { DepartmentService, DepartmentSettingsService } from "./services";

const departmentService = new DepartmentService();
const settingsService = new DepartmentSettingsService();

export async function getAllDepartments(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const departments = await departmentService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      departments,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getDepartmentById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const department = await departmentService.findById(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      department,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createDepartment(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.name || !data.code || !data.institution_id) {
      return res.status(400).json({
        success: false,
        message: "name, code, and institution_id are required",
      });
    }

    const department = await departmentService.createDepartment(data);
    return res.status(201).json({
      success: true,
      department,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateDepartment(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const updated = await departmentService.updateById(id, req.body);
    return res.status(200).json({
      success: true,
      department: updated,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function deleteDepartment(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    await departmentService.deleteById(id);
    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getDepartmentSettings(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const settings = await settingsService.findById(id);
    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateDepartmentSettings(req: Request, res: Response) {
  try {
    const { departmentId, ...data } = req.body;
    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "departmentId is required",
      });
    }

    const settings = await settingsService.updateById(departmentId, data);
    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}
