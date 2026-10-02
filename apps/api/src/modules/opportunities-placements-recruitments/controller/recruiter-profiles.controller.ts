import { createResourceHandlers } from "../../../core/controller.utils";
import { RecruiterProfiles } from "../model/recruiter_profiles.model";
import { RecruiterProfilesService } from "../service/recruiter-profiles.service";

const service = new RecruiterProfilesService();
const handlers = createResourceHandlers<RecruiterProfiles>(service);

export const createRecruiterProfiles = handlers.create;
export const getRecruiterProfiless = handlers.getAll;
export const getRecruiterProfilesById = handlers.getById;
export const updateRecruiterProfiles = handlers.update;
export const deleteRecruiterProfiles = handlers.delete;
