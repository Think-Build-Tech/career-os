import { BaseRepository } from "../../../core/base.repository";
import { RewardRules } from "../model/reward_rules.model";

export class RewardRulesRepository extends BaseRepository<RewardRules> {
    constructor() {
        super(RewardRules);
    }
}
