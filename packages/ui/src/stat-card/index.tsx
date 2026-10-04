"use client";
import * as React from "react";
import { Box, Typography, SxProps } from "@mui/material";

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  tags?: React.ReactNode[];
  footerText?: React.ReactNode;
  sx?: SxProps;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  iconBgColor = "#F1F5F9", 
  iconColor = "#3525CD",
  tags = [], 
  footerText,
  sx = {} 
}: StatCardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2.5,
        bgcolor: "white",
        borderRadius: "16px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
        border: "1px solid #F1F5F9",
        minHeight: "140px",
        justifyContent: "space-between",
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: "#64748B", fontWeight: 600, display: "block", mb: 0.5, lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color: "#0F172A", fontWeight: 700, display: "flex", alignItems: "baseline", gap: 0.5 }}>
            {value}
          </Typography>
        </Box>
        {icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: iconBgColor,
              color: iconColor,
              flexShrink: 0,
              "& svg": { width: 18, height: 18 },
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "auto" }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {tags.map((tag, i) => (
            <React.Fragment key={i}>{tag}</React.Fragment>
          ))}
        </Box>
        {footerText && (
          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500 }}>
            {footerText}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
