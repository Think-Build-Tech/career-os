import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../../../config/database";
import {
  createdAtAttribute,
  idAttribute,
  jsonObjectAttribute,
  modelOptions,
  optionalUuid,
  requiredUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";
import type { StudentProfile } from "../../student/models/student.model";

export class Skill extends Model<InferAttributes<Skill>, InferCreationAttributes<Skill>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;
  declare category: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class StudentSkill extends Model<
  InferAttributes<StudentSkill>,
  InferCreationAttributes<StudentSkill>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare skill_id: ForeignKey<Skill["id"]>;
  declare proficiency_level: CreationOptional<string | null>;
  declare verification_status: CreationOptional<string>;
  declare verified_score: CreationOptional<number | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class SkillEvidence extends Model<
  InferAttributes<SkillEvidence>,
  InferCreationAttributes<SkillEvidence>
> {
  declare id: CreationOptional<string>;
  declare student_skill_id: ForeignKey<StudentSkill["id"]>;
  declare evidence_type: string;
  declare reference_id: CreationOptional<string | null>;
  declare evidence_data: CreationOptional<Record<string, unknown>>;
  declare verified_by: CreationOptional<string | null>;
  declare verified_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Skill.init(
  {
    id: idAttribute,
    name: { type: DataTypes.STRING(120), allowNull: false },
    slug: { type: DataTypes.STRING(140), allowNull: false, unique: true },
    category: { type: DataTypes.STRING(100), allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "skills", "Skill", {
    indexes: [{ fields: ["name"] }, { fields: ["category"] }],
  })
);

StudentSkill.init(
  {
    id: idAttribute,
    student_id: requiredUuid("student_profiles", "CASCADE"),
    skill_id: requiredUuid("skills", "RESTRICT"),
    proficiency_level: { type: DataTypes.STRING(32), allowNull: true },
    verification_status: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "SELF_DECLARED",
    },
    verified_score: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "student_skills", "StudentSkill", {
    indexes: [
      { unique: true, fields: ["student_id", "skill_id"] },
      { fields: ["skill_id"] },
      { fields: ["verification_status"] },
    ],
  })
);

SkillEvidence.init(
  {
    id: idAttribute,
    student_skill_id: requiredUuid("student_skills", "CASCADE"),
    evidence_type: { type: DataTypes.STRING(40), allowNull: false },
    reference_id: optionalUuid(),
    evidence_data: jsonObjectAttribute,
    verified_by: optionalUuid("users"),
    verified_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "skill_evidence", "SkillEvidence", {
    indexes: [{ fields: ["student_skill_id"] }, { fields: ["evidence_type", "reference_id"] }],
  })
);

StudentSkill.belongsTo(Skill, { foreignKey: "skill_id", as: "skill" });
Skill.hasMany(StudentSkill, { foreignKey: "skill_id", as: "student_skills" });
StudentSkill.hasMany(SkillEvidence, { foreignKey: "student_skill_id", as: "evidence" });
SkillEvidence.belongsTo(StudentSkill, { foreignKey: "student_skill_id", as: "student_skill" });

export default { Skill, StudentSkill, SkillEvidence };
