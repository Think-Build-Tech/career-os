import { Department } from "../academic/department.model";
import { Program } from "../academic/programs.model";

Department.hasMany(Program, {
    foreignKey: "department_id",
    as: "programs",
});

Program.belongsTo(Department, {
    foreignKey: "department_id",
    as: "department",
});
