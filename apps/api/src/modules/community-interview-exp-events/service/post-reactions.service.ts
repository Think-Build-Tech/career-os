import { BaseService } from "../../../core/base.service";
import { PostReactions } from "../model/post_reactions.model";
import { PostReactionsRepository } from "../repository/post-reactions.repository";

export class PostReactionsService extends BaseService<PostReactions> {
    constructor() {
        super(new PostReactionsRepository());
    }
}
