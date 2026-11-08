import { Router } from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  getCareerProfile,
  updatePrivacyPreferences,
  submitStudentRequest,
  getPendingRequests,
  createActionItem,
  getActionItems,
  completeActionItem,
} from "./student.controller";

export const studentRouter = Router();

studentRouter.get("/", getAllStudents);
studentRouter.post("/", createStudent);
studentRouter.get("/requests/pending", getPendingRequests);
studentRouter.post("/requests", submitStudentRequest);
studentRouter.post("/action-items", createActionItem);
studentRouter.get("/action-items", getActionItems);
studentRouter.patch("/action-items/:id/complete", completeActionItem);
studentRouter.get("/:id", getStudentById);
studentRouter.put("/:id", updateStudent);
studentRouter.get("/:id/career-profile", getCareerProfile);
studentRouter.put("/:id/preferences", updatePrivacyPreferences);

