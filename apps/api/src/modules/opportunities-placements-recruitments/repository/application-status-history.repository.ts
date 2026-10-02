import { BaseRepository } from "../../../core/base.repository";
import { ApplicationStatusHistory } from "../model/application_status_history.model";

export class ApplicationStatusHistoryRepository extends BaseRepository<ApplicationStatusHistory> {
    constructor() {
        super(ApplicationStatusHistory);
    }
}
