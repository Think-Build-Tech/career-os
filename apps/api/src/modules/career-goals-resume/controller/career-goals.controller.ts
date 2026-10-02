import { createResourceHandlers } from "../../../core/controller.utils";
import { CareerGoals } from "../model/career_goals.model";
import { CareerGoalsService } from "../service/career-goals.service";

const service = new CareerGoalsService();
const handlers = createResourceHandlers<CareerGoals>(service);

export const createCareerGoals = handlers.create;
export const getCareerGoalss = handlers.getAll;
export const getCareerGoalsById = handlers.getById;
export const updateCareerGoals = handlers.update;
export const deleteCareerGoals = handlers.delete;
