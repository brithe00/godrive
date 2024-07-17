import {
  Card,
  CardContent,
  Box,
  Divider,
  Typography,
  Chip,
  Avatar,
  Button,
} from "@mui/material";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { formatDuration } from "@/utils/utils";

import Link from "next/link";

import { styled } from "@mui/material/styles";

import dayjs from "dayjs";

import { Trip } from "@/types/types";

interface TripCardProps {
  trip: Trip;
  isFull: boolean;
}

const StyledCard = styled(Card)<{ isFull: boolean }>(({ theme, isFull }) => ({
  marginBottom: "1rem",
  transition: "all 0.3s ease",
  ...(isFull && {
    opacity: 0.6,
    filter: "grayscale(100%)",
    pointerEvents: "none",
    position: "relative",
    "&::after": {
      content: '"FULL"',
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) rotate(-45deg)",
      fontSize: "2rem",
      fontWeight: "bold",
      color: theme.palette.error.main,
      border: `2px solid ${theme.palette.error.main}`,
      padding: "0.5rem 1rem",
      borderRadius: "5px",
      pointerEvents: "none",
    },
  }),
}));

export default function TripCard({ trip, isFull }: TripCardProps) {
  return (
    <StyledCard isFull={isFull} sx={{ marginBottom: "1rem" }}>
      <CardContent>
        <Box
          sx={{
            width: "100%",
            display: "flex",
          }}
        >
          <Box
            sx={{
              width: "50%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Box>
                <Typography sx={{ fontWeight: "bold" }}>
                  {trip.startTime}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: "bold" }}>
                  {trip.startLocation}
                </Typography>
              </Box>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Box>
                <Typography>
                  {formatDuration(trip.estimatedDuration)}
                </Typography>
              </Box>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Box>
                <Typography sx={{ fontWeight: "bold" }}>
                  {trip.endTime}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: "bold" }}>
                  {trip.endLocation}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              width: "50%",
              display: "flex",
              alignItems: "end",
              flexDirection: "column",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: "bold", fontSize: "x-large" }}>
                {trip.price}€
              </Typography>
            </Box>
            <Box>
              <Chip
                label={trip.status}
                color="success"
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </CardContent>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 1,
        }}
      >
        <CalendarTodayIcon sx={{ fontSize: "small", mr: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
          {dayjs(trip.date).format("DD MMM YYYY")}
        </Typography>
      </Box>

      <Divider />

      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {trip.vehicleType === "bus" ? (
                <DirectionsBusIcon sx={{ mr: 1 }} />
              ) : (
                <DirectionsCarIcon sx={{ mr: 1 }} />
              )}

              <Avatar
                alt={trip.driver?.firstname}
                src={trip.driver?.pictureUrl}
              />
              <Typography
                sx={{ fontWeight: "bold", color: "text.secondary", ml: 1 }}
              >
                {trip.driver?.firstname}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon sx={{ mr: 1 }} />
              <Typography>
                {trip.passengers?.length} / {trip.numberOfPassengers} passengers
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isFull ? (
              <Chip label="FULL" color="error" size="small" />
            ) : (
              <Link href={`/trips/${trip.id}`} passHref>
                <Button variant="contained" color="primary" size="small">
                  Visit Trip
                </Button>
              </Link>
            )}
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
}
