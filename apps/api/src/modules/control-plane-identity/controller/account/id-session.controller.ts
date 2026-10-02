import { IdSession } from "../../model/account/id_sessions.model";
import type { IdSessionCreatePayload, IdSessionUpdatePayload } from "@repo/types";
import { IdSessionService } from "../../service/account/id-session.service";
import { BaseController } from "../base.controller";

export class IdSessionController extends BaseController<IdSession, IdSessionCreatePayload, IdSessionUpdatePayload> {
    constructor() {
        super(new IdSessionService());
    }
}
