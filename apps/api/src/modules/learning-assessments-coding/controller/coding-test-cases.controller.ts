import { createResourceHandlers } from "../../../core/controller.utils";
import { CodingTestCases } from "../model/coding_test_cases.model";
import { CodingTestCasesService } from "../service/coding-test-cases.service";

const service = new CodingTestCasesService();
const handlers = createResourceHandlers<CodingTestCases>(service);

export const createCodingTestCases = handlers.create;
export const getCodingTestCasess = handlers.getAll;
export const getCodingTestCasesById = handlers.getById;
export const updateCodingTestCases = handlers.update;
export const deleteCodingTestCases = handlers.delete;
