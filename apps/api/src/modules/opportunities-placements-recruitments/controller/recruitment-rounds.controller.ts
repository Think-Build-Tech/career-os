import { createResourceHandlers } from "../../../core/controller.utils";
import { RecruitmentRounds } from "../model/recruitment_rounds.model";
import { RecruitmentRoundsService } from "../service/recruitment-rounds.service";

const service = new RecruitmentRoundsService();
const handlers = createResourceHandlers<RecruitmentRounds>(service);

export const createRecruitmentRounds = handlers.create;
export const getRecruitmentRoundss = handlers.getAll;
export const getRecruitmentRoundsById = handlers.getById;
export const updateRecruitmentRounds = handlers.update;
export const deleteRecruitmentRounds = handlers.delete;
