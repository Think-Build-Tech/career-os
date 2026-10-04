"use client";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

const sampleOptions = [
    "Student",
    "Recruiter",
    "TPO Admin",
    "Alumni"
];

export interface SelectorProps {
    options?: string[];
    onSelect?: (option: string) => void;
}

export function Selector({ options = sampleOptions, onSelect }: SelectorProps) {
    const [selectedOption, setSelectedOption] = useState(options[0]);
    
    return(
        <Box sx={{
            display: 'flex',
            bgcolor: '#F1F5F9', // slate-100
            p: '4px',
            borderRadius: '12px',
            width: '100%',
        }}>
            {options.map((option: string) => (
                <Box 
                    key={option}
                    onClick={() => {
                        setSelectedOption(option);
                        if (onSelect) onSelect(option);
                    }}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 1,
                        cursor: 'pointer',
                        bgcolor: selectedOption === option ? '#FFFFFF' : 'transparent',
                        borderRadius: '8px',
                        boxShadow: selectedOption === option ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <Typography sx={{
                        fontSize: '0.875rem', 
                        fontWeight: selectedOption === option ? 600 : 500,
                        color: selectedOption === option ? '#1E293B' : '#64748B',
                        fontFamily: '"JetBrains Mono", monospace'
                    }}>
                        {option}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}
export default Selector;