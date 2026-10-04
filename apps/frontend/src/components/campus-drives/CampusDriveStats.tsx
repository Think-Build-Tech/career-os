import { Box, Typography } from "@mui/material";
import { Building2, ClipboardCheck, Send, TrendingUp } from "lucide-react";
import DashboardCard from "@repo/ui/dashboard-card";

const mutedPanelSx = {
  bgcolor: "#F1F2FF",
  borderRadius: 1.5,
  px: 2,
  py: 1.5,
};

const monoSx = {
  color: "#777587",
  fontFamily: "var(--font-inter)",
  fontSize: 15,
  letterSpacing: 0.4,
};

const panelLabelSx = {
  color: "#464555",
  fontFamily: "var(--font-inter)",
  fontSize: 13,
  lineHeight: 1.25,
};

export default function CampusDriveStats() {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)", xl: "repeat(4, 1fr)" },
      }}
    >
      <DashboardCard
        title="Total active drives"
        value="24"
        icon={<Building2 />}
      >
        <Box sx={{ ...mutedPanelSx, minHeight: 88, boxSizing: "border-box" }}>
          <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ ...monoSx, color: "#464555", fontSize: 14 }}>8 Super Dream</Typography>
            <Typography sx={{ color: "#3525CD", fontSize: 14, fontWeight: 700 }}>33%</Typography>
          </Box>
          <Typography sx={{ ...panelLabelSx, mt: 0.25 }}>( &gt;20L )</Typography>
          <Box sx={{ bgcolor: "#DCE2FF", borderRadius: 99, height: 7, mt: 1 }}>
            <Box sx={{ bgcolor: "#3525CD", borderRadius: 99, height: "100%", width: "33%" }} />
          </Box>
          <Typography sx={{ ...monoSx, fontSize: 13, mt: 0.75 }}>11 Dream · 5 Core Eng.</Typography>
        </Box>
      </DashboardCard>

      <DashboardCard
        title="Eligible for you"
        value={<><Box component="span" sx={{ color: "#007D73" }}>18</Box><Box component="span" sx={{ color: "#464555", fontSize: 28, fontWeight: 400 }}> / 24</Box></>}
        icon={<ClipboardCheck />}
        iconBgColor="#A9F0E8"
        iconColor="#007D73"
      >
        <Box sx={{ ...mutedPanelSx, alignItems: "center", boxSizing: "border-box", display: "flex", gap: 1.5, justifyContent: "space-between", minHeight: 88 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: "#151A2E", fontSize: 14, fontWeight: 700, lineHeight: 1.25, whiteSpace: "nowrap" }}>
              Criteria Matched
            </Typography>
            <Typography sx={{ ...monoSx, fontSize: 13, lineHeight: 1.35, mt: 0.5, whiteSpace: "nowrap" }}>
              CGPA 8.94 · 0
            </Typography>
            <Typography sx={{ ...monoSx, fontSize: 13, lineHeight: 1.35, whiteSpace: "nowrap" }}>
              Live Backlogs
            </Typography>
          </Box>
          <Box sx={{ alignItems: "center", bgcolor: "#8CE7DD", borderRadius: 1.5, color: "#006A63", display: "flex", flexDirection: "column", flexShrink: 0, minWidth: 72, px: 1.25, py: 1, textAlign: "center" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.1 }}>75.0%</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2, mt: 0.35 }}>Pass</Typography>
          </Box>
        </Box>
      </DashboardCard>

      <DashboardCard
        title={<>Applications<br />submitted</>}
        value="6"
        icon={<Send />}
      >
        <Box sx={{ ...mutedPanelSx, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 1.5 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: "#151A2E", fontSize: 16, fontWeight: 700, lineHeight: 1.2, justifyContent: 'center', display: 'flex' }}>
              1
            </Typography>
            <Typography sx={{ color: "#464555", fontSize: 13, lineHeight: 1.25, mt: 0.5, whiteSpace: "nowrap", justifyContent: 'center', display: 'flex' }}>
              Offered
            </Typography>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: "#151A2E", fontSize: 16, fontWeight: 700, lineHeight: 1.2, display: 'flex', justifyContent: 'center' }}>3</Typography>
            <Typography sx={{ color: "#777587", fontSize: 13, lineHeight: 1.25, mt: 0.5, whiteSpace: "nowrap", display: 'flex', justifyContent: 'center' }}>
              In Progress
            </Typography>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: "#151A2E", fontSize: 16, fontWeight: 700, lineHeight: 1.2, display: 'flex', justifyContent: 'center' }}>2</Typography>
            <Typography sx={{ color: "#777587", fontSize: 13, lineHeight: 1.25, mt: 0.5, whiteSpace: "nowrap", display: 'flex', justifyContent: 'center' }}>
              In Review
            </Typography>
          </Box>
        </Box>
      </DashboardCard>

      <DashboardCard
        title="Cohort average CTC"
        value={<><Box component="span">₹18.4</Box><Box component="span" sx={{ color: "#464555", fontSize: 28, fontWeight: 400 }}> LPA</Box></>}
        icon={<TrendingUp />}
      >
        <Box sx={{ ...mutedPanelSx, alignItems: "center", boxSizing: "border-box", display: "flex", justifyContent: "space-between", minHeight: 88 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ ...monoSx, color: "#464555", fontSize: 13 }}>Median CTC:</Typography>
            <Typography sx={{ color: "#151A2E", fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 600, mt: 0.25, whiteSpace: "nowrap" }}>₹15.0 LPA</Typography>
          </Box>
          <Typography sx={{ color: "#007D73", fontSize: 14, fontWeight: 700, lineHeight: 1.25, textAlign: "right" }}>↑ 22.4%<br />YoY</Typography>
        </Box>
      </DashboardCard>
    </Box>
  );
}
