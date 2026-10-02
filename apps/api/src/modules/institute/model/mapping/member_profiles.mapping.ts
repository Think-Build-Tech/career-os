import { MemberProfile } from "../member/member_profiles.model";
import { Member } from "../member/members.model";

Member.hasOne(MemberProfile, {
    foreignKey: "member_id",
    as: "profile",
});

MemberProfile.belongsTo(Member, {
    foreignKey: "member_id",
    as: "member",
});
