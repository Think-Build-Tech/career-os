"use client";
import * as React from "react";
import { Box, Typography, SxProps } from "@mui/material";

export interface ProgressCardProps {
  title: string;
  percentage: number;
  color?: string;
  subtitle?: string;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  sx?: SxProps;
}

export function ProgressCard({ 
  title,
  percentage,
  color = "#3525CD",
  subtitle,
  description,
  footer,
  sx = {}
}: ProgressCardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2.5,
        bgcolor: "#F8FAFC",
        borderRadius: "16px",
        height: "100%",
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <Typography sx={{ fontWeight: 700, color: "#0F172A" }}>
          {title}
        </Typography>
        <Typography sx={{ fontWeight: 700, color }}>
          {percentage}%
        </Typography>
      </Box>

      <Box sx={{ width: "100%", height: 6, bgcolor: "#E2E8F0", borderRadius: 3, mb: 2, overflow: "hidden" }}>
        <Box sx={{ width: `${percentage}%`, height: "100%", bgcolor: color, borderRadius: 3 }} />
      </Box>

      {subtitle && (
        <Typography variant="overline" sx={{ color: "#64748B", fontWeight: 600, display: "block", mb: 0.5 }}>
          {subtitle}
        </Typography>
      )}
      
      {description && (
        <Typography variant="body2" sx={{ color: "#475569", mb: 2, lineHeight: 1.5 }}>
          {description}
        </Typography>
      )}

      <Box sx={{ mt: "auto", pt: 2 }}>
        {footer}
      </Box>
    </Box>
  );
}
