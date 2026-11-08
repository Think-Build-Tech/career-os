import { Request, Response } from "express";
import { InstitutionService } from "./services";
import { AuditLog } from "../audit/models";
import { QueryTypes } from "sequelize";
import { sequelize } from "../../config/database";

const institutionService = new InstitutionService();

export async function getAllInstitutions(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const institutions = await institutionService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      institutions,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getInstitutionById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide institution ID",
      });
    }

    const institution = await institutionService.findById(id);
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: "Institution not found",
      });
    }

    return res.status(200).json({
      success: true,
      institution,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createInstitution(req: Request, res: Response) {
  try {
    const platformSettings = await sequelize.query<{ value: Record<string, unknown> }>(
      "SELECT value FROM platform_settings WHERE key = 'default'",
      { type: QueryTypes.SELECT }
    ).catch(() => []);
    if (platformSettings[0]?.value?.['provisioningPaused'] === true) {
      return res.status(503).json({
        success: false,
        message: "Tenant provisioning is paused in platform settings",
      });
    }

    const data = req.body || {};
    if (!data.name || !data.code) {
      return res.status(400).json({
        success: false,
        message: "name and code are required",
      });
    }

    const payload = {
      ...data,
      external_tenant_id: data.external_tenant_id || data.tenant_id || require('crypto').randomUUID(),
    };

    const institution = await institutionService.createInstitution(payload);
    await AuditLog.create({
      action: "INSTITUTION_CREATED",
      entity_type: "Institution",
      entity_id: institution.id,
      new_value: institution.get({ plain: true }),
    }).catch(() => undefined);
    return res.status(201).json({
      success: true,
      institution,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateInstitution(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    const previous = await institutionService.findById(id);
    const institution = await institutionService.updateById(id, data);
    await AuditLog.create({
      action: "INSTITUTION_UPDATED",
      entity_type: "Institution",
      entity_id: institution.id,
      previous_value: previous?.get({ plain: true }) || null,
      new_value: institution.get({ plain: true }),
    }).catch(() => undefined);
    return res.status(200).json({
      success: true,
      institution,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function deleteInstitution(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const previous = await institutionService.findById(id);
    await institutionService.deleteById(id);
    await AuditLog.create({
      action: "INSTITUTION_ARCHIVED",
      entity_type: "Institution",
      entity_id: id,
      previous_value: previous?.get({ plain: true }) || null,
    }).catch(() => undefined);
    return res.status(200).json({
      success: true,
      message: "Institution deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

