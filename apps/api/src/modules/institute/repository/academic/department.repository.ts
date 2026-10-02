import { Department } from "../../model/academic/department.model";
import { BaseRepository } from "../base.repository";

export class DepartmentRepository extends BaseRepository<Department> {
    constructor() {
        super(Department);
    }
}
