import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import {
  createdAtAttribute,
  idAttribute,
  jsonObjectAttribute,
  modelOptions,
  optionalUuid,
  requiredUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";

export class Tenant extends Model<InferAttributes<Tenant>, InferCreationAttributes<Tenant>> {
  declare id: CreationOptional<string>;
  declare college_code: string;
  declare name: string;
  declare slug: string;
  declare institution_type: string;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare activated_at: CreationOptional<Date | null>;
  declare updated_at: CreationOptional<Date>;
  declare database?: NonAttribute<TenantDatabase>;
  declare memberships?: NonAttribute<TenantMembership[]>;
}

export class GlobalUser extends Model<
  InferAttributes<GlobalUser>,
  InferCreationAttributes<GlobalUser>
> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare password_hash: string;
  declare status: CreationOptional<string>;
  declare last_login_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare memberships?: NonAttribute<TenantMembership[]>;
}

export class TenantMembership extends Model<
  InferAttributes<TenantMembership>,
  InferCreationAttributes<TenantMembership>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: ForeignKey<Tenant["id"]>;
  declare global_user_id: ForeignKey<GlobalUser["id"]>;
  declare local_user_id: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class TenantDatabase extends Model<
  InferAttributes<TenantDatabase>,
  InferCreationAttributes<TenantDatabase>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: ForeignKey<Tenant["id"]>;
  declare provider: string;
  declare database_name: string;
  declare host_reference: string;
  declare secret_reference: string;
  declare region: CreationOptional<string | null>;
  declare schema_version: CreationOptional<string>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class TenantProvisioningJob extends Model<
  InferAttributes<TenantProvisioningJob>,
  InferCreationAttributes<TenantProvisioningJob>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: ForeignKey<Tenant["id"]>;
  declare status: CreationOptional<string>;
  declare current_step: CreationOptional<string | null>;
  declare attempts: CreationOptional<number>;
  declare error_details: CreationOptional<Record<string, unknown> | null>;
  declare started_at: CreationOptional<Date | null>;
  declare completed_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class Subscription extends Model<
  InferAttributes<Subscription>,
  InferCreationAttributes<Subscription>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: ForeignKey<Tenant["id"]>;
  declare plan_code: string;
  declare status: CreationOptional<string>;
  declare starts_at: Date;
  declare ends_at: CreationOptional<Date | null>;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class PlatformAdmin extends Model<
  InferAttributes<PlatformAdmin>,
  InferCreationAttributes<PlatformAdmin>
