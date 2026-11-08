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
import { StudentProfile } from "../../student/models/student.model";

export class StudentAcademicMembership extends Model<
  InferAttributes<StudentAcademicMembership>,
  InferCreationAttributes<StudentAcademicMembership>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare department_id: ForeignKey<Department["id"]>;
  declare program_id: ForeignKey<Program["id"]>;
  declare cohort_id: ForeignKey<Cohort["id"]>;
  declare effective_from: Date;
  declare effective_to: CreationOptional<Date | null>;
  declare is_current: CreationOptional<boolean>;
  declare change_reason: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
  declare department?: NonAttribute<Department>;
  declare program?: NonAttribute<Program>;
  declare cohort?: NonAttribute<Cohort>;
}

StudentAcademicMembership.init(
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
    effective_from: { type: DataTypes.DATE, allowNull: false },
    effective_to: { type: DataTypes.DATE, allowNull: true },
    is_current: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    change_reason: { type: DataTypes.TEXT, allowNull: true },
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
    tableName: "student_academic_memberships",
    modelName: "StudentAcademicMembership",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    validate: {
      effectiveRangeIsValid() {
        if (this.effective_to && this.effective_to < this.effective_from) {
          throw new Error("effective_to must be later than effective_from");
        }
        if (this.is_current && this.effective_to) {
          throw new Error("a current academic membership cannot have effective_to");
        }
      },
    },
    indexes: [
      { fields: ["student_id"], name: "idx_academic_memberships_student_id" },
      { fields: ["department_id"], name: "idx_academic_memberships_department_id" },
      { fields: ["program_id"], name: "idx_academic_memberships_program_id" },
      { fields: ["cohort_id"], name: "idx_academic_memberships_cohort_id" },
      {
        unique: true,
        fields: ["student_id"],
        where: { is_current: true },
        name: "unique_current_academic_membership_per_student",
      },
    ],
  }
);

StudentAcademicMembership.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
StudentProfile.hasMany(StudentAcademicMembership, {
  foreignKey: "student_id",
  as: "academic_memberships",
  onDelete: "CASCADE",
});
StudentAcademicMembership.belongsTo(Department, { foreignKey: "department_id", as: "department" });
StudentAcademicMembership.belongsTo(Program, { foreignKey: "program_id", as: "program" });
StudentAcademicMembership.belongsTo(Cohort, { foreignKey: "cohort_id", as: "cohort" });

export default StudentAcademicMembership;
