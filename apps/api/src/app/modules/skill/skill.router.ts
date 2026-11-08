import { Router } from "express";
import {
  getAllSkills,
  getSkillById,
  createSkill,
  getStudentSkills,
  addStudentSkill,
  addSkillEvidence,
} from "./skill.controller";

export const skillRouter = Router();

skillRouter.get("/", getAllSkills);
skillRouter.post("/", createSkill);
skillRouter.get("/student/:studentId", getStudentSkills);
skillRouter.post("/student", addStudentSkill);
skillRouter.post("/evidence", addSkillEvidence);
skillRouter.get("/:id", getSkillById);

