import { createResourceHandlers } from "../../../core/controller.utils";
import { RewardTransactions } from "../model/reward_transactions.model";
import { RewardTransactionsService } from "../service/reward-transactions.service";

const service = new RewardTransactionsService();
const handlers = createResourceHandlers<RewardTransactions>(service);

export const createRewardTransactions = handlers.create;
export const getRewardTransactionss = handlers.getAll;
export const getRewardTransactionsById = handlers.getById;
export const updateRewardTransactions = handlers.update;
export const deleteRewardTransactions = handlers.delete;
