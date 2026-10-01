import { TenantSubscription } from "../../model/membership/tenant_subscriptions.model";
import type { TenantSubscriptionCreatePayload, TenantSubscriptionUpdatePayload } from "@repo/types";
import { TenantSubscriptionsRepository } from "../../repository/membership/tenant-subscriptions.repository";
import { BaseService } from "../base.service";

export class TenantSubscriptionsService extends BaseService<TenantSubscription, TenantSubscriptionCreatePayload, TenantSubscriptionUpdatePayload> {
    constructor() {
        super(new TenantSubscriptionsRepository());
    }
}
