import { Router } from "express";
import {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} from "./program.controller";

export const programRouter = Router();

programRouter.get("/", getAllPrograms);
programRouter.post("/", createProgram);
programRouter.get("/:id", getProgramById);
programRouter.put("/:id", updateProgram);
programRouter.delete("/:id", deleteProgram);

