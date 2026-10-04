"use client";

import { Box, Button, Typography } from "@mui/material";
import {
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Eye,
  FileCode2,
  MapPin,
  Send,
  Sparkles,
  UsersRound,
} from "lucide-react";

type Drive = {
  id: string;
  company: string;
  role: string;
  logo: string;
  logoColor: string;
  logoBg: string;
  tier: "SUPER DREAM" | "DREAM";
  ctc: string;
  mode: string;
  base: string;
  stack: string;
  locations: string;
  eligibility: string;
  rounds: string[];
  description: string;
  primaryAction: string;
  secondaryAction: string;
  primaryIcon: "apply" | "interview" | "track" | "prep";
  secondaryIcon: "syllabus" | "view" | "referral" | "prep";
  status?: string;
};

const drives: Drive[] = [
  {
    id: "google",
    company: "Google India",
    role: "Software Engineer",
    logo: "G",
    logoColor: "#4285F4",
    logoBg: "#EEF4FF",
    tier: "SUPER DREAM",
    ctc: "₹32.0",
    mode: "Full-Time FTE",
    base: "₹24.0 LPA CTC",
    stack: "Stacks: VLO (4 yrs)",
    locations: "Bengaluru / Hyderabad",
    eligibility: "Eligibility CGPA 8.0+ · Engg/IT (2025)",
    rounds: ["Google Online Assessment", "DSA", "System Design"],
    description: "Build reliable systems and developer tools at global scale.",
    primaryAction: "Apply Now (1 Click Prep)",
    secondaryAction: "View Full Syllabus",
    primaryIcon: "apply",
    secondaryIcon: "syllabus",
  },
  {
    id: "microsoft",
    company: "Microsoft India (IDC)",
    role: "Software Engineer",
    logo: "MS",
    logoColor: "#4F46E5",
    logoBg: "#EEF0FF",
    tier: "SUPER DREAM",
    ctc: "₹28.5",
    mode: "Full-Time + PPO",
    base: "₹21.0 LPA CTC",
    stack: "Base: ₹21.0 LPA · Stacks: 920,000 USD",
    locations: "Bengaluru / Noida",
    eligibility: "Eligibility CGPA 8.0+ · CSE & Engg (2025)",
    rounds: ["Online Assessment", "Technical Round 1", "Technical Round 2"],
    description: "Microsoft IDC engineering track for campus super-dream talent.",
    primaryAction: "Book Interview Slot",
    secondaryAction: "View Prep",
    primaryIcon: "interview",
    secondaryIcon: "view",
    status: "Slot Selection Active for Round 2 · Tomorrow 09:00",
  },
  {
    id: "atlassian",
    company: "Atlassian",
    role: "Associate Software Engineer",
    logo: "At",
    logoColor: "#4F46E5",
    logoBg: "#EEF0FF",
    tier: "SUPER DREAM",
    ctc: "₹26.0",
    mode: "Full-Time FTE",
    base: "₹19.5 LPA CTC",
    stack: "Base: ₹15.0 LPA · RSUs: 11.6L",
    locations: "Remote First / Bengaluru Hub",
    eligibility: "Eligibility CGPA 7.5+ · All Branches (2025)",
    rounds: ["Code Test", "System Design", "Values & Culture"],
    description: "Create simple, powerful tools for distributed teams.",
    primaryAction: "Apply Now",
    secondaryAction: "Request Alumni Referral",
    primaryIcon: "apply",
    secondaryIcon: "referral",
  },
  {
    id: "barclays",
    company: "Barclays Global Service Centre",
    role: "Graduate Technology Analyst",
    logo: "BAR",
    logoColor: "#4F46E5",
    logoBg: "#EEF0FF",
    tier: "DREAM",
    ctc: "₹16.0",
    mode: "Full-Time FTE",
    base: "₹12.0 LPA CTC",
    stack: "Location: 500K USD",
    locations: "Pune / Noida",
    eligibility: "Eligibility CGPA 7.0+ · CSE & ECE (2025)",
    rounds: ["Online Assessment", "Technical Interview", "HR Round"],
    description: "Technology roles supporting global financial services.",
    primaryAction: "View Application Track",
    secondaryAction: "Interview Prep Module",
    primaryIcon: "track",
    secondaryIcon: "prep",
    status: "Assessment Cleared",
  },
];

const monoSx = {
  color: "#777587",
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 11,
  letterSpacing: 0.15,
};

function ActionIcon({ type }: { type: Drive["primaryIcon"] | Drive["secondaryIcon"] }) {
  const props = { size: 14, strokeWidth: 2.2 };

  switch (type) {
    case "apply":
      return <Send {...props} />;
    case "interview":
      return <CalendarDays {...props} />;
    case "track":
      return <Eye {...props} />;
    case "prep":
      return <BookOpenCheck {...props} />;
    case "syllabus":
      return <FileCode2 {...props} />;
    case "view":
      return <Eye {...props} />;
    case "referral":
      return <UsersRound {...props} />;
  }
}

