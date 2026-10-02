import { BaseService } from "../../../core/base.service";
import { RecruiterProfiles } from "../model/recruiter_profiles.model";
import { RecruiterProfilesRepository } from "../repository/recruiter-profiles.repository";

export class RecruiterProfilesService extends BaseService<RecruiterProfiles> {
    constructor() {
        super(new RecruiterProfilesRepository());
    }
}
