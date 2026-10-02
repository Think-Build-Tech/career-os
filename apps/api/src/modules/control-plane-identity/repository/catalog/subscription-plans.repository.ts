import { SubscriptionPlans } from "../../model/catalog/subscription_plans";
import { BaseRepository } from "../base.repository";

export class SubscriptionPlansRepository extends BaseRepository<SubscriptionPlans> {
    constructor() {
        super(SubscriptionPlans);
    }
}
