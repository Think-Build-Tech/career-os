import { Card, CardContent, Typography } from "@mui/material";

export function DisplayCard() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    Display Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    This is a basic Material-UI card component.
                </Typography>
            </CardContent>
        </Card>
    );
}