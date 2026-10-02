import { BaseService } from "../../../core/base.service";
import { Applications } from "../model/applications.model";
import { ApplicationsRepository } from "../repository/applications.repository";

export class ApplicationsService extends BaseService<Applications> {
    constructor() {
        super(new ApplicationsRepository());
    }
}
