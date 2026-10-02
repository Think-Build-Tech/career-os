import { Request, Response } from "express";
import { createResourceHandlers, getResourceId } from "./controller.utils";
import { BaseService } from "./base.service";
import { Model } from "sequelize";
import { jest } from "@jest/globals";

// Mock implementation of a generic Model
class MockModel extends Model {
  public id!: string;
  public name!: string;
}

// Mock implementation of a BaseService
class MockService extends BaseService<MockModel> {
  constructor() {
    // Pass a dummy repository or null since we will mock the methods
    super({} as any);
  }
  
  create = jest.fn() as any;
  getAll = jest.fn() as any;
  getById = jest.fn() as any;
  updateById = jest.fn() as any;
  deleteById = jest.fn() as any;
}

describe("controller.utils", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockService: MockService;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
      query: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    mockService = new MockService();
  });

  describe("getResourceId", () => {
    it("should return id from params", () => {
      mockRequest.params = { id: "123" };
      expect(getResourceId(mockRequest as Request)).toBe("123");
    });
  });

  describe("createResourceHandlers", () => {
    it("should successfully create a resource", async () => {
      mockRequest.body = { name: "Test" };
      mockService.create.mockResolvedValue({ id: "1", name: "Test" } as any);
      
      const handlers = createResourceHandlers(mockService);
      await handlers.create(mockRequest as Request, mockResponse as Response, jest.fn());
      
      expect(mockService.create).toHaveBeenCalledWith({ name: "Test" });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: "1", name: "Test" });
    });

    it("should successfully get all resources", async () => {
      mockService.getAll.mockResolvedValue([{ id: "1", name: "Test" }] as any);
      
      const handlers = createResourceHandlers(mockService);
      await handlers.getAll(mockRequest as Request, mockResponse as Response, jest.fn());
      
      expect(mockService.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith([{ id: "1", name: "Test" }]);
    });

    it("should get a resource by id", async () => {
      mockRequest.params = { id: "123" };
      mockService.getById.mockResolvedValue({ id: "123", name: "Test" } as any);
      
      const handlers = createResourceHandlers(mockService);
      await handlers.getById(mockRequest as Request, mockResponse as Response, jest.fn());
      
      expect(mockService.getById).toHaveBeenCalledWith("123", {});
      expect(mockResponse.json).toHaveBeenCalledWith({ id: "123", name: "Test" });
    });

    it("should return 404 when resource not found", async () => {
      mockRequest.params = { id: "123" };
      mockService.getById.mockResolvedValue(null);
      
      const handlers = createResourceHandlers(mockService);
      await handlers.getById(mockRequest as Request, mockResponse as Response, jest.fn());
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Resource not found" });
    });
  });
});
