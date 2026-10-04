import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

export interface DashboardCardProps {
    title: ReactNode;
    value: ReactNode;
    icon?: ReactNode;
    iconBgColor?: string;
    iconColor?: string;
    children?: ReactNode;
    sx?: SxProps<Theme>;
}

export default function DashboardCard({
    title,
    value,
    icon,
    iconBgColor = "#E2DFFF",
    iconColor = "#3525CD",
    children,
    sx,
}: DashboardCardProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 3,
                bgcolor: "#FFFFFF",
                border: "1px solid #F0EDF8",
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(40, 35, 80, 0.04)",
                ...sx,
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            color: "#777587",
                            fontFamily: "var(--font-inter)",
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: 1.5,
                            lineHeight: 1.35,
                            textTransform: "uppercase",
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        sx={{
                            color: "#151A2E",
                            fontFamily: "var(--font-inter)",
                            fontSize: 48,
                            fontWeight: 700,
                            lineHeight: 1.1,
                            mt: 1,
                        }}
                    >
                        {value}
                    </Typography>
                </Box>
                {icon && (
                    <Box
                        sx={{
                            alignItems: "center",
                            bgcolor: iconBgColor,
                            borderRadius: 1.5,
                            color: iconColor,
                            display: "flex",
                            flexShrink: 0,
                            height: 58,
                            justifyContent: "center",
                            width: 58,
                            "& svg": { height: 27, width: 27 },
                        }}
                    >
                        {icon}
                    </Box>
                )}
            </Box>
            {children && <Box sx={{ mt: 2 }}>{children}</Box>}
        </Box>
    );
}