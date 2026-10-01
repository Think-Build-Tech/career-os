import { TenantDeployments } from "../../model/tenant/tenant_deployments.model";
import { BaseRepository } from "../base.repository";

export class TenantDeploymentsRepository extends BaseRepository<TenantDeployments> {
    constructor() {
        super(TenantDeployments);
    }
}
