import { createResourceHandlers } from "../../../core/controller.utils";
import { CodingSubmissions } from "../model/coding_submissions.model";
import { CodingSubmissionsService } from "../service/coding-submissions.service";

const service = new CodingSubmissionsService();
const handlers = createResourceHandlers<CodingSubmissions>(service);

export const createCodingSubmissions = handlers.create;
export const getCodingSubmissionss = handlers.getAll;
export const getCodingSubmissionsById = handlers.getById;
export const updateCodingSubmissions = handlers.update;
export const deleteCodingSubmissions = handlers.delete;
