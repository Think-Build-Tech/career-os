import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { BaseService } from "./base.service";
import { BaseRepository } from "../repository/base.repository";
import { Model } from "sequelize";

class DummyModel extends Model {
  public id!: string;
  public name!: string;
}

// Mock Repository
class MockRepository extends BaseRepository<DummyModel> {
  constructor() {
    super({} as any);
  }
  
  create = jest.fn() as any;
  getById = jest.fn() as any;
  getAll = jest.fn() as any;
  updateById = jest.fn() as any;
  deleteById = jest.fn() as any;
}

// Concrete Service
class DummyService extends BaseService<DummyModel> {
  constructor(repo: MockRepository) {
    super(repo);
  }
}

describe("BaseService", () => {
  let mockRepo: MockRepository;
  let service: DummyService;

  beforeEach(() => {
    mockRepo = new MockRepository();
    service = new DummyService(mockRepo);
  });

  it("should create an entity", async () => {
    const data = { name: "Test" };
    mockRepo.create.mockResolvedValue({ id: "1", ...data });
    
    const result = await service.create(data as any);
    expect(mockRepo.create).toHaveBeenCalledWith(data);
    expect(result).toEqual({ id: "1", name: "Test" });
  });

  it("should get an entity by id", async () => {
    mockRepo.getById.mockResolvedValue({ id: "123", name: "Test" });
    
    const result = await service.getById("123");
    expect(mockRepo.getById).toHaveBeenCalledWith("123", {});
    expect(result).toEqual({ id: "123", name: "Test" });
  });

  it("should get all entities", async () => {
    mockRepo.getAll.mockResolvedValue([{ id: "1" }]);
    
    const result = await service.getAll();
    expect(mockRepo.getAll).toHaveBeenCalledWith({});
    expect(result).toEqual([{ id: "1" }]);
  });

  it("should update by id", async () => {
    mockRepo.updateById.mockResolvedValue([1]);
    
    const result = await service.updateById("123", { name: "Updated" });
    expect(mockRepo.updateById).toHaveBeenCalledWith("123", { name: "Updated" }, {});
    expect(result).toEqual([1]);
  });

  it("should delete by id", async () => {
    mockRepo.deleteById.mockResolvedValue(1);
    
    const result = await service.deleteById("123");
    expect(mockRepo.deleteById).toHaveBeenCalledWith("123");
    expect(result).toBe(1);
  });
});
