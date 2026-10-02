import { BaseService } from "../../../core/base.service";
import { ResourceProgress } from "../model/resource_progress.model";
import { ResourceProgressRepository } from "../repository/resource-progress.repository";

export class ResourceProgressService extends BaseService<ResourceProgress> {
    constructor() {
        super(new ResourceProgressRepository());
    }
}
