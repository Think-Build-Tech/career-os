import { Request, Response, NextFunction } from "express";
import type { TenantCreatePayload, TenantUpdatePayload } from "@repo/types";
import { Tenant } from "../../model/tenant/tenants.model";
import { TenantService } from "../../service/tenant/tenant.service";
import { BaseController } from "../base.controller";

export class TenantController extends BaseController<Tenant, TenantCreatePayload, TenantUpdatePayload> {
    private readonly tenantService: TenantService;

    constructor() {
        const service = new TenantService();
        super(service);
        this.tenantService = service;
    }

    async getByName(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const name = typeof req.query.name === "string" ? req.query.name : undefined;
            if (!name) {
                res.status(400).json({ message: "The name query parameter is required" });
                return;
            }

            const tenants = await this.tenantService.getTenantByName(name);
            res.json(tenants);
        } catch (error) {
            next(error);
        }
    }
}
