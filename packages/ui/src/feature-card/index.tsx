"use client";
import * as React from "react";
import { Box, Typography, SxProps } from "@mui/material";

export interface FeatureCardProps {
  icon: React.ReactNode;
  iconBgColor?: string;
  title: string;
  badge?: React.ReactNode;
  description: string;
  sx?: SxProps;
}

export function FeatureCard({ icon, iconBgColor = "#E0E7FF", title, badge, description, sx = {} }: FeatureCardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: 2.5,
        bgcolor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(8px)",
        borderRadius: "16px",
        boxShadow: "0 4px 24px -4px rgba(0,0,0,0.02)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 32px -4px rgba(0,0,0,0.04)",
        },
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 48,
          borderRadius: "12px",
          bgcolor: iconBgColor,
          color: "white",
          flexShrink: 0,
          "& svg": { width: 24, height: 24 },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E293B" }}>
            {title}
          </Typography>
          {badge}
        </Box>
        <Typography variant="body2" sx={{ color: "#64748B", lineHeight: 1.6 }}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
}
