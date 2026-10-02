import { BaseRepository } from "../../../core/base.repository";
import { MentorshipGoals } from "../model/mentorship_goals.model";

export class MentorshipGoalsRepository extends BaseRepository<MentorshipGoals> {
    constructor() {
        super(MentorshipGoals);
    }
}
