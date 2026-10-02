import { BaseService } from "../../../core/base.service";
import { ApplicationRoundProgress } from "../model/application_round_progress.model";
import { ApplicationRoundProgressRepository } from "../repository/application-round-progress.repository";

export class ApplicationRoundProgressService extends BaseService<ApplicationRoundProgress> {
    constructor() {
        super(new ApplicationRoundProgressRepository());
    }
}
