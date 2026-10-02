import { TenantAuthProvider } from "../../model/tenant/tenant_auth_provider.model";
import type { TenantAuthProviderCreatePayload, TenantAuthProviderUpdatePayload } from "@repo/types";
import { TenantAuthProviderService } from "../../service/tenant/tenant-auth-provider.service";
import { BaseController } from "../base.controller";

export class TenantAuthProviderController extends BaseController<TenantAuthProvider, TenantAuthProviderCreatePayload, TenantAuthProviderUpdatePayload> {
    constructor() {
        super(new TenantAuthProviderService());
    }
}
