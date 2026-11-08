import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from "../../config/database";
import { Program } from "../program/program.model";
import type { StudentProfile } from "../student/models/student.model";

export class Cohort extends Model<
  InferAttributes<Cohort>,
  InferCreationAttributes<Cohort>
> {
  declare id: CreationOptional<string>;
  declare program_id: ForeignKey<Program["id"]>;
  declare admission_year: number;
  declare graduation_year: number;
  declare batch_name: string;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare program?: NonAttribute<Program>;
  declare students?: NonAttribute<StudentProfile[]>;
}

Cohort.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    program_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Program, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    admission_year: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: { min: 1900, max: 9999 },
    },
    graduation_year: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: { min: 1900, max: 9999 },
    },
    batch_name: { type: DataTypes.STRING(100), allowNull: false },
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
    tableName: "cohorts",
    modelName: "Cohort",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    validate: {
      graduationFollowsAdmission() {
        if (this.graduation_year < this.admission_year) {
          throw new Error("graduation_year must be greater than or equal to admission_year");
        }
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["program_id", "admission_year"],
        name: "unique_cohort_program_admission_year",
      },
      { fields: ["program_id"], name: "idx_cohorts_program_id" },
      { fields: ["graduation_year"], name: "idx_cohorts_graduation_year" },
    ],
  }
);

Cohort.belongsTo(Program, { foreignKey: "program_id", as: "program" });
Program.hasMany(Cohort, {
  foreignKey: "program_id",
  as: "cohorts",
  onDelete: "RESTRICT",
});

export default Cohort;
