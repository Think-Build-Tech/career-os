"use client";
import * as React from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Tooltip } from "@mui/material";
import { LayoutDashboard, Briefcase, FileText, UserCircle, Code2, Bot, Users, MessagesSquare, Settings, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const NAV_ITEMS = [
  { text: "Dashboard", icon: <LayoutDashboard size={20} />, active: true },
  { text: "Campus Drives & Jobs", icon: <Briefcase size={20} /> },
  { text: "Applications Tracker", icon: <FileText size={20} /> },
  { text: "Skills & Profile", icon: <UserCircle size={20} /> },
  { text: "Coding & Assessments", icon: <Code2 size={20} /> },
  { text: "AI Mock Interview", icon: <Bot size={20} /> },
  { text: "Mentorship & Alumni", icon: <Users size={20} /> },
  { text: "Community & Insights", icon: <MessagesSquare size={20} /> },
  { text: "Settings", icon: <Settings size={20} /> },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Box sx={{ width: collapsed ? 76 : 260, flexShrink: 0, height: "100vh", bgcolor: "#F8FAFC", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", transition: "width 220ms ease" }}>
      <Box sx={{ p: 2, minHeight: 80, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", gap: 1.5 }}>
        <Box sx={{ width: 32, height: 32, bgcolor: "#3525CD", borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
          <LayoutDashboard size={18} />
        </Box>
        {!collapsed && <Box sx={{ mr: "auto" }}>
          <Typography sx={{ fontWeight: 800, fontSize: "1.125rem", color: "#0F172A", lineHeight: 1.1 }}>
            CareerOS
          </Typography>
          <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748B", letterSpacing: "0.1em" }}>
            THINKBUILD INTELLIGENCE
          </Typography>
        </Box>}
        <IconButton
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((value) => !value)}
          size="small"
          sx={{ color: "#64748B" }}
        >
          {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
        </IconButton>
      </Box>

      {!collapsed && <Box sx={{ px: 2, mb: 2 }}>
        <Box sx={{ bgcolor: "white", p: 1.5, borderRadius: 2, border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#0F766E" }} />
              Active Campus
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>
              SITRC Autonomous
            </Typography>
          </Box>
          <Typography sx={{ color: "#94A3B8" }}>▼</Typography>
        </Box>
      </Box>}

      <List sx={{ px: collapsed ? 1 : 2, flex: 1, overflowY: "auto" }}>
        {NAV_ITEMS.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={collapsed ? item.text : ""} placement="right">
              <ListItemButton
                title={collapsed ? item.text : undefined}
                sx={{
                  borderRadius: 2,
                  bgcolor: item.active ? "#3525CD" : "transparent",
                  color: item.active ? "white" : "#475569",
                  justifyContent: collapsed ? "center" : "initial",
                  minHeight: 44,
                  px: collapsed ? 1 : 2,
                  "&:hover": {
                    bgcolor: item.active ? "#3525CD" : "#F1F5F9",
                  }
                }}
              >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText
                  disableTypography
                  primary={
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: item.active ? 600 : 500 }}>
                      {item.text}
                    </Typography>
                  }
                />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {!collapsed && <Box sx={{ p: 3, mt: "auto" }}>
        <Box sx={{ p: 2, bgcolor: "#EEF2FF", borderRadius: 2 }}>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#3525CD", display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
            Placement Node <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#0F766E" }} />
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#0F172A" }}>
            99.98% Operational
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#64748B" }}>
            SITRC Autonomous Campus
          </Typography>
        </Box>
      </Box>}
    </Box>
  );
}
