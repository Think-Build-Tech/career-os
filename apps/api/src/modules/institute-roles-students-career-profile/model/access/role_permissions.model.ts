import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import sequelize from "../../../../config/database";
import { Permission } from "./permissions.model";
import { Role } from "./roles.model";

export class RolePermission extends Model<InferAttributes<RolePermission>, InferCreationAttributes<RolePermission>> {
    declare id: CreationOptional<string>;
    declare role_id: ForeignKey<Role["id"]>;
    declare permission_id: ForeignKey<Permission["id"]>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare role?: NonAttribute<Role>;
    declare permission?: NonAttribute<Permission>;
}

RolePermission.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    role_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    permission_id: {
        type: DataTypes.UUID,
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
    tableName: "role_permissions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [{
        unique: true,
        fields: ["role_id", "permission_id"],
    }],
});
