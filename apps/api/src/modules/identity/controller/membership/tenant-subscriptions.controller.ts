import { TenantSubscription } from "../../model/membership/tenant_subscriptions.model";
import type { TenantSubscriptionCreatePayload, TenantSubscriptionUpdatePayload } from "@repo/types";
import { TenantSubscriptionsService } from "../../service/membership/tenant-subscriptions.service";
import { BaseController } from "../base.controller";

export class TenantSubscriptionsController extends BaseController<TenantSubscription, TenantSubscriptionCreatePayload, TenantSubscriptionUpdatePayload> {
    constructor() {
        super(new TenantSubscriptionsService());
    }
}
