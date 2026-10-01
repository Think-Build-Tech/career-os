import { TenantInvitation } from "../../model/tenant/tenant_invitations.model";
import { BaseRepository } from "../base.repository";

export class TenantInvitationRepository extends BaseRepository<TenantInvitation> {
    constructor() {
        super(TenantInvitation);
    }
}
