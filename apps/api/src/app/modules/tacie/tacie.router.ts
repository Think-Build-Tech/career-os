import { Router } from "express";
import {
  getAiRuns,
  createAiRun,
  analyzeResume,
  searchCandidates,
  runCandidateMatch,
  analyzeSkillGap,
  enhanceResume,
  advisor,
  getAiHealth,
  getUserQuota,
  grantCredits,
} from "./tacie.controller";

export const tacieRouter = Router();

tacieRouter.get("/health", getAiHealth);
tacieRouter.get("/runs", getAiRuns);
tacieRouter.post("/runs", createAiRun);
tacieRouter.post("/resume-analysis", analyzeResume);
tacieRouter.post("/candidate-search", searchCandidates);
tacieRouter.post("/candidate-match", runCandidateMatch);
tacieRouter.post("/skill-gap", analyzeSkillGap);
tacieRouter.post("/resume-enhance", enhanceResume);
tacieRouter.post("/advisor", advisor);
tacieRouter.get("/quota/:userId", getUserQuota);
tacieRouter.post("/credits/grant", grantCredits);

