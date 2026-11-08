import { Router } from "express";
import {
  getAllReputationEvents,
  createReputationEvent,
  getAllReputationSummaries,
  getReputationSummaryByStudent,
  updateReputationSummary,
} from "./reputation.controller";

export const reputationRouter = Router();

// Events
reputationRouter.get("/events", getAllReputationEvents);
reputationRouter.post("/events", createReputationEvent);

// Summary
reputationRouter.get("/summaries", getAllReputationSummaries);
reputationRouter.get("/summaries/student/:studentId", getReputationSummaryByStudent);
reputationRouter.put("/summaries/:id", updateReputationSummary);

