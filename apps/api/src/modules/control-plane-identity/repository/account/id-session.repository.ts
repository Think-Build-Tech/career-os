import { IdSession } from "../../model/account/id_sessions.model";
import { BaseRepository } from "../base.repository";

export class IdSessionRepository extends BaseRepository<IdSession> {
    constructor() {
        super(IdSession);
    }
}
