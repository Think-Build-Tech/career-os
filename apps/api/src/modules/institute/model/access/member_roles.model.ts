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
import { Member } from "../member/members.model";
import { Role } from "./roles.model";

export class MemberRole extends Model<InferAttributes<MemberRole>, InferCreationAttributes<MemberRole>> {
    declare id: CreationOptional<string>;
    declare member_id: ForeignKey<Member["id"]>;
    declare role_id: ForeignKey<Role["id"]>;
    declare assigned_at: CreationOptional<Date>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    declare member?: NonAttribute<Member>;
    declare role?: NonAttribute<Role>;
}

MemberRole.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    role_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    assigned_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
    tableName: "member_roles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
