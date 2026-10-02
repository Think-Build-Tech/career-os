import { BaseService } from "../../../core/base.service";
import { RewardRules } from "../model/reward_rules.model";
import { RewardRulesRepository } from "../repository/reward-rules.repository";

export class RewardRulesService extends BaseService<RewardRules> {
    constructor() {
        super(new RewardRulesRepository());
    }
}
