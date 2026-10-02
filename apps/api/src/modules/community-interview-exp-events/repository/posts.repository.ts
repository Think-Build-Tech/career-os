import { BaseRepository } from "../../../core/base.repository";
import { Posts } from "../model/posts.model";

export class PostsRepository extends BaseRepository<Posts> {
    constructor() {
        super(Posts);
    }
}
