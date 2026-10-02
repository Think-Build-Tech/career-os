import { createResourceHandlers } from "../../../core/controller.utils";
import { InstituteCompanies } from "../model/institute_companies.model";
import { InstituteCompaniesService } from "../service/institute-companies.service";

const service = new InstituteCompaniesService();
const handlers = createResourceHandlers<InstituteCompanies>(service);

export const createInstituteCompanies = handlers.create;
export const getInstituteCompaniess = handlers.getAll;
export const getInstituteCompaniesById = handlers.getById;
export const updateInstituteCompanies = handlers.update;
export const deleteInstituteCompanies = handlers.delete;
