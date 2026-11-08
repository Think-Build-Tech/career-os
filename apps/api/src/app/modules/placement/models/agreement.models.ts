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
import {
  createdAtAttribute,
  idAttribute,
  jsonObjectAttribute,
  modelOptions,
  optionalUuid,
  requiredUuid,
} from "../../models/model.helpers";
import type { StudentProfile } from "../../student/models/student.model";
import { User } from "../../user/user.model";

export class UserAgreement extends Model<
  InferAttributes<UserAgreement>,
  InferCreationAttributes<UserAgreement>
> {
  declare id: CreationOptional<string>;
  declare user_id: ForeignKey<User["id"]>;
  declare student_id: CreationOptional<ForeignKey<StudentProfile["id"]> | null>;
  declare agreement_type: string;
  declare agreement_version: string;
  declare document_name: string;
  declare document_hash: string;
  declare document_object_key: CreationOptional<string | null>;
  declare accepted_at: Date;
  declare ip_address: CreationOptional<string | null>;
  declare user_agent: CreationOptional<string | null>;
  declare signature_data: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;

  declare user?: NonAttribute<User>;
  declare student?: NonAttribute<StudentProfile>;
}

export class ArtifactAttestation extends Model<
  InferAttributes<ArtifactAttestation>,
  InferCreationAttributes<ArtifactAttestation>
> {
  declare id: CreationOptional<string>;
  declare artifact_type: string;
  declare artifact_id: string;
  declare hash_algorithm: CreationOptional<string>;
  declare artifact_hash: string;
  declare signature: string;
  declare signer_user_id: CreationOptional<ForeignKey<User["id"]> | null>;
  declare signer_public_key_fingerprint: CreationOptional<string | null>;
  declare attested_at: Date;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;

  declare signer?: NonAttribute<User>;
}

UserAgreement.init(
  {
    id: idAttribute,
    user_id: requiredUuid("users", "CASCADE"),
    student_id: optionalUuid("student_profiles", "SET NULL"),
    agreement_type: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    agreement_version: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "1.0",
    },
    document_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    document_hash: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    document_object_key: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    accepted_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ip_address: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    signature_data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "user_agreements", "UserAgreement", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["student_id"] },
      { fields: ["agreement_type", "agreement_version"] },
      { fields: ["accepted_at"] },
    ],
  })
);

ArtifactAttestation.init(
  {
    id: idAttribute,
    artifact_type: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    artifact_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    hash_algorithm: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "SHA-256",
    },
    artifact_hash: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    signature: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    signer_user_id: optionalUuid("users", "SET NULL"),
    signer_public_key_fingerprint: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    attested_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    metadata: jsonObjectAttribute,
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "artifact_attestations", "ArtifactAttestation", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["artifact_type", "artifact_id"] },
      { fields: ["artifact_hash"] },
      { fields: ["signer_user_id"] },
      { fields: ["attested_at"] },
    ],
  })
);

export default {
  UserAgreement,
  ArtifactAttestation,
};
