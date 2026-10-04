"use client";
import * as React from "react";
import { Box, Typography, SxProps } from "@mui/material";

export interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "default" | "error" | "purple";
  sx?: SxProps;
}

export function Badge({ children, icon, variant = "default", sx = {} }: BadgeProps) {
  const getColors = () => {
    switch (variant) {
      case "primary":
        return { bg: "primary.light", color: "primary.main" };
      case "success":
        return { bg: "#CCFBF1", color: "#0F766E" }; // Tailwind teal-100/700
      case "warning":
        return { bg: "#FFEDD5", color: "#C2410C" }; // Tailwind orange-100/700
      case "purple":
        return { bg: "#F3E8FF", color: "#6B21A8" }; // Tailwind purple-100/700
      case "error":
        return { bg: "#FEE2E2", color: "#B91C1C" }; // Tailwind red-100/700
      default:
        return { bg: "#F1F5F9", color: "#475569" }; // Tailwind slate-100/600
    }
  };

  const colors = getColors();

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        bgcolor: colors.bg,
        color: colors.color,
        px: 1,
        py: 0.25,
        borderRadius: "16px",
        fontSize: "0.75rem",
        fontWeight: 600,
        fontFamily: '"JetBrains Mono", monospace',
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        ...sx,
      }}
    >
      {icon && (
        <Box sx={{ display: "flex", alignItems: "center", "& svg": { width: 12, height: 12 } }}>
          {icon}
        </Box>
      )}
      {children}
    </Box>
  );
}
