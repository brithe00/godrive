import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Tabs,
  Tab,
  List,
  Box,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  CardActionArea,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { GET_ALL_TRIPS_FOR_USER } from "@/graphql/queries/trip";
import { RootState, Trip } from "@/types/types";

interface TripCardProps {
  trip: Trip;
  userId: string | undefined;
}

const TripCard: React.FC<TripCardProps> = ({ trip, userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        width: "100%",
        mb: 3,
        boxShadow:
          "0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow:
            "0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.15)",
        },
        borderRadius: "8px",
        overflow: "visible",
      }}
    >
      <CardActionArea component={Link} href={`/trips/${trip.id}`}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                component="img"
                src={trip?.driver?.pictureUrl}
                alt={`${trip?.driver?.firstname} ${trip?.driver?.lastname}`}
                sx={{ width: 50, height: 50, borderRadius: "50%", mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{`${trip.startLocation} to ${trip.endLocation}`}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {`${new Date(trip.date).toLocaleDateString()} | ${
                    trip.startTime
                  } - ${trip.endTime}`}
                </Typography>
              </Box>
              <Box sx={{ ml: 2 }}>
                <Chip
                  icon={
                    trip?.driver?.id === userId ? (
                      <DriveEtaIcon />
                    ) : (
                      <PersonIcon />
                    )
                  }
                  label={trip?.driver?.id === userId ? "Driver" : "Passenger"}
                  color={trip?.driver?.id === userId ? "primary" : "secondary"}
                  size={isMobile ? "small" : "medium"}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="body2" sx={{ mb: isMobile ? 1 : 0 }}>
                {`Driver: ${trip?.driver?.firstname} ${trip?.driver?.lastname}`}
              </Typography>
              <Typography variant="body2">
                {`Price: $${trip.price} | Duration: ${trip.estimatedDuration}min`}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const TripsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const me = useSelector((state: RootState) => state.user.currentUser);
  const [tabValue, setTabValue] = useState(0);
  const userId = me?.id;
  const { loading, error, data } = useQuery(GET_ALL_TRIPS_FOR_USER, {
    variables: { userId },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filterTrips = (type: "all" | "asDriver" | "asPassenger"): Trip[] => {
    if (!data?.allTripsForUser) return [];
    switch (type) {
      case "all":
        return data.allTripsForUser;
      case "asDriver":
        return data.allTripsForUser.filter(
          (trip: Trip) => trip?.driver?.id === userId
        );
      case "asPassenger":
        return data.allTripsForUser.filter((trip: Trip) =>
          trip?.passengers?.some((passenger) => passenger.id === userId)
        );
      default:
        return [];
    }
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ py: { xs: 2, sm: 3, md: 4 } }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error.message}
        </Alert>
      )}

      <Card
        sx={{
          boxShadow:
            "0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            My Trips
          </Typography>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ mb: 2 }}
          >
            <Tab label="All Trips" />
            <Tab label="As Driver" />
            <Tab label="As Passenger" />
          </Tabs>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filterTrips(
                ["all", "asDriver", "asPassenger"][tabValue] as
                  | "all"
                  | "asDriver"
                  | "asPassenger"
              ).length === 0 ? (
                <Typography sx={{ textAlign: "center", my: 2 }}>
                  No trips found.
                </Typography>
              ) : (
                filterTrips(
                  ["all", "asDriver", "asPassenger"][tabValue] as
                    | "all"
                    | "asDriver"
                    | "asPassenger"
                ).map((trip) => (
                  <TripCard key={trip.id} trip={trip} userId={userId} />
                ))
              )}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default TripsPage;
