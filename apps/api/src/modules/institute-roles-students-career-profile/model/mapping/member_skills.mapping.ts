import { MemberSkill } from "../member/member_skills.model";
import { Member } from "../member/members.model";

Member.hasMany(MemberSkill, {
    foreignKey: "member_id",
    as: "skills",
});

MemberSkill.belongsTo(Member, {
    foreignKey: "member_id",
    as: "member",
});
