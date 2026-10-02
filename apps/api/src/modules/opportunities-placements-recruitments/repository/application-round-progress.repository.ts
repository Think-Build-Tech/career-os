import { BaseRepository } from "../../../core/base.repository";
import { ApplicationRoundProgress } from "../model/application_round_progress.model";

export class ApplicationRoundProgressRepository extends BaseRepository<ApplicationRoundProgress> {
    constructor() {
        super(ApplicationRoundProgress);
    }
}
