import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Rating,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import { GET_REVIEWS_AS_AUTHOR } from "@/graphql/queries/review";
import { DELETE_REVIEW } from "@/graphql/mutations/review";
import { useRouter } from "next/navigation";
import { Review, RootState } from "@/types/types";

interface ReviewCardProps {
  review: Review;
  handleDelete: (reviewId: string) => void;
  router: ReturnType<typeof useRouter>;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  handleDelete,
  router,
}) => (
  <Card sx={{ width: "100%", mb: 2 }}>
    <CardContent sx={{ display: "flex", alignItems: "center" }}>
      <ListItem>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            alt={`${review?.target?.firstname} ${review?.target?.lastname}`}
            src={review?.target?.pictureUrl}
          />
          <ListItemText
            sx={{ marginLeft: "1rem" }}
            primary={review.title}
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  {`${review?.target?.firstname} ${review?.target?.lastname}`}
                </Typography>
                {` — ${review.comment}`}
                <br />
                <Rating
                  name="read-only"
                  value={review.rating}
                  readOnly
                  size="small"
                />
              </>
            }
          />
        </Box>

        <Box>
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="visit"
              onClick={() => router.push(`/users/${review?.target?.id}`)}
            >
              <VisibilityIcon />
            </IconButton>

            <IconButton
              sx={{ marginLeft: "1rem" }}
              edge="end"
              aria-label="delete"
              onClick={() => handleDelete(review.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </Box>
      </ListItem>
    </CardContent>
  </Card>
);

const ReviewsPage = () => {
  const router = useRouter();
  const me = useSelector((state: RootState) => state.user.currentUser);
  const userId = me?.id;
  const { loading, error, data, refetch } = useQuery<{
    reviewsAsAuthor: Review[];
  }>(GET_REVIEWS_AS_AUTHOR, {
    variables: { userId },
  });

  const [
    deleteReview,
    {
      data: dataDeleteReview,
      loading: loadingDeleteReview,
      error: errorDeleteReview,
    },
  ] = useMutation(DELETE_REVIEW);

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview({
        variables: { reviewId },
        refetchQueries: [
          { query: GET_REVIEWS_AS_AUTHOR, variables: { userId } },
        ],
      });
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "-8rem" }}>
      {error && (
        <Alert style={{ marginBottom: "1rem" }} severity="error">
          Error : {error.message}
        </Alert>
      )}

      {errorDeleteReview && (
        <Alert style={{ marginBottom: "1rem" }} severity="error">
          Error : {errorDeleteReview.message}
        </Alert>
      )}

      {dataDeleteReview && dataDeleteReview.deleteReview && (
        <Alert severity="success">Review successfully deleted.</Alert>
      )}

      {loading && <CircularProgress />}

      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            My Reviews
          </Typography>
          <List>
            {data?.reviewsAsAuthor.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                handleDelete={handleDelete}
                router={router}
              />
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ReviewsPage;
