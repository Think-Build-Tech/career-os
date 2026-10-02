import { AlumniProfile } from "../member/alumni_profiles.model";
import { Member } from "../member/members.model";

Member.hasOne(AlumniProfile, {
    foreignKey: "member_id",
    as: "alumni_profile",
});

AlumniProfile.belongsTo(Member, {
    foreignKey: "member_id",
    as: "member",
});
