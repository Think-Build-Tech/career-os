import { TenantDeployments } from "../../model/tenant/tenant_deployments.model";
import type { TenantDeploymentsCreatePayload, TenantDeploymentsUpdatePayload } from "@repo/types";
import { TenantDeploymentsRepository } from "../../repository/tenant/tenant-deployments.repository";
import { BaseService } from "../base.service";

export class TenantDeploymentsService extends BaseService<TenantDeployments, TenantDeploymentsCreatePayload, TenantDeploymentsUpdatePayload> {
    constructor() {
        super(new TenantDeploymentsRepository());
    }
}
