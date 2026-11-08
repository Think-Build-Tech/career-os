// Import/export order follows foreign-key dependencies so every tenant model is
// initialized before models that associate with it.
export * from "../institution/institution.model";
export * from "../user/user.model";
export * from "../department/department.model";
export * from "../department/department.settings.model";
export * from "../program/program.model";
export * from "../cohort/cohort.model";
export * from "../student/models";
export * from "../academic/models";
export * from "../skill/models";
export * from "../project/models";
export * from "../resume/models";
export * from "../reputation/models";
export * from "../reward/models";
export * from "../identity/models";
export * from "../company/models";
export * from "../placement/models";
export * from "../alumni/models";
export * from "../knowledge/models";
export * from "../tacie/models";
export * from "../chat/models";
export * from "../moderation/models";
export * from "../assessment/models";
export * from "../learning/models";
export * from "../notification/models";
export * from "../integration/models";
export * from "../audit/models";

import "./tenant-associations";
