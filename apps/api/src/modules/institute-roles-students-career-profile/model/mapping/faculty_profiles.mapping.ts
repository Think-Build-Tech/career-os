import { Department } from "../academic/department.model";
import { FacultyProfile } from "../member/faculty_profiles.model";
import { Member } from "../member/members.model";

Member.hasOne(FacultyProfile, {
    foreignKey: "member_id",
    as: "faculty_profile",
});

FacultyProfile.belongsTo(Member, {
    foreignKey: "member_id",
    as: "member",
});

Department.hasMany(FacultyProfile, {
    foreignKey: "department_id",
    as: "faculty_profiles",
});

FacultyProfile.belongsTo(Department, {
    foreignKey: "department_id",
    as: "department",
});
