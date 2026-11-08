import { Router } from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  verifyProject,
} from "./project.controller";

export const projectRouter = Router();

projectRouter.get("/", getAllProjects);
projectRouter.post("/", createProject);
projectRouter.get("/:id", getProjectById);
projectRouter.put("/:id", updateProject);
projectRouter.post("/:id/verify", verifyProject);

