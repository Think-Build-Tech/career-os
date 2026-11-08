import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../../../config/database";
import {
  createdAtAttribute,
  idAttribute,
  jsonObjectAttribute,
  modelOptions,
  optionalUuid,
  requiredUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";

export class IntegrationConnection extends Model<
  InferAttributes<IntegrationConnection>,
  InferCreationAttributes<IntegrationConnection>
> {
  declare id: CreationOptional<string>;
  declare integration_type: string;
  declare name: string;
  declare secret_reference: CreationOptional<string | null>;
  declare configuration: CreationOptional<Record<string, unknown>>;
  declare status: CreationOptional<string>;
  declare last_synced_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class SyncJob extends Model<InferAttributes<SyncJob>, InferCreationAttributes<SyncJob>> {
  declare id: CreationOptional<string>;
  declare integration_connection_id: ForeignKey<IntegrationConnection["id"]>;
  declare job_type: string;
  declare status: CreationOptional<string>;
  declare cursor: CreationOptional<Record<string, unknown>>;
  declare records_processed: CreationOptional<number>;
  declare records_failed: CreationOptional<number>;
  declare error_details: CreationOptional<Record<string, unknown> | null>;
  declare started_at: CreationOptional<Date | null>;
  declare completed_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class ExternalIdMapping extends Model<
  InferAttributes<ExternalIdMapping>,
  InferCreationAttributes<ExternalIdMapping>
> {
  declare id: CreationOptional<string>;
  declare integration_connection_id: ForeignKey<IntegrationConnection["id"]>;
  declare entity_type: string;
  declare entity_id: string;
  declare external_id: string;
  declare external_data: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

IntegrationConnection.init(
  {
    id: idAttribute,
    integration_type: { type: DataTypes.STRING(32), allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    secret_reference: { type: DataTypes.STRING, allowNull: true },
    configuration: jsonObjectAttribute,
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
    last_synced_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "integration_connections", "IntegrationConnection", {
    indexes: [{ fields: ["integration_type", "status"] }],
  })
);

SyncJob.init(
  {
    id: idAttribute,
    integration_connection_id: requiredUuid("integration_connections", "CASCADE"),
    job_type: { type: DataTypes.STRING(64), allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "QUEUED" },
    cursor: jsonObjectAttribute,
    records_processed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    records_failed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    error_details: { type: DataTypes.JSONB, allowNull: true },
    started_at: { type: DataTypes.DATE, allowNull: true },
    completed_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "sync_jobs", "SyncJob", {
    indexes: [{ fields: ["integration_connection_id", "status"] }, { fields: ["created_at"] }],
  })
);

ExternalIdMapping.init(
  {
    id: idAttribute,
    integration_connection_id: requiredUuid("integration_connections", "CASCADE"),
    entity_type: { type: DataTypes.STRING(64), allowNull: false },
    entity_id: { type: DataTypes.UUID, allowNull: false },
    external_id: { type: DataTypes.STRING, allowNull: false },
    external_data: jsonObjectAttribute,
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "external_id_mappings", "ExternalIdMapping", {
    indexes: [
      { unique: true, fields: ["integration_connection_id", "entity_type", "external_id"] },
      { unique: true, fields: ["integration_connection_id", "entity_type", "entity_id"] },
    ],
  })
);

IntegrationConnection.hasMany(SyncJob, { foreignKey: "integration_connection_id", as: "sync_jobs" });
IntegrationConnection.hasMany(ExternalIdMapping, { foreignKey: "integration_connection_id", as: "external_id_mappings" });

export default { IntegrationConnection, SyncJob, ExternalIdMapping };
