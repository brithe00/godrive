import { Card, Typography, CardContent, CardActions, Box } from "@mui/material";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import dayjs from "dayjs";

export default function TripCardUser({ trip }) {
  return (
    <Card>
      <CardContent sx={{ paddingBottom: "2px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography>{trip.startLocation}</Typography>
          <ArrowDownwardIcon />
          <Typography>{trip.endLocation}</Typography>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: "center",
          paddingTop: "0",
        }}
      >
        <Typography variant="body2">
          {dayjs(trip.date).format("DD-MM-YYYY")}
        </Typography>
      </CardActions>
    </Card>
  );
}
