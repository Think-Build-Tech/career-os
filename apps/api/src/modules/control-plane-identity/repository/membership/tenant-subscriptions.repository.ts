import { TenantSubscription } from "../../model/membership/tenant_subscriptions.model";
import { BaseRepository } from "../base.repository";

export class TenantSubscriptionsRepository extends BaseRepository<TenantSubscription> {
    constructor() {
        super(TenantSubscription);
    }
}
