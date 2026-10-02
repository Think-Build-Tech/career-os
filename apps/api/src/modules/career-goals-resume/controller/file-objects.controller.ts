import { createResourceHandlers } from "../../../core/controller.utils";
import { FileObjects } from "../model/file_objects.model";
import { FileObjectsService } from "../service/file-objects.service";

const service = new FileObjectsService();
const handlers = createResourceHandlers<FileObjects>(service);

export const createFileObjects = handlers.create;
export const getFileObjectss = handlers.getAll;
export const getFileObjectsById = handlers.getById;
export const updateFileObjects = handlers.update;
export const deleteFileObjects = handlers.delete;
