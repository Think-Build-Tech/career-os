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
import {
  createdAtAttribute,
  idAttribute,
  modelOptions,
  optionalUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";

export class AcademicEvent extends Model<
  InferAttributes<AcademicEvent>,
  InferCreationAttributes<AcademicEvent>
> {
  declare id: CreationOptional<string>;
  declare department_id: CreationOptional<ForeignKey<Department["id"]> | null>;
  declare program_id: CreationOptional<ForeignKey<Program["id"]> | null>;
  declare cohort_id: CreationOptional<ForeignKey<Cohort["id"]> | null>;
  declare event_type: string;
  declare title: string;
  declare description: CreationOptional<string | null>;
  declare starts_at: Date;
  declare ends_at: Date;
  declare location: CreationOptional<string | null>;
  declare is_mandatory: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare department?: NonAttribute<Department>;
  declare program?: NonAttribute<Program>;
  declare cohort?: NonAttribute<Cohort>;
}

AcademicEvent.init(
  {
    id: idAttribute,
    department_id: optionalUuid("departments", "SET NULL"),
    program_id: optionalUuid("programs", "SET NULL"),
    cohort_id: optionalUuid("cohorts", "SET NULL"),
    event_type: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: "EXAM",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    starts_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ends_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_mandatory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "academic_events", "AcademicEvent", {
    indexes: [
      { fields: ["department_id"] },
      { fields: ["program_id"] },
      { fields: ["cohort_id"] },
      { fields: ["event_type"] },
      { fields: ["starts_at", "ends_at"] },
    ],
  })
);

AcademicEvent.belongsTo(Department, { foreignKey: "department_id", as: "department" });
AcademicEvent.belongsTo(Program, { foreignKey: "program_id", as: "program" });
AcademicEvent.belongsTo(Cohort, { foreignKey: "cohort_id", as: "cohort" });

export default AcademicEvent;

