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
import { StudentProfile } from "../../student/models/student.model";
import type { ResumeVersion } from "./resume-version.model";

export class Resume extends Model<
  InferAttributes<Resume>,
  InferCreationAttributes<Resume>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare name: string;
  declare is_primary: CreationOptional<boolean>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
  declare versions?: NonAttribute<ResumeVersion[]>;
}

Resume.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: StudentProfile, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    name: { type: DataTypes.STRING(200), allowNull: false },
    is_primary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
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
    tableName: "resumes",
    modelName: "Resume",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["student_id"], name: "idx_resumes_student_id" },
      { fields: ["status"], name: "idx_resumes_status" },
      {
        unique: true,
        fields: ["student_id"],
        where: { is_primary: true },
        name: "unique_primary_resume_per_student",
      },
    ],
  }
);

Resume.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
StudentProfile.hasMany(Resume, {
  foreignKey: "student_id",
  as: "resumes",
  onDelete: "CASCADE",
});

export default Resume;
