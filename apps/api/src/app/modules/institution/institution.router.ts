import { Router } from "express";
import {
  getAllInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "./institution.controller";

export const institutionRouter = Router();

institutionRouter.get("/", getAllInstitutions);
institutionRouter.post("/", createInstitution);
institutionRouter.get("/:id", getInstitutionById);
institutionRouter.put("/:id", updateInstitution);
institutionRouter.delete("/:id", deleteInstitution);

