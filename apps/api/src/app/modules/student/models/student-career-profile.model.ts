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
import { StudentProfile } from "./student.model";

export class StudentCareerProfile extends Model<
  InferAttributes<StudentCareerProfile>,
  InferCreationAttributes<StudentCareerProfile>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare headline: CreationOptional<string | null>;
  declare bio: CreationOptional<string | null>;
  declare preferred_roles: CreationOptional<string[]>;
  declare preferred_locations: CreationOptional<string[]>;
  declare preferred_work_modes: CreationOptional<string[]>;
  declare expected_salary_min: CreationOptional<number | null>;
  declare expected_salary_max: CreationOptional<number | null>;
  declare linkedin_url: CreationOptional<string | null>;
  declare github_url: CreationOptional<string | null>;
  declare portfolio_url: CreationOptional<string | null>;
  declare open_to_work: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
}

StudentCareerProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: StudentProfile, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    headline: { type: DataTypes.STRING(200), allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    preferred_roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    preferred_locations: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    preferred_work_modes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    expected_salary_min: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
      validate: { min: 0 },
    },
    expected_salary_max: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
      validate: { min: 0 },
    },
    linkedin_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      validate: { isUrl: true },
    },
    github_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      validate: { isUrl: true },
    },
    portfolio_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      validate: { isUrl: true },
    },
    open_to_work: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
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
    tableName: "student_career_profiles",
    modelName: "StudentCareerProfile",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    validate: {
      salaryRangeIsValid() {
        if (
          this.expected_salary_min != null &&
          this.expected_salary_max != null &&
          Number(this.expected_salary_max) < Number(this.expected_salary_min)
        ) {
          throw new Error("expected_salary_max must be greater than or equal to expected_salary_min");
        }
      },
    },
    indexes: [{ unique: true, fields: ["student_id"], name: "unique_career_profile_student" }],
  }
);

StudentCareerProfile.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
StudentProfile.hasOne(StudentCareerProfile, {
  foreignKey: "student_id",
  as: "career_profile",
  onDelete: "CASCADE",
});

export default StudentCareerProfile;
