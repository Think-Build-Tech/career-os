import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute,  } from "sequelize";
import { Tenant } from "./tenant.model";

export class TenantProvisioningJob extends Model<InferAttributes<TenantProvisioningJob>, InferCreationAttributes<TenantProvisioningJob>>{
    declare id: CreationOptional<string>;
    declare status: string;
    declare current_step: string;
    declare error_code: string;
    declare error_message: string;
    declare started_at: Date;
    declare completed_at: Date;

    declare tenant_id: ForeignKey<Tenant['id']>;
    declare tenant: NonAttribute<Tenant>;

}