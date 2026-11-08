import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional,  } from "sequelize";

export class Tenant extends Model<InferAttributes<Tenant>, InferCreationAttributes<Tenant>>{
    declare id: CreationOptional<string>;
    declare college_code: string;
    declare name: string;
    declare slug: string;
    declare status: string;
    declare institution_type: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}