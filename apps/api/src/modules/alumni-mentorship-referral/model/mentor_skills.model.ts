import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class MentorSkills extends Model<InferAttributes<MentorSkills>, InferCreationAttributes<MentorSkills>> {
    declare id: CreationOptional<string>;
    declare mentor_profile_id: string;
    declare global_skill_id: string;
    declare skill_name_snapshot: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

MentorSkills.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    mentor_profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    global_skill_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    skill_name_snapshot: {
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
    tableName: "mentor_skills",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
