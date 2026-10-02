import { createResourceHandlers } from "../../../core/controller.utils";
import { RewardRules } from "../model/reward_rules.model";
import { RewardRulesService } from "../service/reward-rules.service";

const service = new RewardRulesService();
const handlers = createResourceHandlers<RewardRules>(service);

export const createRewardRules = handlers.create;
export const getRewardRuless = handlers.getAll;
export const getRewardRulesById = handlers.getById;
export const updateRewardRules = handlers.update;
export const deleteRewardRules = handlers.delete;
