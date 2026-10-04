import { Box, Button, Container, Stack, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", py: { xs: 6, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3} sx={{ maxWidth: 720 }}>
          <Typography color="primary" variant="overline" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
            ThinkBuild CareerOS
          </Typography>
          <Typography component="h1" sx={{ fontSize: { xs: "2.75rem", md: "4.5rem" }, fontWeight: 800, lineHeight: 1.05 }}>
            Career operations, made clear.
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 600, fontSize: "1.2rem" }}>
            The new Next.js frontend is ready for authentication, institute workspaces, and role-based career workflows.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button href="/login" size="large" variant="contained">
              Sign in
            </Button>
            <Button href="/dashboard" size="large" variant="outlined">
              Open workspace
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
