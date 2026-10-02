import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class AiConversations extends Model<InferAttributes<AiConversations>, InferCreationAttributes<AiConversations>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare context_type: string;
    declare context_id: string;
    declare title: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

AiConversations.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    context_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    context_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    title: {
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
    tableName: "ai_conversations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
