import { TenantDeployments } from "../../model/tenant/tenant_deployments.model";
import type { TenantDeploymentsCreatePayload, TenantDeploymentsUpdatePayload } from "@repo/types";
import { TenantDeploymentsService } from "../../service/tenant/tenant-deployments.service";
import { BaseController } from "../base.controller";

export class TenantDeploymentsController extends BaseController<TenantDeployments, TenantDeploymentsCreatePayload, TenantDeploymentsUpdatePayload> {
    constructor() {
        super(new TenantDeploymentsService());
    }
}
