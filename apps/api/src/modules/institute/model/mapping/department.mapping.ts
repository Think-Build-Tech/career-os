import { Department } from "../academic/department.model";

Department.hasMany(Department, {
    foreignKey: "parent_department_id",
    as: "child_departments",
});

Department.belongsTo(Department, {
    foreignKey: "parent_department_id",
    as: "parent_department",
});
