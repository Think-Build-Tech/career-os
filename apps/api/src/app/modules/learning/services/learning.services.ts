import { CrudService, MutableService, MutationOptions } from "../../services";
import {
  LearningComment,
  LearningPost,
  LearningPostSkill,
  LearningPostTag,
  LearningReaction,
  LearningResource,
  LearningSave,
  LearningTag,
  SavedItem,
} from "../models";

export class LearningPostService extends CrudService<LearningPost> {
  constructor() { super(LearningPost); }
}
export class LearningResourceService extends CrudService<LearningResource> {
  constructor() { super(LearningResource); }
}
export class LearningTagService extends CrudService<LearningTag> {
  constructor() { super(LearningTag); }
}
export class LearningPostTagService extends CrudService<LearningPostTag> {
  constructor() { super(LearningPostTag); }
}
export class LearningPostSkillService extends CrudService<LearningPostSkill> {
  constructor() { super(LearningPostSkill); }
}
export class LearningReactionService extends CrudService<LearningReaction> {
  constructor() { super(LearningReaction); }
}
export class LearningCommentService extends MutableService<LearningComment> {
  constructor() { super(LearningComment); }
}
export class LearningSaveService extends CrudService<LearningSave> {
  constructor() { super(LearningSave); }
}
export class SavedItemService extends CrudService<SavedItem> {
  constructor() { super(SavedItem); }

  async toggleSave(
    userId: string,
    itemType: string,
    itemId: string,
    studentId?: string | null,
    metadata?: Record<string, unknown>,
    options: MutationOptions = {}
  ): Promise<{ saved: boolean; item: SavedItem | null }> {
    const existing = await this.model.findOne({
      where: {
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
      },
      transaction: options.transaction,
    });

    if (existing) {
      await existing.destroy({ transaction: options.transaction });
      return { saved: false, item: null };
    }

    const item = await this.model.create(
      {
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
        student_id: studentId ?? null,
        metadata: metadata ?? {},
      },
      { transaction: options.transaction }
    );
    return { saved: true, item };
  }

  async isSaved(userId: string, itemType: string, itemId: string): Promise<boolean> {
    const count = await this.model.count({
      where: {
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
      },
    });
    return count > 0;
  }

  async getSavedItems(userId: string, itemType?: string): Promise<SavedItem[]> {
    const where: Record<string, unknown> = { user_id: userId };
    if (itemType) {
      where.item_type = itemType;
    }
    return this.model.findAll({
      where,
      order: [["created_at", "DESC"]],
    });
  }
}

