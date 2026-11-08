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
import { User } from "../../user/user.model";

export class StudentAcademicRecord extends Model<
  InferAttributes<StudentAcademicRecord>,
  InferCreationAttributes<StudentAcademicRecord>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare record_type: string;
  declare semester: CreationOptional<string | null>;
  declare cgpa: CreationOptional<number | null>;
  declare sgpa: CreationOptional<number | null>;
  declare percentage: CreationOptional<number | null>;
  declare active_backlogs: CreationOptional<number>;
  declare total_backlogs: CreationOptional<number>;
  declare source_type: string;
  declare source_reference: CreationOptional<string | null>;
  declare verified: CreationOptional<boolean>;
  declare verified_by: CreationOptional<ForeignKey<User["id"]> | null>;
  declare verified_at: CreationOptional<Date | null>;
  declare effective_from: Date;
  declare effective_until: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
  declare verifier?: NonAttribute<User>;
}

StudentAcademicRecord.init(
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
    record_type: { type: DataTypes.STRING(64), allowNull: false },
    semester: { type: DataTypes.STRING(32), allowNull: true },
    cgpa: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: { min: 0, max: 10 },
    },
    sgpa: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: { min: 0, max: 10 },
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: { min: 0, max: 100 },
    },
    active_backlogs: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    total_backlogs: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    source_type: { type: DataTypes.STRING(64), allowNull: false },
    source_reference: { type: DataTypes.STRING, allowNull: true },
    verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    verified_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: User, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    verified_at: { type: DataTypes.DATE, allowNull: true },
    effective_from: { type: DataTypes.DATE, allowNull: false },
    effective_until: { type: DataTypes.DATE, allowNull: true },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "student_academic_records",
    modelName: "StudentAcademicRecord",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    underscored: true,
    validate: {
      verificationMetadataIsConsistent() {
        if (this.verified && (!this.verified_by || !this.verified_at)) {
          throw new Error("verified academic records require verified_by and verified_at");
        }
        if (!this.verified && (this.verified_by || this.verified_at)) {
          throw new Error("unverified academic records cannot have verification metadata");
        }
      },
      effectiveRangeIsValid() {
        if (this.effective_until && this.effective_until < this.effective_from) {
          throw new Error("effective_until must be later than effective_from");
        }
      },
    },
    indexes: [
      { fields: ["student_id"], name: "idx_academic_records_student_id" },
      { fields: ["student_id", "record_type"], name: "idx_academic_records_student_type" },
      { fields: ["verified_by"], name: "idx_academic_records_verified_by" },
      { fields: ["effective_from", "effective_until"], name: "idx_academic_records_effective_range" },
    ],
  }
);

StudentAcademicRecord.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
StudentProfile.hasMany(StudentAcademicRecord, {
  foreignKey: "student_id",
  as: "academic_records",
  onDelete: "CASCADE",
});
StudentAcademicRecord.belongsTo(User, { foreignKey: "verified_by", as: "verifier" });

export default StudentAcademicRecord;