function DriveCard({ drive }: { drive: Drive }) {
  return (
    <Box
      component="article"
      sx={{
        bgcolor: "#FFFFFF",
        border: "1px solid #F0EDF8",
        borderRadius: 1.5,
        boxShadow: "0 2px 12px rgba(40, 35, 80, 0.04)",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        p: 2,
      }}
    >
      <Box sx={{ alignItems: "flex-start", display: "flex", gap: 1, justifyContent: "space-between" }}>
        <Box sx={{ alignItems: "center", display: "flex", gap: 0.75, minWidth: 0 }}>
          <Box
            sx={{
              alignItems: "center",
              bgcolor: drive.logoBg,
              borderRadius: 1,
              color: drive.logoColor,
              display: "flex",
              flexShrink: 0,
              fontSize: drive.logo.length > 2 ? 11 : 17,
              fontWeight: 800,
              height: 38,
              justifyContent: "center",
              letterSpacing: -0.4,
              width: 38,
            }}
          >
            {drive.logo}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ alignItems: "center", display: "flex", gap: 0.35 }}>
              <Typography sx={{ color: "#151A2E", fontSize: 15, fontWeight: 700, lineHeight: 1.15 }}>
                {drive.company}
              </Typography>
              <BadgeCheck color="#007D73" size={11} strokeWidth={2.5} />
            </Box>
            <Typography sx={{ color: "#777587", fontSize: 12, lineHeight: 1.2, mt: 0.35 }}>
              {drive.role}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: drive.tier === "SUPER DREAM" ? "#E2DFFF" : "#D6F0EC",
            borderRadius: 0.75,
            color: drive.tier === "SUPER DREAM" ? "#3525CD" : "#007D73",
            flexShrink: 0,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 0.35,
            lineHeight: 1.1,
            px: 0.7,
            py: 0.45,
            textAlign: "center",
          }}
        >
          {drive.tier}
        </Box>
      </Box>

      <Box sx={{ alignItems: "baseline", display: "flex", justifyContent: "space-between", mt: 1.5 }}>
        <Typography sx={{ color: "#151A2E", fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
          {drive.ctc} <Box component="span" sx={{ color: "#464555", fontSize: 12, fontWeight: 500 }}>LPA CTC</Box>
        </Typography>
        <Typography sx={{ ...monoSx, color: "#464555", fontSize: 10 }}>{drive.mode}</Typography>
      </Box>

      <Typography sx={{ ...monoSx, fontSize: 10, mt: 0.75 }}>{drive.base}</Typography>
      <Typography sx={{ ...monoSx, fontSize: 10, mt: 0.2 }}>{drive.stack}</Typography>

      <Box sx={{ alignItems: "center", display: "flex", gap: 0.35, mt: 0.85 }}>
        <MapPin color="#777587" size={12} />
        <Typography sx={{ ...monoSx, color: "#464555", fontSize: 10 }}>{drive.locations}</Typography>
      </Box>
      <Box sx={{ alignSelf: "flex-start", bgcolor: "#D6F0EC", borderRadius: 0.75, color: "#007D73", maxWidth: "100%", mt: 0.75, px: 0.85, py: 0.5, width: "fit-content" }}>
        <Typography sx={{ fontSize: 10, fontWeight: 600, lineHeight: 1.25 }}>{drive.eligibility}</Typography>
      </Box>

      <Typography sx={{ ...monoSx, color: "#777587", fontSize: 10, letterSpacing: 0.8, mt: 1.25, textTransform: "uppercase" }}>
        Hiring pipeline ({drive.rounds.length} rounds)
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.4, mt: 0.45 }}>
        {drive.rounds.map((round) => (
          <Box key={round} sx={{ bgcolor: "#EEF0FF", borderRadius: 0.5, color: "#464555", px: 0.55, py: 0.35 }}>
          <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5, lineHeight: 1.1 }}>{round}</Typography>
          </Box>
        ))}
      </Box>

      <Typography sx={{ color: "#777587", fontSize: 10, lineHeight: 1.3, mt: 0.8 }}>
        {drive.description}
      </Typography>

      {drive.status && (
        <Box sx={{ alignItems: "center", bgcolor: drive.id === "barclays" ? "#D6F0EC" : "#E2E7FF", borderRadius: 0.75, color: drive.id === "barclays" ? "#007D73" : "#3525CD", display: "flex", gap: 0.45, mt: 0.75, px: 0.7, py: 0.5 }}>
          {drive.id === "barclays" ? <CheckCircle2 size={10} /> : <Sparkles size={10} />}
          <Typography sx={{ fontSize: 10, fontWeight: 700, lineHeight: 1.25 }}>{drive.status}</Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 0.75, mt: "auto", pt: 1.25 }}>
        <Button
          startIcon={<ActionIcon type={drive.secondaryIcon} />}
          sx={{
            bgcolor: drive.id === "google" || drive.id === "atlassian" ? "transparent" : "#E2E7FF",
            color: drive.id === "google" || drive.id === "atlassian" ? "#3525CD" : "#151A2E",
            fontSize: 10,
            justifyContent: "center",
            minHeight: 34,
            minWidth: 0,
            px: 0.8,
            textTransform: "none",
            whiteSpace: "nowrap",
            flex: 1,
            "& .MuiButton-startIcon": { mr: 0.35 },
            "&:hover": { bgcolor: "#EEF0FF" },
          }}
        >
          {drive.secondaryAction}
        </Button>
        <Button
          startIcon={<ActionIcon type={drive.primaryIcon} />}
          sx={{
            bgcolor: "#3525CD",
            borderRadius: 0.75,
            color: "#FFFFFF",
            fontSize: 10,
            justifyContent: "center",
            minHeight: 34,
            minWidth: 0,
            px: 0.8,
            textTransform: "none",
            whiteSpace: "nowrap",
            flex: 1,
            "& .MuiButton-startIcon": { mr: 0.35 },
            "&:hover": { bgcolor: "#2B20A8" },
          }}
        >
          {drive.primaryAction}
        </Button>
      </Box>
    </Box>
  );
}

export default function CampusDriveJobCards() {
  return (
    <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>
      {drives.map((drive) => (
        <DriveCard drive={drive} key={drive.id} />
      ))}
    </Box>
  );
}
