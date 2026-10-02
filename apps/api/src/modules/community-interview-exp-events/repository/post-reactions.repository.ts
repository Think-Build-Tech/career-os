import { BaseRepository } from "../../../core/base.repository";
import { PostReactions } from "../model/post_reactions.model";

export class PostReactionsRepository extends BaseRepository<PostReactions> {
    constructor() {
        super(PostReactions);
    }
}
