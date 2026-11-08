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
import { Resume } from "./resume.model";

export class ResumeVersion extends Model<
  InferAttributes<ResumeVersion>,
  InferCreationAttributes<ResumeVersion>
> {
  declare id: CreationOptional<string>;
  declare resume_id: ForeignKey<Resume["id"]>;
  declare file_object_key: string;
  declare parsed_text: CreationOptional<string | null>;
  declare parsed_data: CreationOptional<Record<string, unknown> | null>;
  declare content_hash: string;
  declare version_number: number;
  declare created_at: CreationOptional<Date>;

  declare resume?: NonAttribute<Resume>;
}

ResumeVersion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    resume_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Resume, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    file_object_key: { type: DataTypes.STRING(2048), allowNull: false },
    parsed_text: { type: DataTypes.TEXT, allowNull: true },
    parsed_data: { type: DataTypes.JSONB, allowNull: true },
    content_hash: { type: DataTypes.STRING(128), allowNull: false },
    version_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "resume_versions",
    modelName: "ResumeVersion",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["resume_id", "version_number"],
        name: "unique_resume_version_number",
      },
      { fields: ["resume_id"], name: "idx_resume_versions_resume_id" },
      { fields: ["content_hash"], name: "idx_resume_versions_content_hash" },
    ],
  }
);

ResumeVersion.belongsTo(Resume, { foreignKey: "resume_id", as: "resume" });
Resume.hasMany(ResumeVersion, {
  foreignKey: "resume_id",
  as: "versions",
  onDelete: "RESTRICT",
});

export default ResumeVersion;
