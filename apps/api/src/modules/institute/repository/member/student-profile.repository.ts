import { StudentProfile } from "../../model/member/student_profiles.model";
import { BaseRepository } from "../base.repository";

export class StudentProfileRepository extends BaseRepository<StudentProfile> {
    constructor() {
        super(StudentProfile);
    }
}
