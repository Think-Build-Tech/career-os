import { TenantAuthProvider } from "../../model/tenant/tenant_auth_provider.model";
import { BaseRepository } from "../base.repository";

export class TenantAuthProviderRepository extends BaseRepository<TenantAuthProvider> {
    constructor() {
        super(TenantAuthProvider);
    }
}
