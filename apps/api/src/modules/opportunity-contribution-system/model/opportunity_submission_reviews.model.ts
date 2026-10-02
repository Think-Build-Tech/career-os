import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class OpportunitySubmissionReviews extends Model<InferAttributes<OpportunitySubmissionReviews>, InferCreationAttributes<OpportunitySubmissionReviews>> {
    declare id: CreationOptional<string>;
    declare submission_id: string;
    declare reviewer_member_id: string;
    declare decision: string;
    declare comments: string;
    declare reviewed_at: Date;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

OpportunitySubmissionReviews.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    submission_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    reviewer_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    decision: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reviewed_at: {
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
    tableName: "opportunity_submission_reviews",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
