import { Attributes, CreationAttributes } from "sequelize";
import { CrudService, InvalidServiceInputError } from "../../services";
import Institution from "../institution.model";

export class InstitutionService extends CrudService<Institution> {
  constructor() {
    super(Institution);
  }

  async createInstitution(data: CreationAttributes<Institution>): Promise<Institution> {
    if (!data.external_tenant_id?.trim() || !data.name?.trim() || !data.code?.trim()) {
      throw new InvalidServiceInputError("external_tenant_id, name, and code are required");
    }

    return this.create({
      ...data,
      external_tenant_id: data.external_tenant_id.trim(),
      name: data.name.trim(),
      code: data.code.trim(),
      university_name: data.university_name?.trim() || null,
    });
  }

  getInstitutionById(institutionId: string): Promise<Institution | null> {
    return this.findById(institutionId);
  }

  getAllInstitutions(pagination = false, page = 1, limit = 10): Promise<Institution[]> {
    return this.findAll({ pagination, page, limit });
  }

  updateInstitutions(
    data: Partial<Attributes<Institution>>,
    institutionId: string
  ): Promise<Institution> {
    return this.updateById(institutionId, data);
  }

  deleteInstitute(institutionId: string): Promise<boolean> {
    return this.deleteById(institutionId);
  }
}

export default InstitutionService;
