import {
    Attributes,
    CreationAttributes,
    FindOptions,
    Model,
    UpdateOptions,
    WhereOptions,
} from "sequelize";
import { BaseRepository } from "../repository/base.repository";

export abstract class BaseService<
    T extends Model,
    CreatePayload = CreationAttributes<T>,
    UpdatePayload = Partial<Attributes<T>>,
> {
    protected constructor(protected readonly repository: BaseRepository<T>) {}

    async create(data: CreatePayload): Promise<T> {
        return this.repository.create(data as CreationAttributes<T>);
    }

    async getById(id: string, options: Omit<FindOptions<Attributes<T>>, "where"> = {}): Promise<T | null> {
        return this.repository.getById(id, options);
    }

    async getAll(options: FindOptions<Attributes<T>> = {}): Promise<T[]> {
        return this.repository.getAll(options);
    }

    async getOne(
        where: WhereOptions<Attributes<T>>,
        options: Omit<FindOptions<Attributes<T>>, "where"> = {},
    ): Promise<T | null> {
        return this.repository.getOne(where, options);
    }

    async update(
        where: WhereOptions<Attributes<T>>,
        data: UpdatePayload,
        options: Omit<UpdateOptions<Attributes<T>>, "where"> = {},
    ): Promise<[affectedCount: number]> {
        return this.repository.update(where, data as Partial<Attributes<T>>, options);
    }

    async updateById(
        id: string,
        data: UpdatePayload,
        options: Omit<UpdateOptions<Attributes<T>>, "where"> = {},
    ): Promise<[affectedCount: number]> {
        return this.repository.updateById(id, data as Partial<Attributes<T>>, options);
    }

    async delete(where: WhereOptions<Attributes<T>>): Promise<number> {
        return this.repository.delete(where);
    }

    async deleteById(id: string): Promise<number> {
        return this.repository.deleteById(id);
    }
}
