import { FeaturesBase } from "../catalog/features.model";
import { Tenant } from "../tenant/tenants.model";
import { TenantFeatures } from "../tenant/tenant_features.model";

Tenant.hasMany(TenantFeatures, {
    foreignKey: "tenant_id",
    as: "tenant_features",
});

TenantFeatures.belongsTo(Tenant, {
    foreignKey: "tenant_id",
    as: "tenant",
});

FeaturesBase.hasMany(TenantFeatures, {
    foreignKey: "feature_id",
    as: "features",
});

TenantFeatures.belongsTo(FeaturesBase, {
    foreignKey: "feature_id",
    as: "feature",
});
