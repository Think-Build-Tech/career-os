import { AlumniProfile } from "../../model/member/alumni_profiles.model";
import { BaseRepository } from "../base.repository";

export class AlumniProfileRepository extends BaseRepository<AlumniProfile> {
    constructor() {
        super(AlumniProfile);
    }
}
