import { BaseService } from "../../../core/base.service";
import { Badges } from "../model/badges.model";
import { BadgesRepository } from "../repository/badges.repository";

export class BadgesService extends BaseService<Badges> {
    constructor() {
        super(new BadgesRepository());
    }
}
