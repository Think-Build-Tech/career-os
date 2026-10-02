import { BaseService } from "../../../core/base.service";
import { ApplicationStatusHistory } from "../model/application_status_history.model";
import { ApplicationStatusHistoryRepository } from "../repository/application-status-history.repository";

export class ApplicationStatusHistoryService extends BaseService<ApplicationStatusHistory> {
    constructor() {
        super(new ApplicationStatusHistoryRepository());
    }
}
