import { ExternalIdentity } from "../../model/account/external_identities.model";
import type { ExternalIdentityCreatePayload, ExternalIdentityUpdatePayload } from "@repo/types";
import { ExternalIdentityRepository } from "../../repository/account/external-identity.repository";
import { BaseService } from "../base.service";

export class ExternalIdentityService extends BaseService<ExternalIdentity, ExternalIdentityCreatePayload, ExternalIdentityUpdatePayload> {
    constructor() {
        super(new ExternalIdentityRepository());
    }
}
