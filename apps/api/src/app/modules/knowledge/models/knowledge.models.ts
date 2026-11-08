import "pgvector/sequelize";
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

export class KnowledgeDocument extends Model<
  InferAttributes<KnowledgeDocument>,
  InferCreationAttributes<KnowledgeDocument>
> {
  declare id: CreationOptional<string>;
  declare source_type: string;
  declare source_id: string;
  declare source_version_id: CreationOptional<string | null>;
  declare title: string;
  declare content_hash: string;
  declare visibility_scope_type: string;
  declare visibility_scope_id: CreationOptional<string | null>;
  declare owner_user_id: CreationOptional<string | null>;
  declare department_id: CreationOptional<string | null>;
  declare program_id: CreationOptional<string | null>;
  declare cohort_id: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class KnowledgeChunk extends Model<
  InferAttributes<KnowledgeChunk>,
  InferCreationAttributes<KnowledgeChunk>
> {
  declare id: CreationOptional<string>;
  declare knowledge_document_id: ForeignKey<KnowledgeDocument["id"]>;
  declare chunk_index: number;
  declare content: string;
  declare token_count: CreationOptional<number | null>;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
}

export class KnowledgeEmbedding extends Model<
  InferAttributes<KnowledgeEmbedding>,
  InferCreationAttributes<KnowledgeEmbedding>
> {
  declare id: CreationOptional<string>;
  declare chunk_id: ForeignKey<KnowledgeChunk["id"]>;
  declare embedding_model: string;
  declare embedding_model_version: string;
  declare embedding_dimension: number;
  declare embedding: number[];
  declare created_at: CreationOptional<Date>;
}

export class KnowledgeIngestionJob extends Model<
  InferAttributes<KnowledgeIngestionJob>,
  InferCreationAttributes<KnowledgeIngestionJob>
> {
  declare id: CreationOptional<string>;
  declare knowledge_document_id: ForeignKey<KnowledgeDocument["id"]>;
  declare status: CreationOptional<string>;
  declare attempts: CreationOptional<number>;
  declare error_details: CreationOptional<Record<string, unknown> | null>;
  declare started_at: CreationOptional<Date | null>;
  declare completed_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

KnowledgeDocument.init(
  {
    id: idAttribute,
    source_type: { type: DataTypes.STRING(40), allowNull: false },
    source_id: { type: DataTypes.UUID, allowNull: false },
    source_version_id: optionalUuid(),
    title: { type: DataTypes.STRING, allowNull: false },
    content_hash: { type: DataTypes.STRING(128), allowNull: false },
    visibility_scope_type: { type: DataTypes.STRING(32), allowNull: false },
    visibility_scope_id: optionalUuid(),
    owner_user_id: optionalUuid("users"),
    department_id: optionalUuid("departments"),
    program_id: optionalUuid("programs"),
    cohort_id: optionalUuid("cohorts"),
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "PENDING" },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "knowledge_documents", "KnowledgeDocument", {
    indexes: [
      { unique: true, fields: ["source_type", "source_id", "source_version_id"] },
      { fields: ["source_type", "source_id"] },
      { fields: ["department_id"] },
      { fields: ["program_id"] },
      { fields: ["cohort_id"] },
      { fields: ["visibility_scope_type", "visibility_scope_id"] },
    ],
  })
);

KnowledgeChunk.init(
  {
    id: idAttribute,
    knowledge_document_id: requiredUuid("knowledge_documents", "CASCADE"),
    chunk_index: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
    content: { type: DataTypes.TEXT, allowNull: false },
    token_count: { type: DataTypes.INTEGER, allowNull: true },
    metadata: jsonObjectAttribute,
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "knowledge_chunks", "KnowledgeChunk", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { unique: true, fields: ["knowledge_document_id", "chunk_index"] },
      { fields: ["knowledge_document_id"] },
    ],
  })
);

KnowledgeEmbedding.init(
  {
    id: idAttribute,
    chunk_id: requiredUuid("knowledge_chunks", "CASCADE"),
    embedding_model: { type: DataTypes.STRING(120), allowNull: false },
    embedding_model_version: { type: DataTypes.STRING(120), allowNull: false },
    embedding_dimension: { type: DataTypes.INTEGER, allowNull: false },
    // Dimension is stored alongside the value so multiple embedding models can coexist.
    embedding: { type: DataTypes.VECTOR(), allowNull: false },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "knowledge_embeddings", "KnowledgeEmbedding", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { unique: true, fields: ["chunk_id", "embedding_model", "embedding_model_version"] },
    ],
  })
);

KnowledgeIngestionJob.init(
  {
    id: idAttribute,
    knowledge_document_id: requiredUuid("knowledge_documents", "CASCADE"),
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "QUEUED" },
    attempts: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
    error_details: { type: DataTypes.JSONB, allowNull: true },
    started_at: { type: DataTypes.DATE, allowNull: true },
    completed_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "knowledge_ingestion_jobs", "KnowledgeIngestionJob", {
    indexes: [{ fields: ["status", "created_at"] }, { fields: ["knowledge_document_id"] }],
  })
);

KnowledgeDocument.hasMany(KnowledgeChunk, { foreignKey: "knowledge_document_id", as: "chunks" });
KnowledgeChunk.belongsTo(KnowledgeDocument, { foreignKey: "knowledge_document_id", as: "document" });
KnowledgeChunk.hasMany(KnowledgeEmbedding, { foreignKey: "chunk_id", as: "embeddings" });
KnowledgeEmbedding.belongsTo(KnowledgeChunk, { foreignKey: "chunk_id", as: "chunk" });
KnowledgeDocument.hasMany(KnowledgeIngestionJob, { foreignKey: "knowledge_document_id", as: "ingestion_jobs" });

export default {
  KnowledgeDocument,
  KnowledgeChunk,
  KnowledgeEmbedding,
  KnowledgeIngestionJob,
};
