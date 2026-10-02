import { createResourceHandlers } from "../../../core/controller.utils";
import { ResourceSkills } from "../model/resource_skills.model";
import { ResourceSkillsService } from "../service/resource-skills.service";

const service = new ResourceSkillsService();
const handlers = createResourceHandlers<ResourceSkills>(service);

export const createResourceSkills = handlers.create;
export const getResourceSkillss = handlers.getAll;
export const getResourceSkillsById = handlers.getById;
export const updateResourceSkills = handlers.update;
export const deleteResourceSkills = handlers.delete;
