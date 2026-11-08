import { Router } from "express";
import {
  getSeasons,
  createSeason,
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  getDrives,
  getStudentApplications,
  getStudentOffers,
  applyForJob,
  updateApplicationStatus,
  acceptOffer,
  getStudentCompliance,
} from "./placement.controller";

export const placementRouter = Router();

placementRouter.get("/seasons", getSeasons);
placementRouter.post("/seasons", createSeason);
placementRouter.get("/opportunities", getOpportunities);
placementRouter.post("/opportunities", createOpportunity);
placementRouter.get("/opportunities/:id", getOpportunityById);
placementRouter.get("/drives", getDrives);
placementRouter.get("/applications", getStudentApplications);
placementRouter.get("/offers", getStudentOffers);
placementRouter.post("/apply", applyForJob);
placementRouter.patch("/applications/:id/status", updateApplicationStatus);
placementRouter.post("/offers/:id/accept", acceptOffer);
placementRouter.get("/compliance/:studentId", getStudentCompliance);

