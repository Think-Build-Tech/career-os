import { Router } from "express";
import {
  getAllCohorts,
  getCohortById,
  createCohort,
  updateCohort,
  deleteCohort,
} from "./cohort.controller";

export const cohortRouter = Router();

cohortRouter.get("/", getAllCohorts);
cohortRouter.post("/", createCohort);
cohortRouter.get("/:id", getCohortById);
cohortRouter.put("/:id", updateCohort);
cohortRouter.delete("/:id", deleteCohort);

