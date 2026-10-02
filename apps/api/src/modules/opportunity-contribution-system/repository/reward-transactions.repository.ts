import { BaseRepository } from "../../../core/base.repository";
import { RewardTransactions } from "../model/reward_transactions.model";

export class RewardTransactionsRepository extends BaseRepository<RewardTransactions> {
    constructor() {
        super(RewardTransactions);
    }
}
