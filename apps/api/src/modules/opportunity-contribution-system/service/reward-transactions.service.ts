import { BaseService } from "../../../core/base.service";
import { RewardTransactions } from "../model/reward_transactions.model";
import { RewardTransactionsRepository } from "../repository/reward-transactions.repository";

export class RewardTransactionsService extends BaseService<RewardTransactions> {
    constructor() {
        super(new RewardTransactionsRepository());
    }
}
