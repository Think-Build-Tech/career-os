import { BaseRepository } from "../../../core/base.repository";
import { FileObjects } from "../model/file_objects.model";

export class FileObjectsRepository extends BaseRepository<FileObjects> {
    constructor() {
        super(FileObjects);
    }
}
