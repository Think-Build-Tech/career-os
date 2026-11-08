import { Request, Response } from "express";
import {
  IntegrationConnectionService,
  SyncJobService,
  ExternalIdMappingService,
} from "./services";

const connectionService = new IntegrationConnectionService();
const syncJobService = new SyncJobService();
const mappingService = new ExternalIdMappingService();

// Connections
export async function getAllConnections(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const connections = await connectionService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      connections,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getConnectionById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide connection ID",
      });
    }

    const connection = await connectionService.findById(id);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Integration connection not found",
      });
    }

    return res.status(200).json({
      success: true,
      connection,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createConnection(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.integration_type || !data.name) {
      return res.status(400).json({
        success: false,
        message: "integration_type and name are required",
      });
    }

    const connection = await connectionService.create(data);
    return res.status(201).json({
      success: true,
      connection,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateConnection(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide connection ID",
      });
    }

    const connection = await connectionService.updateById(id, data);
    return res.status(200).json({
      success: true,
      connection,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function deleteConnection(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide connection ID",
      });
    }

    await connectionService.deleteById(id);
    return res.status(200).json({
      success: true,
      message: "Integration connection deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Sync Jobs
export async function getAllSyncJobs(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const syncJobs = await syncJobService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      syncJobs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createSyncJob(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.integration_connection_id || !data.job_type) {
      return res.status(400).json({
        success: false,
        message: "integration_connection_id and job_type are required",
      });
    }

    const syncJob = await syncJobService.create(data);
    return res.status(201).json({
      success: true,
      syncJob,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// External Mappings
export async function getAllMappings(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const mappings = await mappingService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      mappings,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createMapping(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.integration_connection_id || !data.entity_type || !data.entity_id || !data.external_id) {
      return res.status(400).json({
        success: false,
        message: "integration_connection_id, entity_type, entity_id, and external_id are required",
      });
    }

    const mapping = await mappingService.create(data);
    return res.status(201).json({
      success: true,
      mapping,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

