import { SubscriptionPlans } from "../../model/catalog/subscription_plans";
import type { SubscriptionPlansCreatePayload, SubscriptionPlansUpdatePayload } from "@repo/types";
import { SubscriptionPlansRepository } from "../../repository/catalog/subscription-plans.repository";
import { BaseService } from "../base.service";

export class SubscriptionPlansService extends BaseService<SubscriptionPlans, SubscriptionPlansCreatePayload, SubscriptionPlansUpdatePayload> {
    constructor() {
        super(new SubscriptionPlansRepository());
    }
}
