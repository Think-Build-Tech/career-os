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
import { FacultyProfile } from "../member/faculty_profiles.model";
import { Program } from "./programs.model";
import { StudentProfile } from "../member/student_profiles.model";

export class Department extends Model<InferAttributes<Department>, InferCreationAttributes<Department>> {
    declare id: CreationOptional<string>;
    declare code: string;
    declare name: string;
    declare parent_department_id: ForeignKey<Department["id"]> | null;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    declare parent_department?: NonAttribute<Department>;
    declare child_departments?: NonAttribute<Department[]>;
    declare faculty_profiles?: NonAttribute<FacultyProfile[]>;
    declare programs?: NonAttribute<Program[]>;
    declare student_profiles?: NonAttribute<StudentProfile[]>;
}

Department.init({
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
    parent_department_id: {
        type: DataTypes.UUID,
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
    tableName: "departments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
