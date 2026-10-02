import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import sequelize from "../../../../config/database";
import { Member } from "./members.model";

export class AlumniProfile extends Model<InferAttributes<AlumniProfile>, InferCreationAttributes<AlumniProfile>> {
    declare id: CreationOptional<string>;
    declare member_id: ForeignKey<Member["id"]>;
    declare program_id: string;
    declare graduation_year: number;
    declare mentorship_available: boolean;
    declare referrals_available: boolean;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    declare member?: NonAttribute<Member>;
}

AlumniProfile.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
    },
    program_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    graduation_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    mentorship_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    referrals_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    tableName: "alumni_profiles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
