import { Router } from "express";
import {
  getAlumniProfiles,
  getAlumniById,
  createAlumniProfile,
  getReferralPosts,
  createReferralPost,
  requestReferral,
  bookMentorshipSlot,
  requestConnection,
} from "./alumni.controller";

export const alumniRouter = Router();

alumniRouter.get("/profiles", getAlumniProfiles);
alumniRouter.post("/profiles", createAlumniProfile);
alumniRouter.get("/profiles/:id", getAlumniById);
alumniRouter.get("/referrals", getReferralPosts);
alumniRouter.post("/referrals", createReferralPost);
alumniRouter.post("/referrals/request", requestReferral);
alumniRouter.post("/mentorship/book", bookMentorshipSlot);
alumniRouter.post("/connections", requestConnection);

