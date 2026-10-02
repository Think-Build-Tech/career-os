import { IdAccount } from "../../model/account/id_accounts.model";
import type { IdAccountCreatePayload, IdAccountUpdatePayload } from "@repo/types";
import { IdAccountRepository } from "../../repository/account/id-account.repository";
import { BaseService } from "../base.service";

export class IdAccountService extends BaseService<IdAccount, IdAccountCreatePayload, IdAccountUpdatePayload> {
    constructor() {
        super(new IdAccountRepository());
    }
}
