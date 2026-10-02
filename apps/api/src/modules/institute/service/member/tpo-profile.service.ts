import { TpoProfile } from "../../model/member/tpo_profiles.model";
import { TpoProfileRepository } from "../../repository/member/tpo-profile.repository";
import { BaseService } from "../base.service";

export class TpoProfileService extends BaseService<TpoProfile> {
    constructor() {
        super(new TpoProfileRepository());
    }
}
