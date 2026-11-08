import { Attributes, CreationAttributes } from "sequelize";
import { CrudService, InvalidServiceInputError } from "../../services";
import Department from "../department.model";

export class DepartmentService extends CrudService<Department> {
  constructor() {
    super(Department);
  }

  async createDepartment(data: CreationAttributes<Department>): Promise<Department> {
    if (!data.institution_id || !data.name?.trim() || !data.code?.trim()) {
      throw new InvalidServiceInputError("institution_id, name, and code are required");
    }

    return this.create({ ...data, name: data.name.trim(), code: data.code.trim() });
  }

  findDepartmentById(departmentId: string): Promise<Department | null> {
    return this.findById(departmentId);
  }

  getDepartments(pagination = false, page = 1, limit = 20): Promise<Department[]> {
    return this.findAll({ pagination, page, limit });
  }

  updateDepartment(
    data: Partial<Attributes<Department>>,
    departmentId: string
  ): Promise<Department> {
    return this.updateById(departmentId, data);
  }

  deleteDepartment(departmentId: string): Promise<boolean> {
    return this.deleteById(departmentId);
  }
}

export default DepartmentService;
