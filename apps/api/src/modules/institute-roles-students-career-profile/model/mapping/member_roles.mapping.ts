import { Member } from "../member/members.model";
import { MemberRole } from "../access/member_roles.model";

Member.hasMany(MemberRole, {
    foreignKey: "member_id",
    as: "roles",
});

MemberRole.belongsTo(Member, {
    foreignKey: "member_id",
    as: "member",
});
