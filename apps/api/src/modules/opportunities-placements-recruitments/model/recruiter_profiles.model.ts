import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class RecruiterProfiles extends Model<InferAttributes<RecruiterProfiles>, InferCreationAttributes<RecruiterProfiles>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare institute_company_id: string;
    declare title: string;
    declare verified: boolean;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

RecruiterProfiles.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    institute_company_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    verified: {
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
    tableName: "recruiter_profiles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
