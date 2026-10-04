"use client";

import {
  Box,
  ButtonBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { ChevronDown, Check } from "lucide-react";
import { useState, type ReactNode } from "react";

export type SortFilterOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

export interface SortFilterDropdownProps {
  label?: string;
  options: SortFilterOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  startIcon?: ReactNode;
}

export function SortFilterDropdown({
  label = "Sort & filter",
  options,
  value,
  defaultValue,
  onChange,
  startIcon,
}: SortFilterDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const selectedValue = value ?? internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue);

  const handleSelect = (nextValue: string) => {
    setInternalValue(nextValue);
    onChange?.(nextValue);
    setAnchorEl(null);
  };

  return (
    <Box>
      <ButtonBase
        id="sort-filter-button"
        aria-controls={anchorEl ? "sort-filter-menu" : undefined}
        aria-expanded={anchorEl ? "true" : undefined}
        aria-haspopup="menu"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minHeight: 44,
          px: 1.5,
          border: "1px solid #E2E8F0",
          borderRadius: 2,
          bgcolor: "#FFFFFF",
          color: "#1E293B",
          fontFamily: "inherit",
          "&:hover": { bgcolor: "#F8FAFC" },
        }}
      >
        {startIcon && <Box sx={{ display: "flex", color: "#64748B" }}>{startIcon}</Box>}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Typography sx={{ color: "#64748B", fontSize: 11, lineHeight: 1.2 }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
            {selectedOption?.label ?? "Select option"}
          </Typography>
        </Box>
        <ChevronDown size={17} aria-hidden="true" />
      </ButtonBase>

      <Menu
        id="sort-filter-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{ "aria-labelledby": "sort-filter-button" }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === selectedValue}
            onClick={() => handleSelect(option.value)}
          >
            {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
            <Typography sx={{ flex: 1, fontSize: 14 }}>{option.label}</Typography>
            {option.value === selectedValue && <Check size={16} aria-hidden="true" />}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default SortFilterDropdown;
