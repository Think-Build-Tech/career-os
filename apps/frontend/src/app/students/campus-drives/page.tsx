import CampusDriveHeader from "@/components/campus-drives/CampusDriveHeader";
import CampusDriveJobCards from "@/components/campus-drives/CampusDriveJobCards";
import CampusDriveLeftFilter from "@/components/campus-drives/CampusDriveLeftFilter";
import CampusDriveStats from "@/components/campus-drives/CampusDriveStats";
import { Box } from "@mui/material";

export default function CampusDrives() {
    return (
        <Box sx={{ bgcolor: "#FAF8FF", display: "flex", flexDirection: "column", gap: 4, maxWidth: 1400, mx: "auto" }}>
            <CampusDriveHeader />
            <CampusDriveStats />
            <Box
                sx={{
                    alignItems: "start",
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", md: "220px minmax(0, 1fr)" },
                }}
            >
                <CampusDriveLeftFilter />
                <CampusDriveJobCards />
            </Box>
        </Box>
    );
}
