import { createResourceHandlers } from "../../../core/controller.utils";
import { CodingProblems } from "../model/coding_problems.model";
import { CodingProblemsService } from "../service/coding-problems.service";

const service = new CodingProblemsService();
const handlers = createResourceHandlers<CodingProblems>(service);

export const createCodingProblems = handlers.create;
export const getCodingProblemss = handlers.getAll;
export const getCodingProblemsById = handlers.getById;
export const updateCodingProblems = handlers.update;
export const deleteCodingProblems = handlers.delete;
