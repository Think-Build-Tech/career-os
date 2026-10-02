import { FacultyProfile } from "../../model/member/faculty_profiles.model";
import { BaseRepository } from "../base.repository";

export class FacultyProfileRepository extends BaseRepository<FacultyProfile> {
    constructor() {
        super(FacultyProfile);
    }
}
