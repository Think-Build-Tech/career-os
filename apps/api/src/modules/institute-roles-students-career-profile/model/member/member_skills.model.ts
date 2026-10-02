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

export class MemberSkill extends Model<InferAttributes<MemberSkill>, InferCreationAttributes<MemberSkill>> {
    declare id: CreationOptional<string>;
    declare member_id: ForeignKey<Member["id"]>;
    declare global_skill_id: string | null;
    declare skill_name_snapshot: string;
    declare proficiency_level: string;
    declare verified: boolean;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    declare member?: NonAttribute<Member>;
}

MemberSkill.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    global_skill_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    skill_name_snapshot: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    proficiency_level: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    verified: {
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
    tableName: "member_skills",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
