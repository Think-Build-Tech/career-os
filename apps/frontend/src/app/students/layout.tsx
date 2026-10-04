"use client";
import * as React from "react";
import { Box } from "@mui/material";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: "#F8FAFC" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <Navbar />
        <Box sx={{ flex: 1, overflowY: "auto", p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
