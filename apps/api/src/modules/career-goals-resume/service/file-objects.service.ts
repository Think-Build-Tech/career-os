import { BaseService } from "../../../core/base.service";
import { FileObjects } from "../model/file_objects.model";
import { FileObjectsRepository } from "../repository/file-objects.repository";

export class FileObjectsService extends BaseService<FileObjects> {
    constructor() {
        super(new FileObjectsRepository());
    }
}
