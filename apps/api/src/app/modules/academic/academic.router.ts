import { Router } from "express";
import {
  getAllAcademicRecords,
  getAcademicRecordById,
  createAcademicRecord,
  getAllAcademicMemberships,
  getAcademicMembershipById,
  createAcademicMembership,
  updateAcademicMembership,
  getAllAcademicEvents,
  getAcademicEventById,
  createAcademicEvent,
  updateAcademicEvent,
  deleteAcademicEvent,
  checkAcademicConflicts,
} from "./academic.controller";

export const academicRouter = Router();

// Academic Records
academicRouter.get("/records", getAllAcademicRecords);
academicRouter.post("/records", createAcademicRecord);
academicRouter.get("/records/:id", getAcademicRecordById);

// Academic Memberships
academicRouter.get("/memberships", getAllAcademicMemberships);
academicRouter.post("/memberships", createAcademicMembership);
academicRouter.get("/memberships/:id", getAcademicMembershipById);
academicRouter.put("/memberships/:id", updateAcademicMembership);

// Academic Events & Conflicts
academicRouter.post("/events/conflicts", checkAcademicConflicts);
academicRouter.get("/events", getAllAcademicEvents);
academicRouter.post("/events", createAcademicEvent);
academicRouter.get("/events/:id", getAcademicEventById);
academicRouter.put("/events/:id", updateAcademicEvent);
academicRouter.delete("/events/:id", deleteAcademicEvent);

