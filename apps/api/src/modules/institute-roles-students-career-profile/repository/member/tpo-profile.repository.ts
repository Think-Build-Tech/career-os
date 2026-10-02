import { TpoProfile } from "../../model/member/tpo_profiles.model";
import { BaseRepository } from "../base.repository";

export class TpoProfileRepository extends BaseRepository<TpoProfile> {
    constructor() {
        super(TpoProfile);
    }
}
