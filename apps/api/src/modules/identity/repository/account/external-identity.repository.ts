import { ExternalIdentity } from "../../model/account/external_identities.model";
import { BaseRepository } from "../base.repository";

export class ExternalIdentityRepository extends BaseRepository<ExternalIdentity> {
    constructor() {
        super(ExternalIdentity);
    }
}
