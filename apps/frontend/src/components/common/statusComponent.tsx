import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type StatusComponentProps = {
    status: ReactNode;
};

export default function StatusComponent({ status }: StatusComponentProps) {
    return (
        <Box component="span">
            <Typography
                component="span"
                sx={{
                    display: "inline-block",
                    borderRadius: 1,
                    px: 1,
                    py: 0.25,
                    color: "#006A63",
                    bgcolor: "#DDF5F1",
                    fontSize: 14,
                    fontWeight: 600,
                }}
            >
                {status}
            </Typography>
        </Box>
    );
}