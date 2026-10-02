import { BaseService } from "../../../core/base.service";
import { MentorshipRelationships } from "../model/mentorship_relationships.model";
import { MentorshipRelationshipsRepository } from "../repository/mentorship-relationships.repository";

export class MentorshipRelationshipsService extends BaseService<MentorshipRelationships> {
    constructor() {
        super(new MentorshipRelationshipsRepository());
    }
}
