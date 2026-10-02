import { createResourceHandlers } from "../../../core/controller.utils";
import { Comments } from "../model/comments.model";
import { CommentsService } from "../service/comments.service";

const service = new CommentsService();
const handlers = createResourceHandlers<Comments>(service);

export const createComments = handlers.create;
export const getCommentss = handlers.getAll;
export const getCommentsById = handlers.getById;
export const updateComments = handlers.update;
export const deleteComments = handlers.delete;
