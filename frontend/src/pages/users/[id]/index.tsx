"use client";
import { useState } from "react";

import { useParams } from "next/navigation";

import { useQuery, useMutation } from "@apollo/client";
import { GET_USER } from "@/graphql/queries/user";

import {
  Alert,
  Avatar,
  Container,
  Card,
  Typography,
  CardContent,
  Grid,
  Box,
  Divider,
  CircularProgress,
  Button,
  TextField,
  Rating,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import StarIcon from "@mui/icons-material/Star";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AddIcon from "@mui/icons-material/Add";

import dayjs from "dayjs";
import { GET_REVIEWS_BY_ID } from "@/graphql/queries/review";
import { GET_TRIPS_FOR_USER } from "@/graphql/queries/trip";

import { styled } from "@mui/system";
import TripCardUser from "@/components/TripCardUser";
import ReviewCardUser from "@/components/ReviewCardUser";
import { CREATE_REVIEW } from "@/graphql/mutations/review";

const StyledLink = styled("a")({
  textDecoration: "none",
  color: "inherit",
});

export default function User() {
  const params = useParams();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  const { loading, data, error, refetch } = useQuery(GET_USER, {
    variables: { getUserByIdId: params?.id },
  });

  const [
    createReview,
    {
      data: dataCreatedReview,
      loading: loadingCreatedReview,
      error: errorCreatedReview,
    },
  ] = useMutation(CREATE_REVIEW);

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

    return averageRating.toFixed(1);
  };

  const handleCreateReviewClick = () => {
    setShowReviewForm(!showReviewForm);
  };

  const handleReviewSubmit = async (e) => {
    try {
      e.preventDefault();

      await createReview({
        variables: {
          title: reviewTitle,
          comment: reviewComment,
          rating: reviewRating,
          targetId: params?.id,
        },
      });

      await refetchReviews();

      setShowReviewForm(false);
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(0);
    } catch (error) {
      console.error("Create review error:", e);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="md">
        {errorCreatedReview && (
          <Alert style={{ marginBottom: "1rem" }} severity="error">
            Error : {errorCreatedReview.message}
          </Alert>
        )}

        {dataCreatedReview && dataCreatedReview.createReview && (
          <Alert style={{ marginBottom: "1rem" }} severity="success">
            Review successfully created.
          </Alert>
        )}

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
                            <StyledLink
                              href={`/users/${review.author.id}`}
                              passHref
                            >
                              <ReviewCardUser review={review} />
                            </StyledLink>
                          </Grid>
                        ))}
                      </Grid>

                      <Divider>
                        <Button
                          startIcon={<AddIcon />}
                          variant="outlined"
                          color="primary"
                          onClick={handleCreateReviewClick}
                          sx={{ mt: 2, mb: 2 }}
                        >
                          Create Review
                        </Button>
                      </Divider>

                      {showReviewForm && (
                        <Box
                          component="form"
                          sx={{ mt: 2, mb: 2 }}
                          noValidate
                          autoComplete="off"
                        >
                          <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            label="Comment"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            sx={{ mb: 2 }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                              }}
                            >
                              <Typography component="legend">Rating</Typography>
                              <Rating
                                name="review-rating"
                                value={reviewRating}
                                onChange={(event, newValue) => {
                                  setReviewRating(newValue);
                                }}
                                sx={{ ml: 2 }}
                              />
                            </Box>

                            <Box>
                              <LoadingButton
                                loading={loadingCreatedReview}
                                variant="contained"
                                color="primary"
                                onClick={handleReviewSubmit}
                              >
                                Submit Review
                              </LoadingButton>
                            </Box>
                          </Box>
                        </Box>
                      )}
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
