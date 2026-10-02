import { BaseService } from "../../../core/base.service";
import { Posts } from "../model/posts.model";
import { PostsRepository } from "../repository/posts.repository";

export class PostsService extends BaseService<Posts> {
    constructor() {
        super(new PostsRepository());
    }
}
