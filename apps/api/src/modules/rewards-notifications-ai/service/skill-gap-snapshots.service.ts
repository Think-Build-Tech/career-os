import { BaseService } from "../../../core/base.service";
import { SkillGapSnapshots } from "../model/skill_gap_snapshots.model";
import { SkillGapSnapshotsRepository } from "../repository/skill-gap-snapshots.repository";

export class SkillGapSnapshotsService extends BaseService<SkillGapSnapshots> {
    constructor() {
        super(new SkillGapSnapshotsRepository());
    }
}
