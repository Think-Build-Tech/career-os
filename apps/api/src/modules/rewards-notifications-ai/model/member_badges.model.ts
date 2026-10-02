import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class MemberBadges extends Model<InferAttributes<MemberBadges>, InferCreationAttributes<MemberBadges>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare badge_id: string;
    declare awarded_at: Date;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

MemberBadges.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    badge_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    awarded_at: {
        type: DataTypes.DATE,
        allowNull: true,
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
    tableName: "member_badges",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
