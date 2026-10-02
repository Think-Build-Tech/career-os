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
import { Department } from "./department.model";
import { Batch } from "./batches.model";
import { StudentProfile } from "../member/student_profiles.model";

export class Program extends Model<InferAttributes<Program>, InferCreationAttributes<Program>> {
    declare id: CreationOptional<string>;
    declare code: string;
    declare name: string;
    declare degree_type: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Foreign key
    declare department_id: ForeignKey<Department["id"]>;

    // Non Attribute
    declare department?: NonAttribute<Department>;
    declare batches?: NonAttribute<Batch[]>;
    declare student_profiles?: NonAttribute<StudentProfile[]>;
}

Program.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    degree_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department_id: {
        type: DataTypes.UUID,
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
    tableName: "programs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});