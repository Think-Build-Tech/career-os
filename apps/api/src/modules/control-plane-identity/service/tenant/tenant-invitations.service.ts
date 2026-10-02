import { TenantInvitation } from "../../model/tenant/tenant_invitations.model";
import type { TenantInvitationCreatePayload, TenantInvitationUpdatePayload } from "@repo/types";
import { TenantInvitationRepository } from "../../repository/tenant/tenant-invitations.repository";
import { BaseService } from "../base.service";

export class TenantInvitationService extends BaseService<TenantInvitation, TenantInvitationCreatePayload, TenantInvitationUpdatePayload> {
    constructor() {
        super(new TenantInvitationRepository());
    }
}
