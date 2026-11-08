import { Transaction } from "sequelize";
import { sequelize } from "../../../config/database";
import { CreateReadService, CrudService, MutableService, MutationOptions } from "../../services";
import { InvalidServiceInputError } from "../../services/service.errors";
import {
  AiCreditEvent,
  AiRun,
  AiUsageQuota,
  CandidateMatchResult,
  CandidateMatchRun,
  CandidateSearch,
  MarketSkillSnapshot,
  ResumeAnalysis,
  SkillGapAnalysis,
  SkillGapItem,
} from "../models";

export class AiRunService extends MutableService<AiRun> {
  constructor() { super(AiRun); }
}
export class ResumeAnalysisService extends CreateReadService<ResumeAnalysis> {
  constructor() { super(ResumeAnalysis); }
}
export class CandidateSearchService extends CreateReadService<CandidateSearch> {
  constructor() { super(CandidateSearch); }
}
export class CandidateMatchRunService extends MutableService<CandidateMatchRun> {
  constructor() { super(CandidateMatchRun); }
}
export class CandidateMatchResultService extends CreateReadService<CandidateMatchResult> {
  constructor() { super(CandidateMatchResult); }
}
export class SkillGapAnalysisService extends CreateReadService<SkillGapAnalysis> {
  constructor() { super(SkillGapAnalysis); }
}
export class SkillGapItemService extends CreateReadService<SkillGapItem> {
  constructor() { super(SkillGapItem); }
}
export class MarketSkillSnapshotService extends CreateReadService<MarketSkillSnapshot> {
  constructor() { super(MarketSkillSnapshot); }
}

export class AiUsageQuotaService extends CrudService<AiUsageQuota> {
  constructor() { super(AiUsageQuota); }

  async consumeCredits(
    quotaId: string,
    params: {
      userId: string;
      feature: string;
      credits: number;
      aiRunId?: string;
      inputTokens?: number;
      outputTokens?: number;
    },
    existingTransaction?: Transaction
  ): Promise<AiCreditEvent> {
    const execute = async (t: Transaction): Promise<AiCreditEvent> => {
      const quota = await AiUsageQuota.findByPk(quotaId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!quota) {
        throw new InvalidServiceInputError("AI usage quota not found");
      }

      if (!quota.is_active) {
        throw new InvalidServiceInputError("AI usage quota is inactive");
      }

      if (quota.used_credits + params.credits > quota.credit_limit) {
        throw new InvalidServiceInputError("AI usage credit limit exceeded");
      }

      quota.used_credits += params.credits;
      await quota.save({ transaction: t });

      return AiCreditEvent.create(
        {
          quota_id: quotaId,
          user_id: params.userId,
          ai_run_id: params.aiRunId ?? null,
          feature: params.feature,
          credits_consumed: params.credits,
          input_tokens: params.inputTokens ?? 0,
          output_tokens: params.outputTokens ?? 0,
        },
        { transaction: t }
      );
    };

    if (existingTransaction) {
      return execute(existingTransaction);
    }
    return sequelize.transaction(execute);
  }

  async getOrCreateUserQuota(
    userId: string,
    defaultLimit = 100,
    options: MutationOptions = {}
  ): Promise<AiUsageQuota> {
    const existing = await this.model.findOne({
      where: {
        scope_type: "USER",
        scope_id: userId,
      },
      transaction: options.transaction,
    });

    if (existing) {
      return existing;
    }

    return this.model.create(
      {
        scope_type: "USER",
        scope_id: userId,
        credit_limit: defaultLimit,
        used_credits: 0,
        reset_frequency: "MONTHLY",
        is_active: true,
        last_reset_at: new Date(),
      },
      { transaction: options.transaction }
    );
  }

  async grantCredits(
    quotaId: string,
    credits: number,
    options: MutationOptions = {}
  ): Promise<AiUsageQuota> {
    const execute = async (t: Transaction) => {
      const quota = await this.requireById(quotaId, {
        transaction: t,
        lock: Transaction.LOCK.UPDATE,
      });

      quota.credit_limit += credits;
      return quota.save({ transaction: t });
    };

    if (options.transaction) {
      return execute(options.transaction);
    }
    return sequelize.transaction(execute);
  }

  async checkQuota(quotaId: string, requiredCredits: number): Promise<boolean> {
    const quota = await this.model.findByPk(quotaId);
    if (!quota || !quota.is_active) {
      return false;
    }
    return quota.credit_limit - quota.used_credits >= requiredCredits;
  }
}

export class AiCreditEventService extends CreateReadService<AiCreditEvent> {
  constructor() { super(AiCreditEvent); }
}

