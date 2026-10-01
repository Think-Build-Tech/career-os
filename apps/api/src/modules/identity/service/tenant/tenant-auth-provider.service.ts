import { TenantAuthProvider } from "../../model/tenant/tenant_auth_provider.model";
import type { TenantAuthProviderCreatePayload, TenantAuthProviderUpdatePayload } from "@repo/types";
import { TenantAuthProviderRepository } from "../../repository/tenant/tenant-auth-provider.repository";
import { BaseService } from "../base.service";

export class TenantAuthProviderService extends BaseService<TenantAuthProvider, TenantAuthProviderCreatePayload, TenantAuthProviderUpdatePayload> {
    constructor() {
        super(new TenantAuthProviderRepository());
    }
}
