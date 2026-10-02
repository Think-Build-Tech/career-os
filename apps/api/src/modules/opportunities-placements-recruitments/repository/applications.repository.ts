import { BaseRepository } from "../../../core/base.repository";
import { Applications } from "../model/applications.model";

export class ApplicationsRepository extends BaseRepository<Applications> {
    constructor() {
        super(Applications);
    }
}
