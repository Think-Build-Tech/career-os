import { Router } from "express";
import {
  getAssessments,
  getAssessmentById,
  createAssessment,
  assignAssessment,
  submitAttempt,
  bookSlot,
  getBadges,
  recordPreflight,
} from "./assessment.controller";

export const assessmentRouter = Router();

assessmentRouter.get("/", getAssessments);
assessmentRouter.post("/", createAssessment);
assessmentRouter.get("/badges", getBadges);
assessmentRouter.post("/slots/book", bookSlot);
assessmentRouter.post("/preflight", recordPreflight);
assessmentRouter.post("/assignments", assignAssessment);
assessmentRouter.post("/attempts", submitAttempt);
assessmentRouter.get("/:id", getAssessmentById);

