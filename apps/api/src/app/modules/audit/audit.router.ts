import { Router } from "express";
import {
  getLogForStudent,
  getAllAuditLogs,
  createAuditLog,
  logDataAccess,
} from "./audit.controller";

export const auditRouter = Router();

auditRouter.get("/", getAllAuditLogs);
auditRouter.post("/", createAuditLog);
auditRouter.post("/student-logs", getLogForStudent);
auditRouter.post("/log-access", logDataAccess);

