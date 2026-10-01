import { Attributes, FindOptions, Op } from "sequelize";
import type { TenantCreatePayload, TenantUpdatePayload } from "@repo/types";
import { Tenant } from "../../model/tenant/tenants.model";
import { BaseRepository } from "../base.repository";

export class TenantRepository extends BaseRepository<Tenant> {
    constructor() {
        super(Tenant);
    }

    async create(tenantData: TenantCreatePayload): Promise<Tenant> {
        return super.create(tenantData);
    }

    async getTenantById(
        tenantId: string,
        options: Omit<FindOptions<Attributes<Tenant>>, "where"> = {},
    ): Promise<Tenant | null> {
        return super.getById(tenantId, options);
    }

    async getAllTenants(options: FindOptions<Attributes<Tenant>> = {}): Promise<Tenant[]> {
        return super.getAll(options);
    }

    async getTenantByName(
        tenantName: string,
        options: Omit<FindOptions<Attributes<Tenant>>, "where"> = {},
    ): Promise<Tenant[]> {
        return super.getAll({
            ...options,
            where: {
                [Op.or]: [
                    { name: tenantName },
                    { legal_name: tenantName },
                ],
            },
        });
    }

    async updateTenant(tenantId: string, tenantData: TenantUpdatePayload): Promise<[affectedCount: number]> {
        return super.update({ id: tenantId }, tenantData);
    }

    async deleteTenant(tenantId: string): Promise<number> {
        return super.delete({ id: tenantId });
    }
}