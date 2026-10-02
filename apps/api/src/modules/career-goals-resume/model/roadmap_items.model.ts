import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class RoadmapItems extends Model<InferAttributes<RoadmapItems>, InferCreationAttributes<RoadmapItems>> {
    declare id: CreationOptional<string>;
    declare roadmap_id: string;
    declare parent_item_id: string;
    declare global_skill_id: string;
    declare title: string;
    declare sequence_no: number;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

RoadmapItems.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    roadmap_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    parent_item_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    global_skill_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sequence_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
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
}, {
    sequelize,
    tableName: "roadmap_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
