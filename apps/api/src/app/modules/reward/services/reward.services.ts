import { CreateReadService } from "../../services";
import { RewardTransaction } from "../models";

export class RewardTransactionService extends CreateReadService<RewardTransaction> {
  constructor() { super(RewardTransaction); }
}
