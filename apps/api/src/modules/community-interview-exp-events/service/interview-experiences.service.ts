import { BaseService } from "../../../core/base.service";
import { InterviewExperiences } from "../model/interview_experiences.model";
import { InterviewExperiencesRepository } from "../repository/interview-experiences.repository";

export class InterviewExperiencesService extends BaseService<InterviewExperiences> {
    constructor() {
        super(new InterviewExperiencesRepository());
    }
}
