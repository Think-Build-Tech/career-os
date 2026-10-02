import { ExternalIdentity } from "../../model/account/external_identities.model";
import type { ExternalIdentityCreatePayload, ExternalIdentityUpdatePayload } from "@repo/types";
import { ExternalIdentityService } from "../../service/account/external-identity.service";
import { BaseController } from "../base.controller";

export class ExternalIdentityController extends BaseController<ExternalIdentity, ExternalIdentityCreatePayload, ExternalIdentityUpdatePayload> {
    constructor() {
        super(new ExternalIdentityService());
    }
}
