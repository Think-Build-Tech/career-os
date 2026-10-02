import { BaseRepository } from "../../../core/base.repository";
import { InterviewExperienceRounds } from "../model/interview_experience_rounds.model";

export class InterviewExperienceRoundsRepository extends BaseRepository<InterviewExperienceRounds> {
    constructor() {
        super(InterviewExperienceRounds);
    }
}
