import { BaseRepository } from "../../../core/base.repository";
import { RecruitmentRounds } from "../model/recruitment_rounds.model";

export class RecruitmentRoundsRepository extends BaseRepository<RecruitmentRounds> {
    constructor() {
        super(RecruitmentRounds);
    }
}
