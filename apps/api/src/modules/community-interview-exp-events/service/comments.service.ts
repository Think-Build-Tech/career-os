import { BaseService } from "../../../core/base.service";
import { Comments } from "../model/comments.model";
import { CommentsRepository } from "../repository/comments.repository";

export class CommentsService extends BaseService<Comments> {
    constructor() {
        super(new CommentsRepository());
    }
}
