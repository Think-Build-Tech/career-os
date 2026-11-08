import { CreateReadService, MutationOptions } from "../../services";
import { AuditLog, DataAccessAudit } from "../models";

export class AuditLogService extends CreateReadService<AuditLog> {
  constructor() { super(AuditLog); }
}

export class DataAccessAuditService extends CreateReadService<DataAccessAudit> {
  constructor() { super(DataAccessAudit); }

  async logAccess(
    data: {
      actor_user_id: string;
      resource_owner_id: string;
      organization_id?: string | null;
      resource_type: string;
      resource_id: string;
      resource_version?: string | null;
      access_type: string;
      authorization_basis: string;
      purpose?: string | null;
      ip_address?: string | null;
      user_agent?: string | null;
    },
    options: MutationOptions = {}
  ): Promise<DataAccessAudit> {
    return this.model.create(
      {
        ...data,
        accessed_at: new Date(),
      },
      { transaction: options.transaction }
    );
  }

  async getAccessLogForStudent(
    student_id: string,
    resource_type?: string
  ): Promise<DataAccessAudit[]> {
    const where: Record<string, unknown> = { resource_owner_id: student_id };
    if (resource_type) {
      where.resource_type = resource_type;
    }
    return this.model.findAll({
      where,
      order: [["accessed_at", "DESC"]],
    });
  }
}

export default { AuditLogService, DataAccessAuditService };

