"use client";
import { Box } from "@mui/material";
import { LoginCard } from "@/components/login/LoginCard";
import { LoginSidebar } from "@/components/login/LoginSidebar";

export default function LoginPage() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
            <Box sx={{ 
                flex: 1, 
                display: { xs: 'none', md: 'flex' }
            }}>
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '32px',
                    background: 'linear-gradient(135deg, #EEF2FF 0%, #E0F2FE 50%, #CCFBF1 100%)',
                    px: 6,
                    py: 2,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <LoginSidebar />
                </Box>
            </Box>
            
            <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                px: 2,
                py:1.5,
            }}>
                <LoginCard />
            </Box>
        </Box>
    );
}