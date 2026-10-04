"use client";
import { Box, Typography } from "@mui/material";
import { FeatureCard } from "@repo/ui/feature-card";
import { Badge } from "@repo/ui/badge";
import { BrainCircuit, MonitorPlay, Users, ShieldCheck, Lock } from "lucide-react";

export function LoginSidebar() {
    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ width: 40, height: 40, bgcolor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }} />
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                        ThinkBuild CareerOS
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#3525CD', fontWeight: 700, letterSpacing: '0.1em' }}>
                        SITRC AUTONOMOUS EDITION
                    </Typography>
                </Box>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1.5, lineHeight: 1.2 }}>
                The Unified Autonomous Campus Placement & Career Operating System
            </Typography>
            
            <Typography variant="body1" sx={{ color: '#475569', mb: 3, maxWidth: '90%' }}>
                Connecting 1,420+ vetted engineering students with 80+ tier-1 enterprise recruiters, accredited by AICTE and NAAC.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, bgcolor: 'white', p: 2.5, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 600 }}>TIER-1 RECRUITERS</Typography>
                    <Typography variant="h4" sx={{ color: '#3525CD', fontWeight: 700 }}>84</Typography>
                    <Typography variant="caption" sx={{ color: '#0F766E', fontWeight: 600 }}>↗ 18 Active Drives</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 600 }}>STUDENT COHORT</Typography>
                    <Typography variant="h4" sx={{ color: '#0F172A', fontWeight: 700 }}>1,420+</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>Verified Profiles</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 600 }}>NIRF 3B SYNC</Typography>
                    <Typography variant="h4" sx={{ color: '#0F766E', fontWeight: 700 }}>99.8%</Typography>
                    <Typography variant="caption" sx={{ color: '#0F766E', fontWeight: 600 }}>Real-time Validated</Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                <FeatureCard 
                    icon={<BrainCircuit />} 
                    iconBgColor="#3525CD"
                    title="AI-Driven TPO Automation"
                    badge={<Badge variant="purple">SHA-256</Badge>}
                    description="Immutable SHA-256 placement offer verification and NIRF Form 3B synchronization with sovereign campus record vaults."
                />
                <FeatureCard 
                    icon={<MonitorPlay />} 
                    iconBgColor="#0F766E"
                    title="TACIE Proctored Assessment Studio"
                    badge={<Badge variant="success">Anti-Cheat v4.2</Badge>}
                    description="Enterprise-grade code evaluation with biometric anti-cheat integrity, automated static syntax audit, and behavioral telemetry."
                />
                <FeatureCard 
                    icon={<Users />} 
                    iconBgColor="#C2410C"
                    title="Lifelong Alumni Mentorship"
                    badge={<Badge variant="warning">92% Retention</Badge>}
                    description="Fast-track referral pipeline with 92% retention across top multinational corporations and alumni-led technical mock pods."
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Badge variant="success" icon={<ShieldCheck size={14} />} sx={{ bgcolor: 'white' }}>
                    SOC2 Type II Certified
                </Badge>
                <Badge variant="default" icon={<Lock size={14} />} sx={{ bgcolor: 'white' }}>
                    ISO 27001 Secured
                </Badge>
                <Badge variant="warning" sx={{ bgcolor: 'white' }}>
                    Registrar Root Encryption
                </Badge>
            </Box>
        </Box>
    );
}
export default LoginSidebar;
