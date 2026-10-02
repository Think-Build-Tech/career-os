import { Member } from "../member/members.model";
import { TpoProfile } from "../member/tpo_profiles.model";

Member.hasOne(TpoProfile, {
    foreignKey: "member_id",
    as: "tpo_profile",
});

TpoProfile.belongsTo(Member, {
    foreignKey: "member_id",
    as: "member",
});
