import { ProfessionalExperience } from "../../model/member/professional_experiences.model";
import { ProfessionalExperienceRepository } from "../../repository/member/professional-experience.repository";
import { BaseService } from "../base.service";

export class ProfessionalExperienceService extends BaseService<ProfessionalExperience> {
    constructor() {
        super(new ProfessionalExperienceRepository());
    }
}
