import { BaseService } from "../../../core/base.service";
import { RecruitmentRounds } from "../model/recruitment_rounds.model";
import { RecruitmentRoundsRepository } from "../repository/recruitment-rounds.repository";

export class RecruitmentRoundsService extends BaseService<RecruitmentRounds> {
    constructor() {
        super(new RecruitmentRoundsRepository());
    }
}
