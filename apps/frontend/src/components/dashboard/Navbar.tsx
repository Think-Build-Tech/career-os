"use client";
import * as React from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import { Search, Bell } from "lucide-react";
import { TextInput } from "@repo/ui/text-input";
import { Badge } from "@repo/ui/badge";

export function Navbar() {
  return (
    <Box sx={{ 
      height: 72, 
      borderBottom: "1px solid #E2E8F0", 
      bgcolor: "white", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between",
      px: 4
    }}>
      <Box sx={{ width: 400 }}>
        <TextInput 
          placeholder="Search job codes, assessment pipelines, target companies..."
          icon={<Search size={18} />}
          sx={{ bgcolor: "#F8FAFC", "& input": { py: 1 } }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Badge variant="success" sx={{ px: 2, py: 0.5 }}>
          <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#0F766E", mr: 1 }} />
          TACIE AI ACTIVE
        </Badge>
        
        <IconButton sx={{ position: "relative" }}>
          <Bell size={20} color="#475569" />
          <Box sx={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, bgcolor: "#EF4444", borderRadius: "50%", border: "2px solid white" }} />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
              Atharva Bhole
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500 }}>
              B.E. Comp • 2021BTECOMP012
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: "#F1F5F9", color: "#3525CD", fontWeight: 700, width: 40, height: 40 }}>
            AB
          </Avatar>
        </Box>
      </Box>
    </Box>
  );
}
