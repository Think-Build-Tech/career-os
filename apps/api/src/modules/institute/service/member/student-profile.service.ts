import { StudentProfile } from "../../model/member/student_profiles.model";
import { StudentProfileRepository } from "../../repository/member/student-profile.repository";
import { BaseService } from "../base.service";

export class StudentProfileService extends BaseService<StudentProfile> {
    constructor() {
        super(new StudentProfileRepository());
    }
}
