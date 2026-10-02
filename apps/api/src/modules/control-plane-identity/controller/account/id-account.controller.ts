import { IdAccount } from "../../model/account/id_accounts.model";
import type { IdAccountCreatePayload, IdAccountUpdatePayload } from "@repo/types";
import { IdAccountService } from "../../service/account/id-account.service";
import { BaseController } from "../base.controller";

export class IdAccountController extends BaseController<IdAccount, IdAccountCreatePayload, IdAccountUpdatePayload> {
    constructor() {
        super(new IdAccountService());
    }
}
