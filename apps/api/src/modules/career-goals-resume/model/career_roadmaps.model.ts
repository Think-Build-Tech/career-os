import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class CareerRoadmaps extends Model<InferAttributes<CareerRoadmaps>, InferCreationAttributes<CareerRoadmaps>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare career_goal_id: string;
    declare title: string;
    declare generated_by: string;
    declare progress_percent: number;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

CareerRoadmaps.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    career_goal_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    generated_by: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    progress_percent: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
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
    tableName: "career_roadmaps",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
