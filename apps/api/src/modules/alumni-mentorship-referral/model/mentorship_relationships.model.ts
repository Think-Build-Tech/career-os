import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class MentorshipRelationships extends Model<InferAttributes<MentorshipRelationships>, InferCreationAttributes<MentorshipRelationships>> {
    declare id: CreationOptional<string>;
    declare mentor_member_id: string;
    declare mentee_member_id: string;
    declare request_id: string;
    declare status: string;
    declare started_at: Date;
    declare ended_at: Date;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

MentorshipRelationships.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    mentor_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    mentee_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    request_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    started_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ended_at: {
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
    tableName: "mentorship_relationships",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
