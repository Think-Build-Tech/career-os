import { Attributes, FindOptions, Op } from "sequelize";
import type { TenantCreatePayload, TenantUpdatePayload } from "@repo/types";
import { Tenant } from "../../model/tenant/tenants.model";
import { TenantRepository } from "../../repository/tenant/tenant.repository";
import { BaseService } from "../base.service";

export class TenantService extends BaseService<Tenant, TenantCreatePayload, TenantUpdatePayload> {
    private readonly tenantRepository: TenantRepository;

    constructor() {
        const repository = new TenantRepository();
        super(repository);
        this.tenantRepository = repository;
    }

    async create(tenantData: TenantCreatePayload): Promise<Tenant> {
        return this.tenantRepository.create(tenantData);
    }

    async getTenantById(
        tenantId: string,
        options: Omit<FindOptions<Attributes<Tenant>>, "where"> = {},
    ): Promise<Tenant | null> {
        return this.tenantRepository.getTenantById(tenantId, options);
    }

    async getAllTenants(options: FindOptions<Attributes<Tenant>> = {}): Promise<Tenant[]> {
        return this.tenantRepository.getAllTenants(options);
    }

    async getTenantByName(
        tenantName: string,
        options: Omit<FindOptions<Attributes<Tenant>>, "where"> = {},
    ): Promise<Tenant[]> {
        return this.tenantRepository.getAllTenants({
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
        return this.tenantRepository.updateTenant(tenantId, tenantData);
    }

    async deleteTenant(tenantId: string): Promise<number> {
        return this.tenantRepository.deleteTenant(tenantId);
    }
}
