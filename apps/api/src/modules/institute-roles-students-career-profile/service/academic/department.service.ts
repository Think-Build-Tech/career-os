import { Department } from "../../model/academic/department.model";
import { DepartmentRepository } from "../../repository/academic/department.repository";
import { BaseService } from "../base.service";

export class DepartmentService extends BaseService<Department> {
    constructor() {
        super(new DepartmentRepository());
    }
}
