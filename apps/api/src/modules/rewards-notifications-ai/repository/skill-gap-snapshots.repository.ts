import { BaseRepository } from "../../../core/base.repository";
import { SkillGapSnapshots } from "../model/skill_gap_snapshots.model";

export class SkillGapSnapshotsRepository extends BaseRepository<SkillGapSnapshots> {
    constructor() {
        super(SkillGapSnapshots);
    }
}
