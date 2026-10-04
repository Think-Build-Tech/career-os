"use client";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';

const CustomTooltip: React.ComponentType<TooltipProps> = styled(({ className, ...props }: TooltipProps & { className?: string }) => (
    // Pass the arrow prop by default for a nicer UI, and forward the rest
    <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#1E293B', // Slate 800 (Dark background)
        color: '#F8FAFC', // Slate 50 (Off-white text)
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        fontSize: '0.75rem',
        fontWeight: 500,
        borderRadius: '8px',
        padding: '8px 12px',
        letterSpacing: '0.02em',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#1E293B', // Must match the tooltip background color
    },
}));

export default CustomTooltip;