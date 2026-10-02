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

export class ProfessionalExperience extends Model<
    InferAttributes<ProfessionalExperience>,
    InferCreationAttributes<ProfessionalExperience>
> {
    declare id: CreationOptional<string>;
    declare member_id: ForeignKey<Member["id"]>;
    declare global_company_id: string | null;
    declare company_name: string;
    declare title: string;
    declare start_date: Date;
    declare end_date: Date | null;
    declare is_current: boolean;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    declare member?: NonAttribute<Member>;
}

ProfessionalExperience.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    global_company_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    is_current: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    tableName: "professional_experiences",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
