import { AlumniProfile } from "../../model/member/alumni_profiles.model";
import { AlumniProfileRepository } from "../../repository/member/alumni-profile.repository";
import { BaseService } from "../base.service";

export class AlumniProfileService extends BaseService<AlumniProfile> {
    constructor() {
        super(new AlumniProfileRepository());
    }
}
