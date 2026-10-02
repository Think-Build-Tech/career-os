import { BaseRepository } from "../../../core/base.repository";
import { Comments } from "../model/comments.model";

export class CommentsRepository extends BaseRepository<Comments> {
    constructor() {
        super(Comments);
    }
}
