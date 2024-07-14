"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TRIP } from "@/graphql/queries/trip";
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
  DirectionsBus,
  Schedule,
  Timer,
} from "@mui/icons-material";

const UserCard = ({ user, role }) => (
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

export default function Trip() {
  const params = useParams();

  const me = useSelector((state) => state.user.currentUser);

  const { loading, data, error, refetch } = useQuery(GET_TRIP, {
    variables: { tripId: params?.id },
  });

  const [addPassenger] = useMutation(ADD_PASSENGER);
  const [removePassenger] = useMutation(REMOVE_PASSENGER);

  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const trip = data?.trip;

  const isUserOnTrip = trip?.passengers.some(
    (passenger) => passenger.id === me?.id
  );
  const isTripFull =
    trip?.passengers.length >= trip?.numberOfPassengers ||
    trip?.status === "fulled";
  const isUserDriver = trip?.driver.id === me?.id;

  const handleJoinLeaveTrip = async () => {
    setIsProcessing(true);
    try {
      if (isUserOnTrip) {
        const { data } = await removePassenger({
          variables: { tripId: params?.id },
        });
        setSnackbarMessage("You have left the trip.");
      } else {
        const { data } = await addPassenger({
          variables: { tripId: params?.id },
        });
        setSnackbarMessage("You have joined the trip.");
      }
      await refetch();
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
    }
    setIsProcessing(false);
  };

  return (
    <Container maxWidth="md">
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
                    <Avatar>
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
                    <Avatar>
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
                    <Avatar>
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
                    <Avatar>
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
                    <Avatar>
                      <AttachMoney />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Price" secondary={`${trip.price}€`} />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
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
                {trip.passengers.map((passenger) => (
                  <Grid item xs={12} sm={6} md={4} key={passenger.id}>
                    <UserCard user={passenger} role="Passenger" />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {!isUserDriver && (
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
