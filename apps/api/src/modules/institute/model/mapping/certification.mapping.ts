import { Certification } from "../member/certification.model";
import { Member } from "../member/members.model";

Member.hasMany(Certification, {
    foreignKey: "member_id",
    as: "certifications",
});

Certification.belongsTo(Member, {
    foreignKey: "member_id",
    as: "member",
});
