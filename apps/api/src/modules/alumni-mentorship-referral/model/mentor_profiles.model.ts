import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class MentorProfiles extends Model<InferAttributes<MentorProfiles>, InferCreationAttributes<MentorProfiles>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare bio: string;
    declare available: boolean;
    declare max_active_mentees: number;
    declare years_experience: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

MentorProfiles.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    max_active_mentees: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    years_experience: {
        type: DataTypes.DECIMAL(10, 2),
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
    tableName: "mentor_profiles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
