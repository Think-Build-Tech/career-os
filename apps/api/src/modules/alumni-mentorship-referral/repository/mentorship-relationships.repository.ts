import { BaseRepository } from "../../../core/base.repository";
import { MentorshipRelationships } from "../model/mentorship_relationships.model";

export class MentorshipRelationshipsRepository extends BaseRepository<MentorshipRelationships> {
    constructor() {
        super(MentorshipRelationships);
    }
}
