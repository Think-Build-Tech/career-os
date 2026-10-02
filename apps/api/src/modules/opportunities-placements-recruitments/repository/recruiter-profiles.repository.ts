import { BaseRepository } from "../../../core/base.repository";
import { RecruiterProfiles } from "../model/recruiter_profiles.model";

export class RecruiterProfilesRepository extends BaseRepository<RecruiterProfiles> {
    constructor() {
        super(RecruiterProfiles);
    }
}
