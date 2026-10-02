import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { BaseRepository } from "./base.repository";
import { Model, ModelStatic } from "sequelize";

// Dummy Model for testing
class DummyModel extends Model {
  public id!: string;
  public name!: string;
}

// Concrete repository for testing
class DummyRepository extends BaseRepository<DummyModel> {
  constructor(model: ModelStatic<DummyModel>) {
    super(model);
  }
}

describe("BaseRepository", () => {
  let mockModel: any;
  let repository: DummyRepository;

  beforeEach(() => {
    mockModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };
    repository = new DummyRepository(mockModel as unknown as ModelStatic<DummyModel>);
  });

  it("should create an entity", async () => {
    const data = { name: "Test" };
    mockModel.create.mockResolvedValue({ id: "1", ...data });
    
    const result = await repository.create(data as any);
    expect(mockModel.create).toHaveBeenCalledWith(data);
    expect(result).toEqual({ id: "1", name: "Test" });
  });

  it("should get an entity by id", async () => {
    mockModel.findByPk.mockResolvedValue({ id: "123", name: "Test" });
    
    const result = await repository.getById("123");
    expect(mockModel.findByPk).toHaveBeenCalledWith("123", {});
    expect(result).toEqual({ id: "123", name: "Test" });
  });

  it("should get all entities", async () => {
    mockModel.findAll.mockResolvedValue([{ id: "1" }]);
    
    const result = await repository.getAll();
    expect(mockModel.findAll).toHaveBeenCalledWith({});
    expect(result).toEqual([{ id: "1" }]);
  });

  it("should update by id", async () => {
    mockModel.update.mockResolvedValue([1]);
    
    const result = await repository.updateById("123", { name: "Updated" });
    expect(mockModel.update).toHaveBeenCalledWith({ name: "Updated" }, { where: { id: "123" } });
    expect(result).toEqual([1]);
  });

  it("should delete by id", async () => {
    mockModel.destroy.mockResolvedValue(1);
    
    const result = await repository.deleteById("123");
    expect(mockModel.destroy).toHaveBeenCalledWith({ where: { id: "123" } });
    expect(result).toBe(1);
  });
});
