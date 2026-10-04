"use client";
import * as React from "react";
import { Box, Typography, SxProps } from "@mui/material";

export interface TimelineItemProps {
  dateInfo?: React.ReactNode;
  timeInfo?: React.ReactNode;
  tag?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  sx?: SxProps;
}

export function TimelineItem({ 
  dateInfo,
  timeInfo,
  tag,
  title,
  subtitle,
  sx = {}
}: TimelineItemProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        bgcolor: "#F8FAFC",
        borderRadius: "12px",
        mb: 2,
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {dateInfo && (
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#3525CD" }}>
              {dateInfo}
            </Typography>
          )}
          {dateInfo && timeInfo && (
            <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#CBD5E1" }} />
          )}
          {timeInfo && (
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B" }}>
              {timeInfo}
            </Typography>
          )}
        </Box>
        {tag && <Box>{tag}</Box>}
      </Box>

      <Typography sx={{ fontWeight: 700, color: "#0F172A", mb: 0.5, lineHeight: 1.3 }}>
        {title}
      </Typography>

      {subtitle && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748B", fontSize: "0.875rem" }}>
          {subtitle}
        </Box>
      )}
    </Box>
  );
}
