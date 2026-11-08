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
import {
  createdAtAttribute,
  idAttribute,
  jsonArrayAttribute,
  modelOptions,
  optionalUuid,
  requiredUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";
import type { Skill } from "../../skill/models/skill.models";
import type { StudentProfile } from "../../student/models/student.model";
import type { User } from "../../user/user.model";

export class StudentProject extends Model<
  InferAttributes<StudentProject>,
  InferCreationAttributes<StudentProject>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare title: string;
  declare summary: CreationOptional<string | null>;
  declare description: string;
  declare project_type: CreationOptional<string>;
  declare student_role: CreationOptional<string | null>;
  declare contribution_description: CreationOptional<string | null>;
  declare impact_description: CreationOptional<string | null>;
  declare github_url: CreationOptional<string | null>;
  declare project_url: CreationOptional<string | null>;
  declare technology_stack: CreationOptional<string[]>;
  declare start_date: CreationOptional<Date | null>;
  declare end_date: CreationOptional<Date | null>;
  declare is_ongoing: CreationOptional<boolean>;
  declare visibility: CreationOptional<string>;
  declare verification_status: CreationOptional<string>;
  declare verified_by: CreationOptional<ForeignKey<User["id"]> | null>;
  declare verified_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
  declare verifier?: NonAttribute<User>;
  declare project_skills?: NonAttribute<ProjectSkill[]>;
}

export class ProjectSkill extends Model<
  InferAttributes<ProjectSkill>,
  InferCreationAttributes<ProjectSkill>
> {
  declare id: CreationOptional<string>;
  declare project_id: ForeignKey<StudentProject["id"]>;
  declare skill_id: ForeignKey<Skill["id"]>;
  declare created_at: CreationOptional<Date>;

  declare project?: NonAttribute<StudentProject>;
  declare skill?: NonAttribute<Skill>;
}

StudentProject.init(
  {
    id: idAttribute,
    student_id: requiredUuid("student_profiles", "CASCADE"),
    title: { type: DataTypes.STRING(200), allowNull: false },
    summary: { type: DataTypes.STRING(500), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    project_type: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: "ACADEMIC",
    },
    student_role: { type: DataTypes.STRING(128), allowNull: true },
    contribution_description: { type: DataTypes.TEXT, allowNull: true },
    impact_description: { type: DataTypes.TEXT, allowNull: true },
    github_url: { type: DataTypes.STRING(2048), allowNull: true, validate: { isUrl: true } },
    project_url: { type: DataTypes.STRING(2048), allowNull: true, validate: { isUrl: true } },
    technology_stack: jsonArrayAttribute,
    start_date: { type: DataTypes.DATEONLY, allowNull: true },
    end_date: { type: DataTypes.DATEONLY, allowNull: true },
    is_ongoing: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    visibility: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "COLLEGE",
    },
    verification_status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "UNVERIFIED",
    },
    verified_by: optionalUuid("users", "SET NULL"),
    verified_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "student_projects", "StudentProject", {
    indexes: [
      { fields: ["student_id"] },
      { fields: ["project_type"] },
      { fields: ["verification_status"] },
      { fields: ["visibility"] },
    ],
  })
);

ProjectSkill.init(
  {
    id: idAttribute,
    project_id: requiredUuid("student_projects", "CASCADE"),
    skill_id: requiredUuid("skills", "RESTRICT"),
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "project_skills", "ProjectSkill", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ unique: true, fields: ["project_id", "skill_id"] }, { fields: ["skill_id"] }],
  })
);

StudentProject.hasMany(ProjectSkill, { foreignKey: "project_id", as: "project_skills" });
ProjectSkill.belongsTo(StudentProject, { foreignKey: "project_id", as: "project" });

export default { StudentProject, ProjectSkill };
