import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  CardActionArea,
} from "@mui/material";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { GET_ALL_TRIPS_FOR_USER } from "@/graphql/queries/trip";

const TripCard = ({ trip, userId }) => (
  <Card sx={{ width: "100%", mb: 2 }}>
    <CardActionArea component={Link} href={`/trips/${trip.id}`}>
      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        <ListItem key={trip.id} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar
              alt={`${trip.driver.firstname} ${trip.driver.lastname}`}
              src={trip.driver.pictureUrl}
            />
          </ListItemAvatar>
          <ListItemText
            primary={`${trip.startLocation} to ${trip.endLocation}`}
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  {`${new Date(trip.date).toLocaleDateString()} | ${
                    trip.startTime
                  } - ${trip.endTime}`}
                </Typography>
                <br />
                {`Driver: ${trip.driver.firstname} ${trip.driver.lastname}`}
                <br />
                {`Price: $${trip.price} | Duration: ${trip.estimatedDuration}min`}
              </>
            }
          />
          <Chip
            icon={trip.driver.id === userId ? <DriveEtaIcon /> : <PersonIcon />}
            label={trip.driver.id === userId ? "Driver" : "Passenger"}
            color={trip.driver.id === userId ? "primary" : "secondary"}
          />
        </ListItem>
      </CardContent>
    </CardActionArea>
  </Card>
);

const TripsPage = () => {
  const me = useSelector((state) => state.user.currentUser);
  const [tabValue, setTabValue] = useState(0);
  const userId = me?.id;
  const { loading, error, data } = useQuery(GET_ALL_TRIPS_FOR_USER, {
    variables: { userId },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filterTrips = (type) => {
    if (!data?.allTripsForUser) return [];
    switch (type) {
      case "all":
        return data.allTripsForUser;
      case "asDriver":
        return data.allTripsForUser.filter((trip) => trip.driver.id === userId);
      case "asPassenger":
        return data.allTripsForUser.filter((trip) =>
          trip.passengers.some((passenger) => passenger.id === userId)
        );
      default:
        return [];
    }
  };

  return (
    <Container component="main" maxWidth="md">
      {error && (
        <Alert style={{ marginBottom: "1rem" }} severity="error">
          Error : {error.message}
        </Alert>
      )}

      {loading && <CircularProgress />}

      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            My Trips
          </Typography>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="All Trips" />
            <Tab label="As Driver" />
            <Tab label="As Passenger" />
          </Tabs>
          <List>
            {filterTrips(["all", "asDriver", "asPassenger"][tabValue])?.map(
              (trip) => (
                <TripCard key={trip.id} trip={trip} userId={userId} />
              )
            )}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TripsPage;
