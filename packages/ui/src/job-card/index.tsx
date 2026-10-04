"use client";
import * as React from "react";
import { Box, Typography, SxProps } from "@mui/material";

export interface JobCardProps {
  logo?: React.ReactNode;
  companyName: string;
  role: string;
  tags?: React.ReactNode[];
  details?: React.ReactNode[];
  action?: React.ReactNode;
  sx?: SxProps;
}

export function JobCard({ 
  logo,
  companyName,
  role,
  tags = [],
  details = [],
  action,
  sx = {}
}: JobCardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2.5,
        bgcolor: "white",
        borderRadius: "16px",
        border: "1px solid #F1F5F9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        gap: 3,
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            bgcolor: "#F8FAFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: "1px solid #E2E8F0"
          }}
        >
          {logo}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontWeight: 700, color: "#0F172A" }}>
              {companyName}
            </Typography>
            {tags.map((tag, i) => (
              <React.Fragment key={i}>{tag}</React.Fragment>
            ))}
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, color: "#64748B" }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: "#334155" }}>
              {role}
            </Typography>
            {details.map((detail, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "0.875rem" }}>
                {i > 0 && <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#CBD5E1" }} />}
                {detail}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      {action && (
        <Box sx={{ flexShrink: 0 }}>
          {action}
        </Box>
      )}
    </Box>
  );
}
