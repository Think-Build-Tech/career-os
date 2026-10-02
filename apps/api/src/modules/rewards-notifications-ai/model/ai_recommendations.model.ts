import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class AiRecommendations extends Model<InferAttributes<AiRecommendations>, InferCreationAttributes<AiRecommendations>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare recommendation_type: string;
    declare source_type: string;
    declare source_id: string;
    declare confidence: number;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

AiRecommendations.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    recommendation_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    source_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    source_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    confidence: {
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
    tableName: "ai_recommendations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
