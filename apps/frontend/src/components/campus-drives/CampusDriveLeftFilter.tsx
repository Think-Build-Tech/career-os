"use client";

import { Box, Checkbox, Divider, Typography } from "@mui/material";
import { Check, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

type FilterOption = {
  id: string;
  name: string;
  count: number;
  checked: boolean;
};

type FilterGroup = {
  id: string;
  name: string;
  options: FilterOption[];
};

const filterGroups: FilterGroup[] = [
  {
    id: "opportunity",
    name: "Opportunity Type",
    options: [
      { id: "fte", name: "Full-Time FTE", count: 16, checked: true },
      { id: "internship", name: "6-Month Internship", count: 6, checked: true },
      { id: "ppo", name: "PPO Conversion", count: 2, checked: false },
    ],
  },
  {
    id: "compensation",
    name: "Compensation Tier",
    options: [
      { id: "super-dream", name: "Super Dream (>₹20L)", count: 8, checked: true },
      { id: "dream", name: "Dream (₹10 - ₹20L)", count: 11, checked: true },
      { id: "core", name: "Core Eng. (₹6 - ₹10L)", count: 5, checked: true },
    ],
  },
  {
    id: "cohort",
    name: "Target Cohort",
    options: [
      { id: "computer", name: "Computer Eng.", count: 22, checked: true },
      { id: "information-tech", name: "Information Tech", count: 19, checked: true },
      { id: "electronics", name: "Electronics & TC", count: 12, checked: false },
    ],
  },
  {
    id: "mode",
    name: "Drive Assessment Mode",
    options: [
      { id: "physical", name: "On-Campus Physical", count: 14, checked: true },
      { id: "virtual", name: "Virtual Proctored", count: 10, checked: true },
    ],
  },
  {
    id: "stage",
    name: "Drive Stage",
    options: [
      { id: "registering", name: "Registering Now", count: 12, checked: true },
      { id: "assessment", name: "Assessment Active", count: 5, checked: true },
      { id: "interview", name: "Interviews Underway", count: 4, checked: true },
    ],
  },
];

type CampusDriveLeftFilterProps = {
  onReset?: () => void;
};

const getInitialSelection = () =>
  Object.fromEntries(
    filterGroups.flatMap((group) =>
      group.options.map((option) => [option.id, option.checked]),
    ),
  );

export default function CampusDriveLeftFilter({ onReset }: CampusDriveLeftFilterProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>(getInitialSelection);

  const toggleOption = (id: string) => {
    setSelected((current) => ({ ...current, [id]: !current[id] }));
  };

  const resetFilters = () => {
    setSelected(getInitialSelection());
    onReset?.();
  };

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        border: "1px solid #F0EDF8",
        borderRadius: 2,
        boxShadow: "0 2px 12px rgba(40, 35, 80, 0.04)",
        boxSizing: "border-box",
        maxWidth: 220,
        p: 2,
        width: "100%",
      }}
    >
      <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ alignItems: "center", display: "flex", gap: 0.75 }}>
          <SlidersHorizontal size={15} strokeWidth={2.5} color="#3525CD" />
          <Typography sx={{ color: "#151A2E", fontSize: 13, fontWeight: 700 }}>
            Refine Drives
          </Typography>
        </Box>
        <Box
          component="button"
          onClick={resetFilters}
          sx={{
            bgcolor: "transparent",
            border: 0,
            color: "#3525CD",
            cursor: "pointer",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: 0.2,
            p: 0,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Reset All
        </Box>
      </Box>

      <Divider sx={{ borderColor: "#E9EAF5", my: 1.25 }} />

      {filterGroups.map((group, groupIndex) => (
        <Box key={group.id}>
          <Typography
            sx={{
              color: "#777587",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9,
              letterSpacing: 1.1,
              lineHeight: 1.2,
              mb: 0.6,
              textTransform: "uppercase",
            }}
          >
            {group.name}
          </Typography>

          <Box>
            {group.options.map((option) => (
              <Box key={option.id} sx={{ alignItems: "center", display: "flex", minHeight: 25 }}>
                <Checkbox
                  checked={Boolean(selected[option.id])}
                  checkedIcon={
                    <Box
                      sx={{
                        alignItems: "center",
                        bgcolor: "#0787F9",
                        borderRadius: 0.5,
                        color: "#FFFFFF",
                        display: "flex",
                        height: 14,
                        justifyContent: "center",
                        width: 14,
                      }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </Box>
                  }
                  disableRipple
                  icon={
                    <Box
                      sx={{
                        bgcolor: "#FFFFFF",
                        border: "1px solid #A3A3A3",
                        borderRadius: 0.5,
                        height: 14,
                        width: 14,
                      }}
                    />
                  }
                  onChange={() => toggleOption(option.id)}
                  slotProps={{ input: { "aria-label": option.name } }}
                  sx={{ flexShrink: 0, mr: 0.75, p: 0 }}
                />
                <Typography
                  sx={{
                    color: "#1F2937",
                    flex: 1,
                    fontSize: 11,
                    lineHeight: 1.25,
                    minWidth: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {option.name}
                </Typography>
                <Typography
                  sx={{
                    color: group.id === "stage" && option.id === "registering" ? "#007D73" : "#777587",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    lineHeight: 1.2,
                    ml: 0.75,
                  }}
                >
                  {option.count}
                </Typography>
              </Box>
            ))}
          </Box>

          {groupIndex < filterGroups.length - 1 && (
            <Divider sx={{ borderColor: "#E9EAF5", my: 1.1 }} />
          )}
        </Box>
      ))}

      <Box sx={{ bgcolor: "#F1F2FF", borderRadius: 1.5, mt: 1.3, p: 1.25 }}>
        <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              color: "#777587",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9,
              letterSpacing: 0.8,
              lineHeight: 1.2,
              textTransform: "uppercase",
            }}
          >
            Instant T&amp;P Sync
          </Typography>
          <Box sx={{ bgcolor: "#007D73", borderRadius: "50%", height: 7, width: 7 }} />
        </Box>
        <Typography sx={{ color: "#151A2E", fontSize: 11, fontWeight: 700, mt: 0.55 }}>
          Atharva Bhole
        </Typography>
        <Typography
          sx={{
            color: "#777587",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            mt: 0.35,
          }}
        >
          2021BTECP0012
        </Typography>
        <Box sx={{ alignItems: "end", display: "flex", justifyContent: "space-between", mt: 0.8 }}>
          <Typography
            sx={{
              color: "#777587",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9,
              lineHeight: 1.3,
            }}
          >
            Resume: v3.4 (AI
            <br />
            Verified)
          </Typography>
          <Box
            component="button"
            sx={{
              bgcolor: "transparent",
              border: 0,
              color: "#3525CD",
              cursor: "pointer",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9,
              p: 0,
            }}
          >
            Change
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
