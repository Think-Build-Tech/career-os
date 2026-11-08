import { Request, Response } from "express";
import { AuditLogService, DataAccessAuditService } from "./services";

const auditLogService = new AuditLogService();
const dataAccessService = new DataAccessAuditService();

export async function getLogForStudent(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.student_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide student ID",
      });
    }

    const logs = await dataAccessService.getAccessLogForStudent(
      data.student_id,
      data.resource_type
    );
    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getAllAuditLogs(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const logs = await auditLogService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createAuditLog(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.action || !data.actor_user_id) {
      return res.status(400).json({
        success: false,
        message: "action and actor_user_id are required",
      });
    }
    const log = await auditLogService.create(data);
    return res.status(201).json({
      success: true,
      log,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function logDataAccess(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.actor_user_id || !data.resource_owner_id || !data.resource_type || !data.resource_id) {
      return res.status(400).json({
        success: false,
        message: "actor_user_id, resource_owner_id, resource_type, and resource_id are required",
      });
    }
    const log = await dataAccessService.logAccess(data);
    return res.status(201).json({
      success: true,
      log,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

