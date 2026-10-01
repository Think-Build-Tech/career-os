import { create } from "zustand";
import type { JobApplication, Workspace } from "@repo/types";

type CareerOSState = {
  workspace: Workspace;
  applications: JobApplication[];
  setWorkspace: (workspace: Workspace) => void;
  addApplication: (application: JobApplication) => void;
};

export const useCareerOSStore = create<CareerOSState>((set) => ({
  workspace: { id: "personal", name: "Personal workspace" },
  applications: [
    {
      id: "job-1",
      company: "Northstar Labs",
      role: "Product Designer",
      status: "interview",
      appliedAt: "2026-09-18",
    },
  ],
  setWorkspace: (workspace) => set({ workspace }),
  addApplication: (application) =>
    set((state) => ({ applications: [...state.applications, application] })),
}));

export type { CareerOSState };