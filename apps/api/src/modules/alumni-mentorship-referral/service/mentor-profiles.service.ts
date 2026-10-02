import { BaseService } from "../../../core/base.service";
import { MentorProfiles } from "../model/mentor_profiles.model";
import { MentorProfilesRepository } from "../repository/mentor-profiles.repository";

export class MentorProfilesService extends BaseService<MentorProfiles> {
    constructor() {
        super(new MentorProfilesRepository());
    }
}
