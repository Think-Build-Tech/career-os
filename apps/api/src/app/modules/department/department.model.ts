import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from "sequelize";
import { sequelize } from "../../config/database";
import { Institution } from "../institution/institution.model";
import type { StudentProfile } from "../student/models/student.model";
import type { DepartmentSettings } from "./department.settings.model";
import type { Program } from "../program/program.model";

export class Department extends Model<
  InferAttributes<Department>,
  InferCreationAttributes<Department>
> {
  declare id: CreationOptional<string>;
  declare institution_id: ForeignKey<Institution["id"]>;
  declare department_head_user_id: CreationOptional<string | null>;
  declare name: string;
  declare code: string;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare institution?: NonAttribute<Institution>;
  declare settings?: NonAttribute<DepartmentSettings>;
  declare programs?: NonAttribute<Program[]>;
  declare students?: NonAttribute<StudentProfile[]>;
}


Department.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    institution_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Institution,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    department_head_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ACTIVE",
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
    tableName: "departments",
    modelName: "Department",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["institution_id", "code"],
        name: "unique_department_institution_code",
      },
    ],
  }
);

Institution.hasMany(Department, {
  foreignKey: "institution_id",
  as: "departments",
  onDelete: "CASCADE",
  hooks: true,
});

Department.belongsTo(Institution, {
  foreignKey: "institution_id",
  as: "institution",
  onDelete: "CASCADE",
});

export default Department;
