import { Batch } from "../academic/batches.model";
import { Department } from "../academic/department.model";
import { Member } from "../member/members.model";
import { Program } from "../academic/programs.model";
import { StudentProfile } from "../member/student_profiles.model";

Member.hasOne(StudentProfile, {
    foreignKey: "member_id",
    as: "student_profile",
});

StudentProfile.belongsTo(Member, {
    foreignKey: "member_id",
    as: "member",
});

Department.hasMany(StudentProfile, {
    foreignKey: "department_id",
    as: "student_profiles",
});

StudentProfile.belongsTo(Department, {
    foreignKey: "department_id",
    as: "department",
});

Program.hasMany(StudentProfile, {
    foreignKey: "program_id",
    as: "student_profiles",
});

StudentProfile.belongsTo(Program, {
    foreignKey: "program_id",
    as: "program",
});

Batch.hasMany(StudentProfile, {
    foreignKey: "batch_id",
    as: "student_profiles",
});

StudentProfile.belongsTo(Batch, {
    foreignKey: "batch_id",
    as: "batch",
});
