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
import Department from "../department/department.model";
import type { Cohort } from "../cohort/cohort.model";
import type { StudentProfile } from "../student/models/student.model";

export class Program extends Model<
  InferAttributes<Program>,
  InferCreationAttributes<Program>
> {
  declare id: CreationOptional<string>;
  declare department_id: ForeignKey<Department["id"]>;
  declare name: string;
  declare code: string;
  declare degree_type: string;
  declare duration_years: number;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare department?: NonAttribute<Department>;
  declare cohorts?: NonAttribute<Cohort[]>;
  declare students?: NonAttribute<StudentProfile[]>;
}

Program.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Department, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING(64), allowNull: false },
    degree_type: { type: DataTypes.STRING(64), allowNull: false },
    duration_years: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: { min: 1 },
    },
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
    tableName: "programs",
    modelName: "Program",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["department_id", "code"],
        name: "unique_program_department_code",
      },
      { fields: ["department_id"], name: "idx_programs_department_id" },
    ],
  }
);

Program.belongsTo(Department, { foreignKey: "department_id", as: "department" });
Department.hasMany(Program, {
  foreignKey: "department_id",
  as: "programs",
  onDelete: "RESTRICT",
});

export default Program;
