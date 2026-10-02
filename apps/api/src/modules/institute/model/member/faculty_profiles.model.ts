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
import { Member } from "./members.model";
import { Department } from "../academic/department.model";

export class FacultyProfile extends Model<InferAttributes<FacultyProfile>, InferCreationAttributes<FacultyProfile>> {
    declare id: CreationOptional<string>;
    declare employee_number: string;
    declare designation: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Foreign Key
    declare department_id: ForeignKey<Department["id"]>;
    declare member_id: ForeignKey<Member["id"]>;

    // Non Attribute
    declare department?: NonAttribute<Department>;
    declare member?: NonAttribute<Member>;
}

FacultyProfile.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    employee_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
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
    tableName: "faculty_profiles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});