import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute,  } from "sequelize";
import { GlobalUser } from "./global.user.model";
import { Tenant } from "./tenant.model";

export class TenantMembership extends Model<InferAttributes<TenantMembership>, InferCreationAttributes<TenantMembership>>{
    declare id: CreationOptional<string>;
    declare membership_type: string;
    declare status: string;
    declare joined_at: Date;
    declare expires_at: Date;

    declare tenant_id: ForeignKey<Tenant['id']>;
    declare global_user_id: ForeignKey<GlobalUser['id']>;

    declare tenant: NonAttribute<Tenant>;
    declare global_user: NonAttribute<GlobalUser>;
}