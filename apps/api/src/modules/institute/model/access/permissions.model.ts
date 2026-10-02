import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import sequelize from "../../../../config/database";
import { RolePermission } from "./role_permissions.model";

export class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
    declare id: CreationOptional<string>;
    declare code: string;
    declare module: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    declare role_permissions?: NonAttribute<RolePermission[]>;
}

Permission.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    module: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: "permissions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
