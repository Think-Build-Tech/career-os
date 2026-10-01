import { TenantInvitation } from "../../model/tenant/tenant_invitations.model";
import type { TenantInvitationCreatePayload, TenantInvitationUpdatePayload } from "@repo/types";
import { TenantInvitationService } from "../../service/tenant/tenant-invitations.service";
import { BaseController } from "../base.controller";

export class TenantInvitationController extends BaseController<TenantInvitation, TenantInvitationCreatePayload, TenantInvitationUpdatePayload> {
    constructor() {
        super(new TenantInvitationService());
    }
}
