import { DataTypes, InitOptions, Sequelize } from "sequelize";

export const idAttribute = {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
} as const;

export const requiredUuid = (tableName: string, onDelete = "RESTRICT") => ({
  type: DataTypes.UUID,
  allowNull: false,
  references: { model: tableName, key: "id" },
  onUpdate: "CASCADE",
  onDelete,
});

export const optionalUuid = (tableName?: string, onDelete = "SET NULL") => ({
  type: DataTypes.UUID,
  allowNull: true,
  ...(tableName
    ? {
        references: { model: tableName, key: "id" },
        onUpdate: "CASCADE",
        onDelete,
      }
    : {}),
});

export const createdAtAttribute = {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW,
} as const;

export const updatedAtAttribute = {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW,
} as const;

export const jsonObjectAttribute = {
  type: DataTypes.JSONB,
  allowNull: false,
  defaultValue: {},
} as const;

export const jsonArrayAttribute = {
  type: DataTypes.JSONB,
  allowNull: false,
  defaultValue: [],
} as const;

export function modelOptions(
  sequelize: Sequelize,
  tableName: string,
  modelName: string,
  options: Partial<InitOptions<any>> = {}
): InitOptions<any> {
  return {
    sequelize,
    tableName,
    modelName,
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    ...options,
  };
}
