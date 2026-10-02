import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class RewardRules extends Model<InferAttributes<RewardRules>, InferCreationAttributes<RewardRules>> {
    declare id: CreationOptional<string>;
    declare action_code: string;
    declare points: number;
    declare enabled: boolean;
    declare approval_required: boolean;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

RewardRules.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    action_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    approval_required: {
        type: DataTypes.BOOLEAN,
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
    tableName: "reward_rules",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
