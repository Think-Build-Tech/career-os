import { BaseRepository } from "../../../core/base.repository";
import { MentorProfiles } from "../model/mentor_profiles.model";

export class MentorProfilesRepository extends BaseRepository<MentorProfiles> {
    constructor() {
        super(MentorProfiles);
    }
}
