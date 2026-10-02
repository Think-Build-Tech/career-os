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
import { Batch } from "../academic/batches.model";
import { Department } from "../academic/department.model";
import { Member } from "./members.model";
import { Program } from "../academic/programs.model";

export class StudentProfile extends Model<InferAttributes<StudentProfile>, InferCreationAttributes<StudentProfile>> {
    declare id: CreationOptional<string>;
    declare member_id: ForeignKey<Member["id"]>;
    declare enrollment_number: string;
    declare department_id: ForeignKey<Department["id"]>;
    declare program_id: ForeignKey<Program["id"]>;
    declare batch_id: ForeignKey<Batch["id"]>;
    declare cgpa: number;
    declare active_backlogs: number;
    declare placement_eligible: boolean;
    declare placement_status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    declare member?: NonAttribute<Member>;
    declare department?: NonAttribute<Department>;
    declare program?: NonAttribute<Program>;
    declare batch?: NonAttribute<Batch>;
}

StudentProfile.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
    },
    enrollment_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    department_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    program_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    batch_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    cgpa: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
    },
    active_backlogs: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    placement_eligible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    placement_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "not_started",
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
    tableName: "student_profiles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
