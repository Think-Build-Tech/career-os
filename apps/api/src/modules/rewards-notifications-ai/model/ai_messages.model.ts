import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class AiMessages extends Model<InferAttributes<AiMessages>, InferCreationAttributes<AiMessages>> {
    declare id: CreationOptional<string>;
    declare conversation_id: string;
    declare sender: string;
    declare model: string;
    declare content: string;
    declare token_usage: any;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

AiMessages.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    conversation_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    token_usage: {
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
    tableName: "ai_messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
