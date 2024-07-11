"use client";

import { useParams } from "next/navigation";

import { useQuery } from "@apollo/client";
import { GET_USER } from "@/graphql/queries/user";

import {
  Alert,
  Avatar,
  Container,
  Card,
  Typography,
  Button,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Box,
  Divider,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import dayjs from "dayjs";
import { GET_REVIEWS_BY_ID } from "@/graphql/queries/review";
import { GET_TRIPS_FOR_USER } from "@/graphql/queries/trip";

import Link from "next/link";

import { styled } from "@mui/system";
import TripCardUser from "@/components/TripCardUser";
import ReviewCardUser from "@/components/ReviewCardUser";

const StyledLink = styled("a")({
  textDecoration: "none",
  color: "inherit",
});

// f97cb263-60a4-4d50-afed-df7d29d289e4

export default function User() {
  const params = useParams();

  const { loading, data, error, refetch } = useQuery(GET_USER, {
    variables: { getUserByIdId: params?.id },
  });

  const {
    loading: loadingTrips,
    data: dataTrips,
    error: errorTrips,
    refetch: refectTrips,
  } = useQuery(GET_TRIPS_FOR_USER, {
    variables: { userId: params?.id },
    fetchPolicy: "cache-and-network",
  });

  const {
    loading: loadingReviews,
    data: dataReviews,
    error: errorReviews,
    refetch: refetchReviews,
  } = useQuery(GET_REVIEWS_BY_ID, {
    variables: { userId: params?.id },
    fetchPolicy: "cache-and-network",
  });

  const userInfos = data?.getUserById;
  const trips = dataTrips?.tripsForUser;
  const reviews = dataReviews?.reviewsForUser;

  const calculateAge = (birthdate) => {
    const birthDate = dayjs(birthdate);
    const today = dayjs();
    return today.diff(birthDate, "year");
  };

  const calculateAverageRating = (reviews) => {
    const totalReviews = reviews?.length;

    if (totalReviews === 0) {
      return 0;
    }

    const sumOfRatings = reviews?.reduce(
      (acc, review) => acc + review?.rating,
      0
    );
    const averageRating = sumOfRatings / totalReviews;

    return averageRating.toFixed(2);
  };

  return (
    <>
      <Container component="main" maxWidth="md">
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12}>
            {(loading || loadingTrips || loadingReviews) && (
              <CircularProgress />
            )}
            {(error || errorTrips || errorReviews) && (
              <Alert severity="error">
                Error:
                {error?.message || errorTrips?.message || errorReviews?.message}
              </Alert>
            )}
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            {userInfos && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Avatar
                      alt={userInfos.firstname}
                      src={userInfos.pictureUrl}
                      sx={{ width: 70, height: 70 }}
                    />
                  </Box>
                  <Box pl={2}>
                    <Typography variant="h5">{userInfos.firstname}</Typography>
                    <Typography variant="body2">
                      {calculateAge(userInfos.birthdate)} years old
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    mt={2}
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 5,
                    }}
                  >
                    {userInfos.description}
                  </Typography>
                </Box>

                <Box>
                  <Grid container spacing={2} mt={0.5}>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography variant="h5">Trips published</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "end" }}>
                          <DirectionsCarIcon
                            sx={{
                              width: 30,
                              height: 30,
                            }}
                          />

                          <Typography> - {trips?.length} trips</Typography>
                        </Box>
                      </Box>

                      <Grid container spacing={2} mt={0.5}>
                        {trips?.map((trip) => (
                          <Grid item xs={3} key={trip.id}>
                            <StyledLink href={`/trips/${trip.id}`} passHref>
                              <TripCardUser trip={trip} />
                            </StyledLink>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider />
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography variant="h5">Reviews</Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "end" }}>
                          <StarIcon
                            sx={{
                              width: 30,
                              height: 30,
                            }}
                          />

                          <Typography>
                            {calculateAverageRating(reviews)}/5 -{" "}
                            {reviews?.length} reviews
                          </Typography>
                        </Box>
                      </Box>

                      <Grid container spacing={2} mt={0.5}>
                        {reviews?.map((review) => (
                          <Grid item xs={12} key={review.id}>
                            <StyledLink href={`/users/${review.id}`} passHref>
                              <ReviewCardUser review={review} />
                            </StyledLink>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
