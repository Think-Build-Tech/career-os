"use client";
import { Box, Typography, Button, Checkbox, FormControlLabel, Divider } from "@mui/material";
import { Selector } from "@repo/ui/selector";
import { TextInput } from "@repo/ui/text-input";
import { Badge } from "@repo/ui/badge";
import { Mail, Lock, Eye, Building2 } from "lucide-react";
import { useState } from "react";
import { sanitizeInput } from "@/utils/sanitizeSql.util";
// Adjust this import path to where you saved the CustomTooltip component
import CustomTooltip from "../common/customTooltip"; 

export function LoginCard() {
    const [userEmail, setUserEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSelectedSSO, setIsSelectedSSO] = useState<boolean>(false);
    return (
        <Box sx={{
            bgcolor: "white", 
            width: '100%',
            maxWidth: 500,
            borderRadius: '24px',
            p: 4,
            boxShadow: '0 20px 40px -12px rgba(0,0,0,0.05)'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="overline" sx={{ color: '#3525CD', fontWeight: 700, letterSpacing: '0.1em' }}>
                    INSTITUTIONAL GATEWAY
                </Typography>
                <Badge variant="warning" sx={{ bgcolor: 'transparent', color: '#D97706' }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#D97706', display: 'inline-block', mr: 1 }} />
                    SSO Coming Soon
                </Badge>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5 }}>
                Sign in to your Institutional Portal
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                Select your role or sign in with your SITRC Autonomous credentials.
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Selector />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                <TextInput
                    label="PRN / Institutional Email"
                    placeholder="2021btecomp012@sitrc.edu.in"
                    icon={<Mail />}
                    onChange={(e)=> setUserEmail(sanitizeInput(e.target.value))}
                />
                <TextInput
                    label="Campus Security Password"
                    placeholder="••••••••••••••"
                    type="password"
                    icon={<Lock />}
                    rightIcon={<Eye />}
                    onChange={(e)=> setPassword(sanitizeInput(e.target.value))}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel 
                    control={<Checkbox size="small" sx={{ color: '#CBD5E1', '&.Mui-checked': { color: '#3525CD' } }} />} 
                    label={<Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>Keep me authenticated for 30 days</Typography>} 
                    onChange={(e)=> setIsSelectedSSO(!isSelectedSSO)}
                    value={isSelectedSSO}
                />
                <Typography variant="body2" sx={{ color: '#3525CD', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                    Forgot Password or PRN?
                </Typography>
            </Box>

            <Button
                fullWidth
                variant="contained"
                sx={{
                    py: 1.5,
                    bgcolor: '#3525CD',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '12px',
                    mb: 3,
                    boxShadow: '0 4px 14px 0 rgba(53, 37, 205, 0.39)',
                    '&:hover': {
                        bgcolor: '#2B1ACD',
                        boxShadow: '0 6px 20px rgba(53, 37, 205, 0.23)'
                    }
                }}
            >
                Sign In to CareerOS →
            </Button>

            <Divider sx={{ mb: 3, color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                OR SIGN IN WITH SSO
            </Divider>

            {/* Tooltip wrapping the disabled button */}
            <CustomTooltip 
                title="Integration with Microsoft & Google is currently under maintenance. Please use your PRN." 
                placement="top"
            >
                <Box component="span" sx={{ width: '100%', display: 'block', mb: 3, cursor: 'not-allowed' }}>
                    <Button
                        fullWidth
                        disabled
                        variant="outlined"
                        startIcon={<Building2 size={18} />}
                        sx={{
                            py: 1.5,
                            bgcolor: '#F8FAFC',
                            borderColor: 'transparent',
                            color: '#1E293B',
                            fontWeight: 600,
                            borderRadius: '12px',
                            '&.Mui-disabled': {
                                bgcolor: '#F1F5F9',
                                color: '#94A3B8',
                                borderColor: 'transparent',
                                pointerEvents: 'none' // The Box wrapper handles the pointer events now
                            }
                        }}
                    >
                        Sign In with Microsoft / Google (Coming Soon)
                    </Button>
                </Box>
            </CustomTooltip>

            <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: '12px', mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'flex', gap: 1 }}>
                    <Box component="span" sx={{ color: '#0F766E' }}>Shield</Box>
                    By continuing, you agree to SITRC Autonomous Placement Policy and AICTE Code of Fair Recruitment Practices. Unauthorized access is recorded via telemetry.
                </Typography>
            </Box>

            <Typography variant="caption" align="center" sx={{ display: 'block', color: '#64748B' }}>
                Need technical help? Contact SITRC TPO Helpdesk: <Box component="span" sx={{ color: '#3525CD', fontWeight: 600 }}>tpo@sitrc.edu.in</Box>
            </Typography>
        </Box>
    );
}

export default LoginCard;