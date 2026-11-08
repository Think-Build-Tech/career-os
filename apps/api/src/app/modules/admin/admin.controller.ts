import { Request, Response } from 'express';
import { QueryTypes, Op } from 'sequelize';
import { sequelize } from '../../config/database';
import { Institution } from '../institution/institution.model';
import { User } from '../user/user.model';
import { AuditLog } from '../audit/models';
import { AiRun } from '../tacie/models';
import { Message } from '../chat/models';
import { AssessmentAttempt } from '../assessment/models';
import { IntegrationConnection, SyncJob } from '../integration/models';

const DEFAULT_SETTINGS = {
  defaultAiModule: true,
  assessmentHub: true,
  alumniNetwork: true,
  adminMfa: true,
  supportApproval: true,
  verboseAuthErrors: false,
  provisioningPaused: false,
  maintenanceMode: false,
};

async function safe<T>(work: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await work();
  } catch {
    return fallback;
  }
}

async function ensureSettingsTable(): Promise<void> {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS platform_settings (
      key VARCHAR(100) PRIMARY KEY,
      value JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function getDashboard(_req: Request, res: Response) {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [institutions, totalInstitutionCount, activeInstitutionCount, totalUsers, newInstitutions, aiRuns, aiTotals, messageCount,
      assessmentCount, recentAudit, integrations, syncJobs, aiByInstitution, aiByFeature] = await Promise.all([
      safe(() => Institution.findAll({ where: { status: { [Op.notIn]: ['ARCHIVED', 'Archived', 'archived'] } }, order: [['updated_at', 'DESC']], limit: 100 }), []),
      safe(() => Institution.count({ where: { status: { [Op.notIn]: ['ARCHIVED', 'Archived', 'archived'] } } }), 0),
      safe(() => Institution.count({ where: { status: { [Op.iLike]: 'active' } } }), 0),
      safe(() => User.count(), 0),
      safe(() => Institution.count({ where: { created_at: { [Op.gte]: monthStart } } }), 0),
      safe(() => AiRun.count({ where: { created_at: { [Op.gte]: monthStart } } }), 0),
      safe(() => sequelize.query<Record<string, unknown>>(
        `SELECT COALESCE(SUM(prompt_tokens), 0) AS prompt_tokens,
                COALESCE(SUM(completion_tokens), 0) AS completion_tokens,
                COALESCE(SUM(estimated_cost), 0) AS estimated_cost
         FROM ai_runs WHERE created_at >= :monthStart`,
        { replacements: { monthStart }, type: QueryTypes.SELECT }
      ), []),
      safe(() => Message.count({ where: { created_at: { [Op.gte]: monthStart } } }), 0),
      safe(() => AssessmentAttempt.count({ where: { created_at: { [Op.gte]: monthStart } } }), 0),
      safe(() => AuditLog.findAll({ order: [['created_at', 'DESC']], limit: 10 }), []),
      safe(() => IntegrationConnection.findAll({ order: [['updated_at', 'DESC']], limit: 20 }), []),
      safe(() => SyncJob.findAll({ order: [['created_at', 'DESC']], limit: 20 }), []),
      safe(() => sequelize.query(
        `SELECT q.scope_id AS institution_id,
                COUNT(*)::int AS requests,
                COALESCE(SUM(e.input_tokens), 0)::bigint AS input_tokens,
                COALESCE(SUM(e.output_tokens), 0)::bigint AS output_tokens,
                COALESCE(SUM(e.credits_consumed), 0)::bigint AS credits
         FROM ai_credit_events e
         JOIN ai_usage_quotas q ON q.id = e.quota_id
         WHERE UPPER(q.scope_type) = 'INSTITUTION' AND e.created_at >= :monthStart
         GROUP BY q.scope_id`,
        { replacements: { monthStart }, type: QueryTypes.SELECT }
      ), [] as Record<string, unknown>[]),
      safe(() => sequelize.query(
        `SELECT feature, COUNT(*)::int AS requests,
                COALESCE(SUM(input_tokens), 0)::bigint AS input_tokens,
                COALESCE(SUM(output_tokens), 0)::bigint AS output_tokens,
                COALESCE(SUM(credits_consumed), 0)::bigint AS credits
         FROM ai_credit_events WHERE created_at >= :monthStart
         GROUP BY feature ORDER BY requests DESC`,
        { replacements: { monthStart }, type: QueryTypes.SELECT }
      ), [] as Record<string, unknown>[]),
    ]);

    const institutionRows = institutions.map((row) => row.get({ plain: true }));
    return res.json({
      success: true,
      dashboard: {
        generatedAt: new Date().toISOString(),
        database: { healthy: true },
        metrics: {
          totalInstitutions: totalInstitutionCount,
          activeInstitutions: activeInstitutionCount,
          newInstitutions,
          totalUsers,
          aiRequests: aiRuns,
          inputTokens: Number(aiTotals[0]?.['prompt_tokens'] || 0),
          outputTokens: Number(aiTotals[0]?.['completion_tokens'] || 0),
          estimatedAiCost: Number(aiTotals[0]?.['estimated_cost'] || 0),
          messages: messageCount,
          assessments: assessmentCount,
        },
        institutions: institutionRows,
        audit: recentAudit.map((row) => row.get({ plain: true })),
        integrations: integrations.map((row) => row.get({ plain: true })),
        syncJobs: syncJobs.map((row) => row.get({ plain: true })),
        aiByInstitution,
        aiByFeature,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Unable to load platform dashboard',
      error: error?.message || String(error),
    });
  }
}

export async function getPlatformSettings(_req: Request, res: Response) {
  try {
    await ensureSettingsTable();
    const rows = await sequelize.query<{ value: Record<string, unknown> }>(
      'SELECT value FROM platform_settings WHERE key = :key',
      { replacements: { key: 'default' }, type: QueryTypes.SELECT }
    );
    return res.json({ success: true, settings: { ...DEFAULT_SETTINGS, ...(rows[0]?.value || {}) } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Unable to load settings', error: error?.message });
  }
}

export async function updatePlatformSettings(req: Request, res: Response) {
  try {
    await ensureSettingsTable();
    const settings = { ...DEFAULT_SETTINGS, ...(req.body || {}) };
    await sequelize.query(
      `INSERT INTO platform_settings (key, value, updated_at)
       VALUES (:key, CAST(:value AS JSONB), NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      { replacements: { key: 'default', value: JSON.stringify(settings) } }
    );
    return res.json({ success: true, settings });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Unable to save settings', error: error?.message });
  }
}

export async function checkAdminHealth(_req: Request, res: Response) {
  try {
    const started = Date.now();
    await sequelize.authenticate();
    return res.json({
      success: true,
      health: {
        api: 'OPERATIONAL',
        database: 'OPERATIONAL',
        databaseLatencyMs: Date.now() - started,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return res.status(503).json({
      success: false,
      health: { api: 'OPERATIONAL', database: 'UNAVAILABLE', timestamp: new Date().toISOString() },
      error: error?.message,
    });
  }
}
