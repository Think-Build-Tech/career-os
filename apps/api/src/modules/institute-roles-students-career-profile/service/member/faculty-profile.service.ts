import { FacultyProfile } from "../../model/member/faculty_profiles.model";
import { FacultyProfileRepository } from "../../repository/member/faculty-profile.repository";
import { BaseService } from "../base.service";

export class FacultyProfileService extends BaseService<FacultyProfile> {
    constructor() {
        super(new FacultyProfileRepository());
    }
}
