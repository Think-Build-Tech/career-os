import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from "../../../config/database";
import { Cohort } from "../../cohort/cohort.model";
import { Department } from "../../department/department.model";
import { Program } from "../../program/program.model";
import { User } from "../../user/user.model";
import type { StudentAcademicMembership } from "../../academic/models/student-academic-membership.model";
import type { StudentAcademicRecord } from "../../academic/models/student-academic-record.model";
import type { StudentReputationEvent } from "../../reputation/models/reputation-event.model";
import type { StudentReputationSummary } from "../../reputation/models/student-reputation-summary.model";
import type { Resume } from "../../resume/models/resume.model";
import type { RewardTransaction } from "../../reward/models/reward-transaction.model";
import type { StudentCareerProfile } from "./student-career-profile.model";

export class StudentProfile extends Model<
  InferAttributes<StudentProfile>,
  InferCreationAttributes<StudentProfile>
> {
  declare id: CreationOptional<string>;
  declare user_id: ForeignKey<User["id"]>;
  declare department_id: ForeignKey<Department["id"]>;
  declare program_id: ForeignKey<Program["id"]>;
  declare cohort_id: ForeignKey<Cohort["id"]>;
  declare roll_number: string;
  declare prn_number: CreationOptional<string | null>;
  declare placement_status: CreationOptional<string>;
  declare profile_completion_percent: CreationOptional<number>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare user?: NonAttribute<User>;
  declare department?: NonAttribute<Department>;
  declare program?: NonAttribute<Program>;
  declare cohort?: NonAttribute<Cohort>;
  declare academic_records?: NonAttribute<StudentAcademicRecord[]>;
  declare academic_memberships?: NonAttribute<StudentAcademicMembership[]>;
  declare career_profile?: NonAttribute<StudentCareerProfile>;
  declare reputation_events?: NonAttribute<StudentReputationEvent[]>;
  declare reputation_summary?: NonAttribute<StudentReputationSummary>;
  declare reward_transactions?: NonAttribute<RewardTransaction[]>;
  declare resumes?: NonAttribute<Resume[]>;
}

StudentProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: User, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Department, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    program_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Program, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    cohort_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Cohort, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    roll_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prn_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    placement_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "SEEKING",
    },
    profile_completion_percent: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 100 },
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
  },
  {
    sequelize,
    tableName: "student_profiles",
    modelName: "StudentProfile",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { unique: true, fields: ["user_id"], name: "unique_student_profiles_user_id" },
      {
        unique: true,
        fields: ["cohort_id", "roll_number"],
        name: "unique_student_cohort_roll_number",
      },
      {
        unique: true,
        fields: ["prn_number"],
        name: "unique_student_profiles_prn_number",
      },
      { fields: ["department_id"], name: "idx_student_profiles_department_id" },
      { fields: ["program_id"], name: "idx_student_profiles_program_id" },
      { fields: ["cohort_id"], name: "idx_student_profiles_cohort_id" },
      { fields: ["placement_status"], name: "idx_student_profiles_placement_status" },
    ],
  }
);

StudentProfile.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasOne(StudentProfile, {
  foreignKey: "user_id",
  as: "student_profile",
  onDelete: "CASCADE",
});

StudentProfile.belongsTo(Department, { foreignKey: "department_id", as: "department" });
Department.hasMany(StudentProfile, {
  foreignKey: "department_id",
  as: "students",
  onDelete: "RESTRICT",
});

StudentProfile.belongsTo(Program, { foreignKey: "program_id", as: "program" });
Program.hasMany(StudentProfile, {
  foreignKey: "program_id",
  as: "students",
  onDelete: "RESTRICT",
});

StudentProfile.belongsTo(Cohort, { foreignKey: "cohort_id", as: "cohort" });
Cohort.hasMany(StudentProfile, {
  foreignKey: "cohort_id",
  as: "students",
  onDelete: "RESTRICT",
});

export default StudentProfile;
