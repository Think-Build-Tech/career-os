import { Router } from "express";
import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  addContact,
  getRecruitmentVisits,
} from "./company.controller";

export const companyRouter = Router();

companyRouter.get("/", getAllCompanies);
companyRouter.post("/", createCompany);
companyRouter.get("/visits", getRecruitmentVisits);
companyRouter.post("/contacts", addContact);
companyRouter.get("/:id", getCompanyById);
companyRouter.put("/:id", updateCompany);

