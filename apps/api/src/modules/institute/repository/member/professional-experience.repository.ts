import { ProfessionalExperience } from "../../model/member/professional_experiences.model";
import { BaseRepository } from "../base.repository";

export class ProfessionalExperienceRepository extends BaseRepository<ProfessionalExperience> {
    constructor() {
        super(ProfessionalExperience);
    }
}
