import {
  Attributes,
  CreationAttributes,
  FindOptions,
  Model,
  ModelStatic,
  Transaction,
  WhereOptions,
} from "sequelize";
import { EntityNotFoundError, InvalidServiceInputError } from "./service.errors";

export interface ServiceListOptions<A> extends Omit<FindOptions<A>, "limit" | "offset"> {
  pagination?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<M> {
  rows: M[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface MutationOptions {
  transaction?: Transaction;
}

export interface DeleteOptions extends MutationOptions {
  hard_delete?: boolean;
}

export abstract class ReadService<M extends Model> {
  protected constructor(protected readonly model: ModelStatic<M>) {}

  async findById(
    id: string,
    options: Omit<FindOptions<Attributes<M>>, "where"> = {}
  ): Promise<M | null> {
    this.assertId(id);
    return this.model.findByPk(id, options);
  }

  async requireById(
    id: string,
    options: Omit<FindOptions<Attributes<M>>, "where"> = {}
  ): Promise<M> {
    const entity = await this.findById(id, options);
    if (!entity) {
      throw new EntityNotFoundError(this.model.name, id);
    }
    return entity;
  }

  async findAll(options: ServiceListOptions<Attributes<M>> = {}): Promise<M[]> {
    const { pagination = false, page = 1, limit = 20, ...findOptions } = options;
    const normalizedPage = this.normalizePage(page);
    const normalizedLimit = this.normalizeLimit(limit);

    return this.model.findAll({
      ...findOptions,
      order: findOptions.order ?? this.defaultOrder(),
      ...(pagination
        ? {
            limit: normalizedLimit,
            offset: (normalizedPage - 1) * normalizedLimit,
          }
        : {}),
    });
  }

  async paginate(options: ServiceListOptions<Attributes<M>> = {}): Promise<PaginatedResult<M>> {
    const { page = 1, limit = 20, pagination: _pagination, ...findOptions } = options;
    const normalizedPage = this.normalizePage(page);
    const normalizedLimit = this.normalizeLimit(limit);
    const result = await this.model.findAndCountAll({
      ...findOptions,
      distinct: true,
      order: findOptions.order ?? this.defaultOrder(),
      limit: normalizedLimit,
      offset: (normalizedPage - 1) * normalizedLimit,
    });

    return {
      rows: result.rows,
      count: result.count,
      page: normalizedPage,
      limit: normalizedLimit,
      total_pages: Math.ceil(result.count / normalizedLimit),
    };
  }

  async exists(where: WhereOptions<Attributes<M>>): Promise<boolean> {
    return (await this.model.count({ where })) > 0;
  }

  protected assertId(id: string): void {
    if (!id?.trim()) {
      throw new InvalidServiceInputError(`${this.model.name} id is required`);
    }
  }

  private normalizePage(page: number): number {
    return Math.max(1, Number(page) || 1);
  }

  private normalizeLimit(limit: number): number {
    return Math.min(100, Math.max(1, Number(limit) || 20));
  }

  private defaultOrder(): FindOptions<Attributes<M>>["order"] {
    return this.model.rawAttributes.created_at ? [["created_at", "DESC"]] : undefined;
  }
}

export abstract class CreateReadService<M extends Model> extends ReadService<M> {
  async create(data: CreationAttributes<M>, options: MutationOptions = {}): Promise<M> {
    return this.model.create(data, { transaction: options.transaction });
  }
}

export abstract class MutableService<M extends Model> extends CreateReadService<M> {
  async updateById(
    id: string,
    data: Partial<Attributes<M>>,
    options: MutationOptions = {}
  ): Promise<M> {
    const entity = await this.requireById(id, { transaction: options.transaction });
    entity.set(data);
    return entity.save({ transaction: options.transaction });
  }
}

export abstract class CrudService<M extends Model> extends MutableService<M> {
  async deleteById(id: string, options: DeleteOptions = {}): Promise<boolean> {
    const entity = await this.requireById(id, { transaction: options.transaction });

    if (!options.hard_delete && this.model.rawAttributes.status) {
      entity.set("status" as keyof Attributes<M>, "ARCHIVED" as Attributes<M>[keyof Attributes<M>]);
      await entity.save({ transaction: options.transaction });
      return true;
    }

    if (!options.hard_delete && this.model.rawAttributes.deleted_at) {
      entity.set("deleted_at" as keyof Attributes<M>, new Date() as Attributes<M>[keyof Attributes<M>]);
      await entity.save({ transaction: options.transaction });
      return true;
    }

    await entity.destroy({ transaction: options.transaction });
    return true;
  }
}
