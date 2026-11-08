import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional,  } from "sequelize";

export class GlobalUser extends Model<InferAttributes<GlobalUser>, InferCreationAttributes<GlobalUser>>{
    declare id: CreationOptional<string>;
    declare email: string;
    declare phone: string;
    declare first_name: string;
    declare last_name: string;
    declare auth_provider: string;
    declare account_status: string;
    declare email_verified_at: Date;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}