import { SubscriptionPlans } from "../../model/catalog/subscription_plans";
import type { SubscriptionPlansCreatePayload, SubscriptionPlansUpdatePayload } from "@repo/types";
import { SubscriptionPlansService } from "../../service/catalog/subscription-plans.service";
import { BaseController } from "../base.controller";

export class SubscriptionPlansController extends BaseController<SubscriptionPlans, SubscriptionPlansCreatePayload, SubscriptionPlansUpdatePayload> {
    constructor() {
        super(new SubscriptionPlansService());
    }
}
