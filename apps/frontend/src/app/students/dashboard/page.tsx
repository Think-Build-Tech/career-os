"use client";
import * as React from "react";
import { Box, Typography, Button, Grid, IconButton, Avatar } from "@mui/material";
import { Badge } from "@repo/ui/badge";
import { StatCard } from "@repo/ui/stat-card";
import { JobCard } from "@repo/ui/job-card";
import { ProgressCard } from "@repo/ui/progress-card";
import { TimelineItem } from "@repo/ui/timeline-item";
import { GraduationCap, Briefcase, Rocket, TerminalSquare, ChevronRight, Lock, Code2, AlertTriangle, MonitorPlay, FileText, CheckCircle2, Bot } from "lucide-react";
import StatusComponent from "@/components/common/statusComponent";

export default function StudentDashboard() {
  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
      
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", m: 0 }}>
              Welcome back,
              <br />Atharva!
            </Typography>
            <Badge variant="success" sx={{ px: 1.5, py: 0.5, borderRadius: "20px" }}>
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#0F766E", mr: 1 }} />
              Autonomous<br/>Vetted
            </Badge>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500 }}>
              B.E. Computer Engineering • Class of 2025 •
            </Typography>
            <Badge sx={{ bgcolor: "#E2E8F0", color: "#1E293B", borderRadius: 1 }}>COMP-012</Badge>
          </Box>
          <Typography variant="body2" sx={{ color: "#0F766E", fontWeight: 600, mt: 1 }}>
            Placement Cell Eligibility: 100% Verified
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700 }}>TACIE AI INDEX</Typography>
              <Typography sx={{ fontSize: "1.25rem", color: "#3525CD", fontWeight: 800, display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#3525CD" }} />
                94%
              </Typography>
            </Box>
            <Box sx={{ borderLeft: "1px solid #E2E8F0", pl: 2, textAlign: "right" }}>
              <Typography sx={{ fontSize: "0.875rem", color: "#64748B", fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
                <Briefcase size={16} color="#C2410C" /> Active Offers <Box component="span" sx={{ color: "#C2410C" }}>(1)</Box>
              </Typography>
            </Box>
          </Box>
          <Button variant="contained" sx={{ bgcolor: "#3525CD", color: "white", borderRadius: "8px", fontWeight: 600, px: 3 }}>
            Verified Dossier (PDF)
          </Button>
        </Box>
      </Box>

      {/* Stats Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        <Box>
          <StatCard
            title="CUMULATIVE CGPA"
            value={<>8.94 <Typography component="span" sx={{ fontSize: "1rem", color: "#94A3B8" }}>/ 10.0</Typography></>}
            icon={<GraduationCap />}
            iconBgColor="#EEF2FF"
            tags={[<Badge key="1" variant="success" sx={{ borderRadius: "4px" }}>Top 5% Cohort</Badge>]}
            footerText="0 Active Backlogs"
          />
        </Box>
        <Box>
          <StatCard
            title="PLACEMENT STATUS"
            value={<Typography><StatusComponent status={"Tier 1"} /> - Offer 1</Typography>}
            icon={<Briefcase />}
            iconBgColor="#CCFBF1"
            iconColor="#0F766E"
            tags={[<Typography key="1" sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#1E293B" }}>Amazon SDE-1<br/><Box component="span" sx={{color:"#64748B"}}>₹22.0 LPA CTC</Box></Typography>]}
            footerText={<Badge variant="purple" sx={{ borderRadius: "4px" }}>PPO Secured</Badge>}
          />
        </Box>
        <Box>
          <StatCard
            title="APPLICATIONS IN-FLIGHT"
            value={<>4 <Typography component="span" sx={{ fontSize: "1rem", color: "#64748B", fontWeight: 500 }}>Active Pipelines</Typography></>}
            icon={<Rocket />}
            iconBgColor="#F3E8FF"
            iconColor="#6B21A8"
            tags={[
              <Badge key="1" sx={{ borderRadius: "4px" }}>2 Tech Rounds</Badge>,
              <Badge key="2" sx={{ borderRadius: "4px" }}>1 OA</Badge>,
              <Badge key="3" sx={{ borderRadius: "4px" }}>1 Triage</Badge>
            ]}
          />
        </Box>
        <Box>
          <StatCard
            title="TACIE CODESCORE™"
            value={<>94 <Typography component="span" sx={{ fontSize: "1rem", color: "#94A3B8" }}>/ 100</Typography></>}
            icon={<TerminalSquare />}
            iconBgColor="#EEF2FF"
            tags={[<Badge key="1" variant="success" sx={{ borderRadius: "4px", display: "flex", flexDirection: "column", alignItems: "flex-start", py: 0.5 }}><Box>+14%</Box><Box>↗ Batch Lead</Box></Badge>]}
            footerText={<Box sx={{ textAlign: "right" }}>LeetCode:<br/>Top 2.1%</Box>}
          />
        </Box>
      </Box>

      {/* Banner */}
      <Box sx={{ 
        bgcolor: "#3525CD", 
        color: "white", 
        borderRadius: "16px", 
        p: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 10px 25px -5px rgba(53, 37, 205, 0.4)",
        backgroundImage: "radial-gradient(circle at top right, #4F46E5 0%, #3525CD 100%)"
      }}>
        <Box>
          <Badge sx={{ bgcolor: "#A5B4FC", color: "#1E3A8A", mb: 1, fontWeight: 700 }}>TOMORROW • 10:00 AM IST</Badge>
          <Typography sx={{ fontSize: "0.65rem", letterSpacing: "0.1em", fontWeight: 700, opacity: 0.8, display: "inline-block", ml: 2 }}>MS-IND-ENG-BR2</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Final Bar Raiser: Microsoft IDC</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Campus Super Dream Drive • ₹28.5 LPA CTC • Hyderabad / Bengaluru
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button sx={{ bgcolor: "white", color: "#3525CD", fontWeight: 700, borderRadius: "8px", "&:hover": { bgcolor: "#F8FAFC" } }} startIcon={<Code2 size={18} />}>
            Launch Practice IDE
          </Button>
          <Button sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)", fontWeight: 600, borderRadius: "8px", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }} startIcon={<FileText size={18} />}>
            System Design Rubric
          </Button>
        </Box>
      </Box>

      {/* Main Content Layout */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Left Column */}
        <Box>
          
          {/* Recommended Drives */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 1 }}>
                  Recommended & High-Match Drives <Badge variant="purple">3 Drives</Badge>
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Calibrated automatically from your verified coursework, LeetCode signals, and academic standing.
                </Typography>
              </Box>
              <Typography sx={{ color: "#3525CD", fontWeight: 600, fontSize: "0.875rem", display: "flex", alignItems: "center", cursor: "pointer" }}>
                Browse All (14) <ChevronRight size={16} />
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <JobCard
                logo={<Typography sx={{ fontWeight: 800, color: "#3525CD", fontSize: "1.25rem" }}>G</Typography>}
                companyName="Google India"
                role="SDE-1 (Cloud Core Engineering)"
                tags={[<Badge key="1" variant="success">98% TACIE Fit</Badge>, <Typography key="2" sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500 }}>Full-Time / FTE</Typography>]}
                details={[
                  <Typography key="1" sx={{ color: "#3525CD", fontWeight: 700, fontSize: "0.875rem" }}>₹32.0 LPA CTC</Typography>,
                  <Typography key="2" sx={{ color: "#C2410C", fontWeight: 600, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 0.5 }}><AlertTriangle size={14} /> Deadline in 2 Days</Typography>
                ]}
                action={<Button variant="contained" sx={{ bgcolor: "#3525CD", borderRadius: "8px", fontWeight: 600 }}>One-Click Apply ⚡</Button>}
              />
              <JobCard
                logo={<Typography sx={{ fontWeight: 800, color: "#0F766E", fontSize: "1.25rem" }}>A</Typography>}
                companyName="Atlassian"
                role="Associate Software Engineer"
                tags={[<Badge key="1" variant="success">95% TACIE Fit</Badge>, <Typography key="2" sx={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500 }}>Early Career</Typography>]}
                details={[
                  <Typography key="1" sx={{ color: "#3525CD", fontWeight: 700, fontSize: "0.875rem" }}>₹26.0 - 34.0 LPA</Typography>,
                  <Typography key="2" sx={{ color: "#64748B", fontWeight: 500, fontSize: "0.875rem" }}>Deadline in 4 Days</Typography>
                ]}
                action={<Button variant="contained" sx={{ bgcolor: "#E2E8F0", color: "#1E293B", borderRadius: "8px", fontWeight: 600, boxShadow: "none" }}>Direct Apply ↗</Button>}
              />
              <JobCard
                logo={<Typography sx={{ fontWeight: 800, color: "#475569", fontSize: "1.25rem" }}>B</Typography>}
                companyName="Barclays Global Service Centre"
                role="Graduate Software Developer"
                tags={[<Badge key="1" sx={{ bgcolor: "#E2E8F0" }}>92% TACIE Fit</Badge>]}
                details={[
                  <Typography key="1" sx={{ color: "#3525CD", fontWeight: 700, fontSize: "0.875rem" }}>₹16.0 LPA CTC</Typography>,
                  <Typography key="2" sx={{ color: "#64748B", fontWeight: 500, fontSize: "0.875rem" }}>Deadline in 6 Days</Typography>
                ]}
                action={<Button disabled variant="contained" sx={{ bgcolor: "#F1F5F9", color: "#0F766E !important", borderRadius: "8px", fontWeight: 600 }} startIcon={<CheckCircle2 size={16}/>}>Applied (Triage)</Button>}
              />
            </Box>
          </Box>

          {/* Autonomous Readiness & Skill Gap Matrix */}
          <Box sx={{ mb: 4, bgcolor: "white", p: 3, borderRadius: "24px", border: "1px solid #F1F5F9" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>Autonomous Readiness & Skill Gap Matrix</Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>Real-time benchmark against Tier-1 autonomous hiring rubrics (Google L3 / Microsoft SDE-1 standards).</Typography>
              </Box>
              <Badge variant="purple" sx={{ py: 1 }}>AI Synchronized</Badge>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              <Box>
                <ProgressCard
                  title="DSA Mastery"
                  percentage={94}
                  color="#0F766E"
                  subtitle="Strongest Facets:"
                  description="Advanced Dynamic Programming, Graph Traversal, Tries"
                  footer={<Typography sx={{ color: "#0F766E", fontWeight: 600, fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 0.5 }}><CheckCircle2 size={14}/> Campus Dream Ready</Typography>}
                />
              </Box>
              <Box>
                <ProgressCard
                  title="Concurrency & OS"
                  percentage={88}
                  color="#3525CD"
                  subtitle="Evaluated Facets:"
                  description="Raft consensus basics, Mutex & Thread Safety in Go/C++"
                  footer={<Typography sx={{ color: "#3525CD", fontWeight: 600, fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 0.5 }}>⚡ Good Competency</Typography>}
                />
              </Box>
              <Box>
                <ProgressCard
                  title="System Design"
                  percentage={62}
                  color="#C2410C"
                  subtitle="TACIE Recommendation:"
                  description={<Typography sx={{ color: "#C2410C", fontSize: "0.875rem", fontWeight: 500 }}>Practice Distributed Rate Limiter & Sharding Strategies</Typography>}
                  footer={<Typography sx={{ color: "#3525CD", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer" }}>Start Rate-Limiter Drill →</Typography>}
                  sx={{ bgcolor: "#FFF7ED" }}
                />
              </Box>
            </Box>

            {/* Batch Distribution (Mock) */}
            <Box sx={{ mt: 3, p: 3, bgcolor: "#F8FAFC", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: "#0F172A", mb: 0.5 }}>Autonomous Batch Percentile Distribution</Typography>
                <Typography sx={{ fontSize: "0.875rem", color: "#64748B", maxWidth: 300 }}>
                  You are ranking in the <Box component="span" sx={{ color: "#3525CD", fontWeight: 600 }}>97th percentile</Box> across 420 autonomous campus candidates in Nashik division.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Typography sx={{ fontSize: "0.75rem", color: "#64748B", display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#3525CD" }} /> Atharva
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "#64748B", display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#CBD5E1" }} /> Campus Median
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: "2px", height: 60 }}>
                {/* Mock Chart Bars */}
                {[10, 15, 20, 15, 25, 30, 45, 20, 15, 60, 15].map((h, i) => (
                  <Box key={i} sx={{ width: 6, height: h, bgcolor: i === 9 ? "#3525CD" : "#E2E8F0", borderRadius: "4px 4px 0 0" }} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Column */}
        <Box>
          
          {/* Proctored Schedule */}
          <Box sx={{ bgcolor: "white", borderRadius: "24px", p: 3, mb: 3, border: "1px solid #F1F5F9" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 1 }}>
                <MonitorPlay size={20} color="#3525CD" /> Proctored Schedule
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 600, textAlign: "right" }}>IST<br/>Timezone</Typography>
            </Box>

            <TimelineItem
              dateInfo="Tomorrow"
              timeInfo="10:00 AM"
              tag={<Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#C2410C" }}>Round 2</Typography>}
              title="Microsoft IDC Technical Bar Raiser"
              subtitle={<><MonitorPlay size={14} /> Proctored IDE + Live Teams Panel</>}
              sx={{ bgcolor: "#EEF2FF", border: "1px solid #E0E7FF" }}
            />
            <TimelineItem
              dateInfo="Oct 21"
              timeInfo="02:00 PM"
              tag={<Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#3525CD" }}>90 Mins OA</Typography>}
              title="Codility OA for Google Campus Drive"
              subtitle={<><FileText size={14} /> 3 Algorithm & Matrix Problems</>}
            />
            <TimelineItem
              dateInfo="Oct 22"
              timeInfo="06:30 PM"
              tag={<Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#0F766E" }}>1:1 Mentorship</Typography>}
              title="Session with Devendra Joshi"
              subtitle={
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <Avatar sx={{ width: 16, height: 16, fontSize: "0.5rem" }}>DJ</Avatar>
                  <Box>Amazon AWS SDE • Career Guidance</Box>
                </Box>
              }
            />
            <Button fullWidth sx={{ mt: 1, color: "#3525CD", fontWeight: 600 }}>Sync with Google / Outlook Calendar ↺</Button>
          </Box>

          {/* AI Insight */}
          <Box sx={{ bgcolor: "white", borderRadius: "24px", p: 3, mb: 3, border: "1px solid #F1F5F9" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "#CCFBF1", color: "#0F766E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={20} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748B", letterSpacing: "0.1em" }}>TACIE INTELLIGENCE</Typography>
                <Typography sx={{ fontWeight: 800, color: "#0F172A" }}>Daily AI Insight</Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6, mb: 3 }}>
              "Your concurrency and thread synchronisation answers in yesterday's mock interview scored <Box component="span" sx={{ fontWeight: 700, color: "#0F172A" }}>89%</Box>. Review sliding window rate-limiting algorithms to push past the <Box component="span" sx={{ color: "#3525CD", fontWeight: 600 }}>95% threshold</Box> required for Microsoft Bar Raiser."
            </Typography>
            <Button fullWidth variant="contained" sx={{ bgcolor: "#3525CD", borderRadius: "8px", fontWeight: 600, py: 1.5 }} startIcon={<MonitorPlay size={16}/>}>
              Start 15-Min Quick AI Drill
            </Button>
          </Box>

          {/* Autonomous Registry */}
          <Box sx={{ bgcolor: "#F8FAFC", borderRadius: "16px", p: 3, border: "1px solid #E2E8F0" }}>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CheckCircle2 size={16} color="#0F766E" /> Autonomous Placement Registry
            </Typography>
            <Box sx={{ bgcolor: "white", p: 1.5, borderRadius: "8px", border: "1px dashed #CBD5E1", mb: 2, fontFamily: '"JetBrains Mono", monospace', fontSize: "0.65rem", color: "#64748B", wordBreak: "break-all" }}>
              SHA256: 8a7f0c2d1b4e0682d001f4c3a2909408dbca3091c9f
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography sx={{ fontSize: "0.65rem", color: "#64748B", fontWeight: 600 }}>AICTE Compliance</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#0F172A", fontWeight: 700 }}>Grade: A++</Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: "0.65rem", color: "#64748B", fontWeight: 600 }}>SITRC Autonomous</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#0F172A", fontWeight: 700 }}>Exam Cell</Typography>
              </Box>
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
