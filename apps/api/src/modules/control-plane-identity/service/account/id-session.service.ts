import { IdSession } from "../../model/account/id_sessions.model";
import type { IdSessionCreatePayload, IdSessionUpdatePayload } from "@repo/types";
import { IdSessionRepository } from "../../repository/account/id-session.repository";
import { BaseService } from "../base.service";

export class IdSessionService extends BaseService<IdSession, IdSessionCreatePayload, IdSessionUpdatePayload> {
    constructor() {
        super(new IdSessionRepository());
    }
}
