import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class OpportunitySubmissionMessages extends Model<InferAttributes<OpportunitySubmissionMessages>, InferCreationAttributes<OpportunitySubmissionMessages>> {
    declare id: CreationOptional<string>;
    declare submission_id: string;
    declare sender_member_id: string;
    declare body: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

OpportunitySubmissionMessages.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    submission_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    sender_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    body: {
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
    tableName: "opportunity_submission_messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
