import { Member } from "../member/members.model";
import { Project } from "../member/projects.model";

Member.hasMany(Project, {
    foreignKey: "member_id",
    as: "projects",
});

Project.belongsTo(Member, {
    foreignKey: "member_id",
    as: "member",
});
