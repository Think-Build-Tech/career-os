import { createResourceHandlers } from "../../../core/controller.utils";
import { Resumes } from "../model/resumes.model";
import { ResumesService } from "../service/resumes.service";

const service = new ResumesService();
const handlers = createResourceHandlers<Resumes>(service);

export const createResumes = handlers.create;
export const getResumess = handlers.getAll;
export const getResumesById = handlers.getById;
export const updateResumes = handlers.update;
export const deleteResumes = handlers.delete;
