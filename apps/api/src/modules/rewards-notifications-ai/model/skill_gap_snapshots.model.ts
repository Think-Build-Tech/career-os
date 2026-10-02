import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class SkillGapSnapshots extends Model<InferAttributes<SkillGapSnapshots>, InferCreationAttributes<SkillGapSnapshots>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare global_career_role_id: string;
    declare score: number;
    declare analysis: any;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

SkillGapSnapshots.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    global_career_role_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    score: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    analysis: {
        type: DataTypes.JSON,
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
    tableName: "skill_gap_snapshots",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
