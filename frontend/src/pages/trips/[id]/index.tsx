"use client";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_TRIPS_FOR_USER, GET_TRIP } from "@/graphql/queries/trip";
import { ADD_PASSENGER, REMOVE_PASSENGER } from "@/graphql/mutations/trip";
import Link from "next/link";

import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Snackbar,
  Card,
  CardContent,
  CardActionArea,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  AccessTime,
  DirectionsCar,
  AttachMoney,
  Person,
  Schedule,
  Timer,
} from "@mui/icons-material";
import type { RootState, Trip, User } from "@/types/types";

interface UserCardProps {
  user: User | undefined;
  role: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, role }) => {
  if (!user) {
    return null;
  }

  return (
    <Card sx={{ maxWidth: 345, width: "100%", mb: 2 }}>
      <CardActionArea component={Link} href={`/users/${user.id}`}>
        <CardContent sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={user.pictureUrl} sx={{ width: 60, height: 60, mr: 2 }} />
          <div>
            <Typography variant="h6" component="div">
              {user.firstname} {user.lastname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {role}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default function Trip() {
  const params = useParams();

  const me = useSelector((state: RootState) => state.user.currentUser);

  const { loading, data, error, refetch } = useQuery<{ trip: Trip }>(GET_TRIP, {
    variables: { tripId: params?.id },
  });

  const [addPassenger] = useMutation(ADD_PASSENGER);
  const [removePassenger] = useMutation(REMOVE_PASSENGER);

  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const trip = data?.trip;

  const isUserOnTrip = trip?.passengers?.some(
    (passenger) => passenger.id === me?.id
  );

  const isTripFull = useMemo(() => {
    if (!trip) return false;

    const passengersCount = trip.passengers?.length ?? 0;
    const maxPassengers = trip.numberOfPassengers ?? Infinity;

    return passengersCount >= maxPassengers || trip.status === "fulled";
  }, [trip]);

  const isUserDriver = useMemo(() => {
    return trip?.driver?.id === me?.id;
  }, [trip, me]);

  const handleJoinLeaveTrip = async () => {
    setIsProcessing(true);
    try {
      if (isUserOnTrip) {
        const { data } = await removePassenger({
          variables: { tripId: params?.id },
          refetchQueries: [
            { query: GET_ALL_TRIPS_FOR_USER, variables: { userId: me?.id } },
          ],
        });
        setSnackbarMessage("You have left the trip.");
      } else {
        const { data } = await addPassenger({
          variables: { tripId: params?.id },
          refetchQueries: [
            { query: GET_ALL_TRIPS_FOR_USER, variables: { userId: me?.id } },
          ],
        });
        setSnackbarMessage("You have joined the trip.");
      }
      await refetch();
    } catch (error) {
      if (error instanceof Error) {
        setSnackbarMessage(`Error: ${error.message}`);
      } else {
        setSnackbarMessage("An unknown error occurred");
      }
    }
    setIsProcessing(false);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "-8rem" }}>
      {error && (
        <Alert style={{ marginBottom: "1rem" }} severity="error">
          Error : {error.message}
        </Alert>
      )}

      {loading && <CircularProgress />}
      {trip && (
        <Paper elevation={3} style={{ padding: "2rem", marginTop: "2rem" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                Trip from {trip.startLocation} to {trip.endLocation}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {new Date(trip.date).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Driver
              </Typography>
              <UserCard user={trip.driver} role="Driver" />
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6">Trip Details</Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#1E90FF", color: "white" }}>
                      <AccessTime />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Departure Time"
                    secondary={trip.startTime}
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#2ECC71", color: "white" }}>
                      <Timer />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Estimated Duration"
                    secondary={`${trip.estimatedDuration} minutes`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#FF6B35", color: "white" }}>
                      <Schedule />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Arrival Time"
                    secondary={trip.endTime}
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#8E44AD", color: "white" }}>
                      <DirectionsCar />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Vehicle"
                    secondary={`${trip.vehicleType}`}
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#FF6B6B", color: "white" }}>
                      <AttachMoney />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Price" secondary={`${trip.price}€`} />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#40E0D0", color: "white" }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Available Seats"
                    secondary={trip.numberOfPassengers}
                  />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Passengers
              </Typography>
              <Grid container spacing={2}>
                {trip?.passengers?.map((passenger) => (
                  <Grid item xs={12} sm={6} md={4} key={passenger.id}>
                    <UserCard user={passenger} role="Passenger" />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {trip && !isUserDriver && (
              <Grid item xs={12}>
                <Divider style={{ margin: "1rem 0" }} />
                <Button
                  variant="contained"
                  color={isUserOnTrip ? "secondary" : "primary"}
                  onClick={handleJoinLeaveTrip}
                  disabled={isProcessing || (!isUserOnTrip && isTripFull)}
                  fullWidth
                >
                  {isProcessing
                    ? "Processing..."
                    : isUserOnTrip
                    ? "Leave Trip"
                    : isTripFull
                    ? "Trip Full"
                    : "Join Trip"}
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage("")}
        message={snackbarMessage}
      />
    </Container>
  );
}
