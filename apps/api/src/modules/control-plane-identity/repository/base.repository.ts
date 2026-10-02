import {
    Attributes,
    CreationAttributes,
    FindOptions,
    Model,
    ModelStatic,
    UpdateOptions,
    WhereOptions,
} from "sequelize";

export abstract class BaseRepository<T extends Model> {
    protected constructor(protected readonly model: ModelStatic<T>) {}

    async create(data: CreationAttributes<T>): Promise<T> {
        return this.model.create(data);
    }

    async getById(id: string, options: Omit<FindOptions<Attributes<T>>, "where"> = {}): Promise<T | null> {
        return this.model.findByPk(id, options);
    }

    async getAll(options: FindOptions<Attributes<T>> = {}): Promise<T[]> {
        return this.model.findAll(options);
    }

    async getOne(
        where: WhereOptions<Attributes<T>>,
        options: Omit<FindOptions<Attributes<T>>, "where"> = {},
    ): Promise<T | null> {
        return this.model.findOne({ ...options, where });
    }

    async update(
        where: WhereOptions<Attributes<T>>,
        data: Partial<Attributes<T>>,
        options: Omit<UpdateOptions<Attributes<T>>, "where"> = {},
    ): Promise<[affectedCount: number]> {
        return this.model.update(data, { ...options, where });
    }

    async updateById(
        id: string,
        data: Partial<Attributes<T>>,
        options: Omit<UpdateOptions<Attributes<T>>, "where"> = {},
    ): Promise<[affectedCount: number]> {
        return this.model.update(data, {
            ...options,
            where: { id } as unknown as WhereOptions<Attributes<T>>,
        });
    }

    async delete(where: WhereOptions<Attributes<T>>): Promise<number> {
        return this.model.destroy({ where });
    }

    async deleteById(id: string): Promise<number> {
        return this.model.destroy({
            where: { id } as unknown as WhereOptions<Attributes<T>>,
        });
    }
}
