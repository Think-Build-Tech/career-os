import { IdAccount } from "../../model/account/id_accounts.model";
import { BaseRepository } from "../base.repository";

export class IdAccountRepository extends BaseRepository<IdAccount> {
    constructor() {
        super(IdAccount);
    }
}
