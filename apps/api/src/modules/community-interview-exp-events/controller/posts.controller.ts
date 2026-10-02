import { createResourceHandlers } from "../../../core/controller.utils";
import { Posts } from "../model/posts.model";
import { PostsService } from "../service/posts.service";

const service = new PostsService();
const handlers = createResourceHandlers<Posts>(service);

export const createPosts = handlers.create;
export const getPostss = handlers.getAll;
export const getPostsById = handlers.getById;
export const updatePosts = handlers.update;
export const deletePosts = handlers.delete;
