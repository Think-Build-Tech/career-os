import { createResourceHandlers } from "../../../core/controller.utils";
import { SkillGapSnapshots } from "../model/skill_gap_snapshots.model";
import { SkillGapSnapshotsService } from "../service/skill-gap-snapshots.service";

const service = new SkillGapSnapshotsService();
const handlers = createResourceHandlers<SkillGapSnapshots>(service);

export const createSkillGapSnapshots = handlers.create;
export const getSkillGapSnapshotss = handlers.getAll;
export const getSkillGapSnapshotsById = handlers.getById;
export const updateSkillGapSnapshots = handlers.update;
export const deleteSkillGapSnapshots = handlers.delete;
