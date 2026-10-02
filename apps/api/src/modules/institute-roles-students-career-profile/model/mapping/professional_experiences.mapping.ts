import { Member } from "../member/members.model";
import { ProfessionalExperience } from "../member/professional_experiences.model";

Member.hasMany(ProfessionalExperience, {
    foreignKey: "member_id",
    as: "professional_experiences",
});

ProfessionalExperience.belongsTo(Member, {
    foreignKey: "member_id",
    as: "member",
});