> {
  declare id: CreationOptional<string>;
  declare global_user_id: ForeignKey<GlobalUser["id"]>;
  declare access_level: CreationOptional<string>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export function initializeControlModels(sequelize: Sequelize): void {
  Tenant.init(
    {
      id: idAttribute,
      college_code: {
        type: DataTypes.CHAR(4),
        allowNull: false,
        unique: true,
        validate: { is: /^\d{4}$/ },
      },
      name: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      institution_type: { type: DataTypes.STRING(64), allowNull: false },
      status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "PROVISIONING" },
      created_at: createdAtAttribute,
      activated_at: { type: DataTypes.DATE, allowNull: true },
      updated_at: updatedAtAttribute,
    },
    modelOptions(sequelize, "tenants", "Tenant", {
      indexes: [{ unique: true, fields: ["college_code"] }, { unique: true, fields: ["slug"] }],
    })
  );

  GlobalUser.init(
    {
      id: idAttribute,
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
      last_login_at: { type: DataTypes.DATE, allowNull: true },
      created_at: createdAtAttribute,
      updated_at: updatedAtAttribute,
    },
    modelOptions(sequelize, "global_users", "GlobalUser")
  );

  TenantMembership.init(
    {
      id: idAttribute,
      tenant_id: requiredUuid("tenants", "CASCADE"),
      global_user_id: requiredUuid("global_users", "CASCADE"),
      local_user_id: optionalUuid(),
      status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
      created_at: createdAtAttribute,
      updated_at: updatedAtAttribute,
    },
    modelOptions(sequelize, "tenant_memberships", "TenantMembership", {
      indexes: [
        { unique: true, fields: ["tenant_id", "global_user_id"] },
        { fields: ["global_user_id"] },
      ],
    })
  );

  TenantDatabase.init(
    {
      id: idAttribute,
      tenant_id: { ...requiredUuid("tenants", "CASCADE"), unique: true },
      provider: { type: DataTypes.STRING(32), allowNull: false },
      database_name: { type: DataTypes.STRING, allowNull: false },
      host_reference: { type: DataTypes.STRING, allowNull: false },
      secret_reference: { type: DataTypes.STRING, allowNull: false },
      region: { type: DataTypes.STRING(64), allowNull: true },
      schema_version: { type: DataTypes.STRING(64), allowNull: false, defaultValue: "0" },
      status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "PROVISIONING" },
      created_at: createdAtAttribute,
      updated_at: updatedAtAttribute,
    },
    modelOptions(sequelize, "tenant_databases", "TenantDatabase")
  );

  TenantProvisioningJob.init(
    {
      id: idAttribute,
      tenant_id: requiredUuid("tenants", "CASCADE"),
      status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "QUEUED" },
      current_step: { type: DataTypes.STRING(64), allowNull: true },
      attempts: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
      error_details: { type: DataTypes.JSONB, allowNull: true },
      started_at: { type: DataTypes.DATE, allowNull: true },
      completed_at: { type: DataTypes.DATE, allowNull: true },
      created_at: createdAtAttribute,
      updated_at: updatedAtAttribute,
    },
    modelOptions(sequelize, "tenant_provisioning_jobs", "TenantProvisioningJob", {
      indexes: [{ fields: ["tenant_id", "status"] }],
    })
  );

  Subscription.init(
    {
      id: idAttribute,
      tenant_id: requiredUuid("tenants", "CASCADE"),
      plan_code: { type: DataTypes.STRING(64), allowNull: false },
      status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
      starts_at: { type: DataTypes.DATE, allowNull: false },
      ends_at: { type: DataTypes.DATE, allowNull: true },
      metadata: jsonObjectAttribute,
      created_at: createdAtAttribute,
      updated_at: updatedAtAttribute,
    },
    modelOptions(sequelize, "subscriptions", "Subscription", {
      indexes: [{ fields: ["tenant_id", "status"] }],
    })
  );

  PlatformAdmin.init(
    {
      id: idAttribute,
      global_user_id: { ...requiredUuid("global_users", "CASCADE"), unique: true },
      access_level: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ADMIN" },
      status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
      created_at: createdAtAttribute,
      updated_at: updatedAtAttribute,
    },
    modelOptions(sequelize, "platform_admins", "PlatformAdmin")
  );

  Tenant.hasOne(TenantDatabase, { foreignKey: "tenant_id", as: "database" });
  Tenant.hasMany(TenantMembership, { foreignKey: "tenant_id", as: "memberships" });
  Tenant.hasMany(Subscription, { foreignKey: "tenant_id", as: "subscriptions" });
  Tenant.hasMany(TenantProvisioningJob, { foreignKey: "tenant_id", as: "jobs" });
  GlobalUser.hasMany(TenantMembership, { foreignKey: "global_user_id", as: "memberships" });
  TenantMembership.belongsTo(Tenant, { foreignKey: "tenant_id", as: "tenant" });
  TenantMembership.belongsTo(GlobalUser, { foreignKey: "global_user_id", as: "global_user" });
  TenantDatabase.belongsTo(Tenant, { foreignKey: "tenant_id", as: "tenant" });
  TenantProvisioningJob.belongsTo(Tenant, { foreignKey: "tenant_id", as: "tenant" });
  Subscription.belongsTo(Tenant, { foreignKey: "tenant_id", as: "tenant" });
  PlatformAdmin.belongsTo(GlobalUser, { foreignKey: "global_user_id", as: "global_user" });
}
