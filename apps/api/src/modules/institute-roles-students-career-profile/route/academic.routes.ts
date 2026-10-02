import { Router } from "express";
import {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
} from "../controller/academic/department.controller";
import {
    createProgram,
    getPrograms,
    getProgramById,
    updateProgram,
    deleteProgram,
} from "../controller/academic/program.controller";
import {
    createBatch,
    getBatches,
    getBatchById,
    updateBatch,
    deleteBatch,
} from "../controller/academic/batch.controller";

const router: Router = Router();

// Departments
router.route("/departments").get(getDepartments).post(createDepartment);
router.route("/departments/:id").get(getDepartmentById).patch(updateDepartment).delete(deleteDepartment);

// Programs
router.route("/programs").get(getPrograms).post(createProgram);
router.route("/programs/:id").get(getProgramById).patch(updateProgram).delete(deleteProgram);

// Batches
router.route("/batches").get(getBatches).post(createBatch);
router.route("/batches/:id").get(getBatchById).patch(updateBatch).delete(deleteBatch);

export default router;
