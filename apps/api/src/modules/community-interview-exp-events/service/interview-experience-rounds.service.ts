import { BaseService } from "../../../core/base.service";
import { InterviewExperienceRounds } from "../model/interview_experience_rounds.model";
import { InterviewExperienceRoundsRepository } from "../repository/interview-experience-rounds.repository";

export class InterviewExperienceRoundsService extends BaseService<InterviewExperienceRounds> {
    constructor() {
        super(new InterviewExperienceRoundsRepository());
    }
}
