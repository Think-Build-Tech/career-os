import { BaseRepository } from "../../../core/base.repository";
import { ResourceProgress } from "../model/resource_progress.model";

export class ResourceProgressRepository extends BaseRepository<ResourceProgress> {
    constructor() {
        super(ResourceProgress);
    }
}
