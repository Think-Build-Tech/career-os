import { BaseRepository } from "../../../core/base.repository";
import { InterviewExperiences } from "../model/interview_experiences.model";

export class InterviewExperiencesRepository extends BaseRepository<InterviewExperiences> {
    constructor() {
        super(InterviewExperiences);
    }
}
