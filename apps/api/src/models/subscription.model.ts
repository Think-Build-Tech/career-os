import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute,  } from "sequelize";
import { Tenant } from "./tenant.model";

export class Subscription extends Model<InferAttributes<Subscription>, InferCreationAttributes<Subscription>>{
    declare id: CreationOptional<string>;
    declare plan: string;
    declare status: string;
    declare start_date: Date;
    declare end_date: Date;
    declare feature_config: Object;

    declare tenant_id: ForeignKey<Tenant['id']>;

    declare tenant: NonAttribute<Tenant>;
}