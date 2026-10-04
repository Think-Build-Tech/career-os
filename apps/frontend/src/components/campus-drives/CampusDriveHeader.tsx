import { Box, Typography } from "@mui/material";
import { TextInput } from "@repo/ui/text-input";
import { SortFilterDropdown } from "@repo/ui/sort-filter-dropdown";
import { BellRing, CalendarDays, CircleCheck, ListFilter, Search, ShieldCheck } from "lucide-react";

export default function CampusDriveHeader() {
  const currentYear = new Date().getFullYear();
  const sessionString = `${currentYear}–${currentYear + 1}`;
  const eligibleCount = 18;
  const alertCount = 3;
  const verifiedCgpa = 8.7;
  return (
    <Box sx={{ display: "flex", p:0, flexDirection: "column", gap: 6, fontFamily: "var(--font-inter)", }}>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
        {/* Status & Session Badge */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-inter)",
            fontSize: 11,
            fontWeight: 600,
            bgcolor: "#E2DFFF",
            color: "#3F37C9",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            letterSpacing: 0.5,
          }}
        >
          T&P PLACEMENT CELL VERIFIED
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <svg
            width="6"
            height="6"
            viewBox="0 0 6 6"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="3" cy="3" r="3" fill="#006A63" />
          </svg>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "#006A63",
              fontFamily: "var(--font-inter)",
            }}
          >
            Session {sessionString}
          </Typography>
        </Box>
      </Box>

      {/* Main Title Section */}
      <Box sx={{ mt: 0.5, display: "flex", flexDirection: "row", gap: 10 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontSize: 32, fontWeight: 700, color: "#1A1A1A" }}
          >
            Campus Placement Drives &
            <br /> Corporate Openings
          </Typography>
          <Typography>
            Explore vetted campus recruitment drives, off-campus referrals, and
            exclusive
            <br />
            internships curated for SITRC Autonomous engineering cohorts.
          </Typography>
        </Box>
        {/* Util Btns */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              bgcolor: "#E2E7FF",
              px: 2,
              py: 1,
              borderRadius: 1,
              cursor: 'pointer',
              alignItems: "center",
              alignSelf: "flex-start",
              width: "fit-content",
              textAlign: "center",
              transition: "background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
              "&:hover": {
                bgcolor: "#D6F0EC",
                boxShadow: "0 4px 12px rgba(0, 106, 99, 0.14)",
                transform: "translateY(-1px)",
              },
            }}
          >
            <CircleCheck style={{ color: "#006A63" }} height={18} width={18} />
            <Typography
              sx={{
                display: "flex",
                textAlign: "center",
                alignItems: "center",
                fontWeight: 500,
                gap: 1,
                
                fontSize: 14,
              }}
            >
              Only show eligible{" "}
              <Typography
                sx={{
                  bgcolor: "white",
                  px: 0.4,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#464555",
                }}
              >
                {eligibleCount}
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                bgcolor: "white",
                
                gap: 1,
                cursor: 'pointer',
                px: 2,
                py: 1,
                borderRadius: 1,
                alignItems: "center",
                textAlign: "center",
                transition: "background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
                "&:hover": {
                  bgcolor: "#F3F5FF",
                  boxShadow: "0 4px 12px rgba(53, 37, 205, 0.12)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <CalendarDays
                height={18}
                width={18}
                style={{ color: "#777587" }}
              />
              <Typography
                sx={{
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  fontWeight: 500,
                  gap: 1,
                  fontSize: 14,
                }}
              >
                Export Calendar (.ics)
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                bgcolor: "white",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 1,
                alignItems: "center",
                textAlign: "center",
                cursor: "pointer",
                transition: "background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
                "&:hover": {
                  bgcolor: "#F3F5FF",
                  boxShadow: "0 4px 12px rgba(53, 37, 205, 0.12)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <BellRing
                height={18}
                width={18}
                style={{ color: "#3525CD" }}
                strokeWidth={2.5}
              />
              <Typography
                sx={{
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  fontWeight: 500,
                  gap: 1,
                  fontSize: 14,
                }}
              >
                Drive Alerts
              </Typography>
              <Typography
                sx={{
                  bgcolor: "#BA1A1A",
                  color: "#FFFFFF",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-inter)",
                  fontSize: 12,
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                {alertCount}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      </Box>

      {/* Search, Sort and Filter */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextInput
            placeholder="Search job codes, assessment pipelines, target companies..."
            icon={<Search size={18} />}
          />
        </Box>
        <SortFilterDropdown
          startIcon={<ListFilter size={17} />}
          defaultValue="newest"
          options={[
            { value: "ctc-low", label: "CTC: Low to High" },
            { value: "ctc-high", label: "CTC: High to Low" },
            {value: "ascending", label: "Alphabetical (A-Z)"},
            {value: "descending", label: "Alphabetical (Z-A)"},
            { value: "newest", label: "Newest First" },
          ]}
        />
          <Box sx={{display: 'flex', alignItems: 'center', gap: 2, bgcolor: "white", border: "1px solid #E2E8F0", borderRadius: 1, shadow: 10, p:1}}>
            <ShieldCheck size={17} style={{color: "#3525CD"}} />
            <Typography sx={{fontFamily: '"Jetbrains Mono", "monospace"', fontSize: 12}}>Verified CGPA: {verifiedCgpa}</Typography>
          </Box>
      </Box>
      
    </Box>
  );
}
