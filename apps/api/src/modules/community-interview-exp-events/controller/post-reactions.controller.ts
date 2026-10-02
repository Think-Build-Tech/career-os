import { createResourceHandlers } from "../../../core/controller.utils";
import { PostReactions } from "../model/post_reactions.model";
import { PostReactionsService } from "../service/post-reactions.service";

const service = new PostReactionsService();
const handlers = createResourceHandlers<PostReactions>(service);

export const createPostReactions = handlers.create;
export const getPostReactionss = handlers.getAll;
export const getPostReactionsById = handlers.getById;
export const updatePostReactions = handlers.update;
export const deletePostReactions = handlers.delete;
