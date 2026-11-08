import { Router } from "express";
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentSettings,
} from "./department.controller";

export const departmentRouter = Router();

departmentRouter.get("/", getAllDepartments);
departmentRouter.post("/", createDepartment);
departmentRouter.get("/:id", getDepartmentById);
departmentRouter.put("/:id", updateDepartment);
departmentRouter.delete("/:id", deleteDepartment);
departmentRouter.get("/:id/settings", getDepartmentSettings);

