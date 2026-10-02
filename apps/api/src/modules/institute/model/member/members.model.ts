import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { IdAccount } from "../../../identity/model/account/id_accounts.model";
import { Certification } from "./certification.model";
import { Project } from "./projects.model";
import { ProfessionalExperience } from "./professional_experiences.model";
import { MemberProfile } from "./member_profiles.model";
import { AlumniProfile } from "./alumni_profiles.model";
import { MemberSkill } from "./member_skills.model";
import { TpoProfile } from "./tpo_profiles.model";
import { FacultyProfile } from "./faculty_profiles.model";
import { StudentProfile } from "./student_profiles.model";
import { MemberRole } from "../access/member_roles.model";

export class Member extends Model<InferAttributes<Member>, InferCreationAttributes<Member>> {
    declare id: CreationOptional<string>;
    declare account_id: ForeignKey<IdAccount["id"]>;
    declare institutional_email: string;
    declare status: string;
    declare joined_at: CreationOptional<Date>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    declare account?: NonAttribute<IdAccount>;
    declare certifications?: NonAttribute<Certification[]>;
    declare projects?: NonAttribute<Project[]>;
    declare professional_experiences?: NonAttribute<ProfessionalExperience[]>;
    declare profile?: NonAttribute<MemberProfile>;
    declare alumni_profile?: NonAttribute<AlumniProfile>;
    declare skills?: NonAttribute<MemberSkill[]>;
    declare tpo_profile?: NonAttribute<TpoProfile>;
    declare faculty_profile?: NonAttribute<FacultyProfile>;
    declare student_profile?: NonAttribute<StudentProfile>;
    declare roles?: NonAttribute<MemberRole[]>;
}

Member.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    account_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    institutional_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
    },
    joined_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
    tableName: "members",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});