import { Router } from "express";
import {
  getAllModerations,
  createModeration,
  getAllReports,
  createReport,
  updateReportStatus,
  getAllCases,
  getCaseById,
  createCase,
  updateCaseStatus,
  getAllActions,
  createAction,
} from "./moderation.controller";

export const moderationRouter = Router();

// Moderations
moderationRouter.get("/moderations", getAllModerations);
moderationRouter.post("/moderations", createModeration);

// Reports
moderationRouter.get("/reports", getAllReports);
moderationRouter.post("/reports", createReport);
moderationRouter.patch("/reports/:id/status", updateReportStatus);

// Cases
moderationRouter.get("/cases", getAllCases);
moderationRouter.post("/cases", createCase);
moderationRouter.get("/cases/:id", getCaseById);
moderationRouter.patch("/cases/:id/status", updateCaseStatus);

// Actions
moderationRouter.get("/actions", getAllActions);
moderationRouter.post("/actions", createAction);

