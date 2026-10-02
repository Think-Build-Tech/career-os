import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class OpportunitySkills extends Model<InferAttributes<OpportunitySkills>, InferCreationAttributes<OpportunitySkills>> {
    declare id: CreationOptional<string>;
    declare opportunity_id: string;
    declare global_skill_id: string;
    declare requirement_type: string;
    declare minimum_level: string;
    declare weight: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

OpportunitySkills.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    opportunity_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    global_skill_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    requirement_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    minimum_level: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    weight: {
        type: DataTypes.DECIMAL(10, 2),
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
    tableName: "opportunity_skills",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
