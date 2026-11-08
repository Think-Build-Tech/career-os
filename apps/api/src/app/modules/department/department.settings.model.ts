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
import { Department } from "./department.model";

export class DepartmentSettings extends Model<
  InferAttributes<DepartmentSettings>,
  InferCreationAttributes<DepartmentSettings>
> {
  declare id: CreationOptional<string>;
  declare department_id: ForeignKey<Department["id"]>;
  declare student_registration_enabled: CreationOptional<boolean>;
  declare resume_approval_required: CreationOptional<boolean>;
  declare job_submission_enabled: CreationOptional<boolean>;
  declare alumni_chat_enabled: CreationOptional<boolean>;
  declare reward_system_enabled: CreationOptional<boolean>;
  declare minimum_profile_completion: CreationOptional<number>;
  declare settings: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare department?: NonAttribute<Department>;
}

DepartmentSettings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: Department, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    student_registration_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    resume_approval_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    job_submission_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    alumni_chat_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    reward_system_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    minimum_profile_completion: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 80,
      validate: { min: 0, max: 100 },
    },
    settings: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
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
    tableName: "department_settings",
    modelName: "DepartmentSettings",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["department_id"],
        name: "unique_department_settings_department_id",
      },
    ],
  }
);

DepartmentSettings.belongsTo(Department, { foreignKey: "department_id", as: "department" });
Department.hasOne(DepartmentSettings, {
  foreignKey: "department_id",
  as: "settings",
  onDelete: "CASCADE",
});

export default DepartmentSettings;
