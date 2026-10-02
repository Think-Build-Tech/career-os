import { BaseRepository } from "../../../core/base.repository";
import { Badges } from "../model/badges.model";

export class BadgesRepository extends BaseRepository<Badges> {
    constructor() {
        super(Badges);
    }
}
