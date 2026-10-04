"use client";
import * as React from "react";
import { Box, Typography } from "@mui/material";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

export function TextInput({ label, icon, rightIcon, onRightIconClick, ...props }: TextInputProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
      {label && (
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1E293B" }}>
          {label}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#F8FAFC",
          borderRadius: "12px",
          px: 2,
          py: 1.5,
          gap: 1.5,
          border: "1px solid #E2E8F0",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          "&:focus-within": {
            borderColor: "#3525CD",
            boxShadow: "0 0 0 2px rgba(53, 37, 205, 0.1)",
          },
        }}
      >
        {icon && (
          <Box sx={{ color: "#64748B", display: "flex", "& svg": { width: 20, height: 20 } }}>
            {icon}
          </Box>
        )}
        <input
          {...props}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: "0.875rem",
            color: "#1E293B",
            fontFamily: "inherit",
            ...props.style,
          }}
        />
        {rightIcon && (
          <Box
            onClick={onRightIconClick}
            sx={{
              color: "#94A3B8",
              display: "flex",
              cursor: onRightIconClick ? "pointer" : "default",
              "& svg": { width: 20, height: 20 },
              "&:hover": onRightIconClick ? { color: "#475569" } : {},
            }}
          >
            {rightIcon}
          </Box>
        )}
      </Box>
    </Box>
  );
}
