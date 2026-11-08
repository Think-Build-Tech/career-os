import { Router } from "express";
import {
  getAllResumes,
  getResumeById,
  createResume,
  updateResume,
  getResumeVersions,
  createResumeVersion,
} from "./resume.controller";

export const resumeRouter = Router();

resumeRouter.get("/", getAllResumes);
resumeRouter.post("/", createResume);
resumeRouter.get("/:id", getResumeById);
resumeRouter.put("/:id", updateResume);
resumeRouter.get("/:id/versions", getResumeVersions);
resumeRouter.post("/:id/versions", createResumeVersion);

