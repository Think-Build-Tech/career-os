import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute,  } from "sequelize";
import { GlobalUser } from "./global.user.model";

export class PlatformAdmin extends Model<InferAttributes<PlatformAdmin>, InferCreationAttributes<PlatformAdmin>>{
    declare id: CreationOptional<string>;
    declare role: string;
    declare status: string;

    declare global_user_id: ForeignKey<GlobalUser['id']>;

    declare global_user: NonAttribute<GlobalUser>;
}