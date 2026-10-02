import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import sequelize from "../../../../config/database";
import { Program } from "./programs.model";
import { StudentProfile } from "../member/student_profiles.model";

export class Batch extends Model<InferAttributes<Batch>, InferCreationAttributes<Batch>> {
    declare id: CreationOptional<string>;
    declare program_id: ForeignKey<Program["id"]>;
    declare name: string;
    declare start_year: number;
    declare graduation_year: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    declare program?: NonAttribute<Program>;
    declare student_profiles?: NonAttribute<StudentProfile[]>;
}

Batch.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    program_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    graduation_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    tableName: "batches",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
