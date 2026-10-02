import { BaseService } from "../../../core/base.service";
import { MentorshipGoals } from "../model/mentorship_goals.model";
import { MentorshipGoalsRepository } from "../repository/mentorship-goals.repository";

export class MentorshipGoalsService extends BaseService<MentorshipGoals> {
    constructor() {
        super(new MentorshipGoalsRepository());
    }
}
