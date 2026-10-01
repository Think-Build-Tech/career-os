import { SubscriptionPlans } from "../catalog/subscription_plans";
import { Tenant } from "../tenant/tenants.model";
import { TenantSubscription } from "../membership/tenant_subscriptions.model";

Tenant.hasMany(TenantSubscription, {
    foreignKey: "tenant_id",
    as: "subscriptions",
});

TenantSubscription.belongsTo(Tenant, {
    foreignKey: "tenant_id",
    as: "tenant",
});

SubscriptionPlans.hasMany(TenantSubscription, {
    foreignKey: "plan_id",
    as: "subscriptions",
});

TenantSubscription.belongsTo(SubscriptionPlans, {
    foreignKey: "plan_id",
    as: "plan",
});
