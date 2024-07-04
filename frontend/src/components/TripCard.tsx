import {
  Card,
  CardContent,
  Box,
  Divider,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

export default function TripCard({ trip }) {
  return (
    <>
      <Card sx={{ marginBottom: "1rem" }}>
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
                  <Typography>DUREE</Typography>
                </Box>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Box>
                  <Typography sx={{ fontWeight: "bold" }}>H ARRIVEE</Typography>
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

        <Box>
          <Divider />
        </Box>

        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                flexDirection: "",
              }}
            >
              <DirectionsCarIcon />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt={trip.driver.firstname}
                  src={trip.driver.pictureUrl}
                />
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "grey",
                    marginLeft: "0.5rem",
                  }}
                >
                  {trip.driver.firstname}
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
