import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class RewardTransactions extends Model<InferAttributes<RewardTransactions>, InferCreationAttributes<RewardTransactions>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare points: number;
    declare transaction_type: string;
    declare reference_type: string;
    declare reference_id: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

RewardTransactions.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    transaction_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reference_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reference_id: {
        type: DataTypes.UUID,
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
    tableName: "reward_transactions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
