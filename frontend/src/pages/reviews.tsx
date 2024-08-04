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
  useTheme,
  useMediaQuery,
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
}) => {
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
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: isMobile ? 2 : 0,
              mr: isMobile ? 0 : 3,
              minWidth: isMobile ? "auto" : "200px",
            }}
          >
            <Avatar
              alt={`${review?.target?.firstname} ${review?.target?.lastname}`}
              src={review?.target?.pictureUrl}
              sx={{ width: 56, height: 56 }}
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2">
                {`${review?.target?.firstname} ${review?.target?.lastname}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, mt: isMobile ? 2 : 0 }}>
            <Typography variant="h6" gutterBottom>
              {review.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {review.comment}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Rating
                name="read-only"
                value={review.rating}
                readOnly
                size="small"
              />
              <Box>
                <IconButton
                  aria-label="visit"
                  onClick={() => router.push(`/users/${review?.target?.id}`)}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(review.id)}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const ReviewsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const me = useSelector((state: RootState) => state.user.currentUser);
  const userId = me?.id;
  const { loading, error, data } = useQuery<{
    reviewsAsAuthor: Review[];
  }>(GET_REVIEWS_AS_AUTHOR, {
    variables: { userId },
  });

  const [deleteReview, { data: dataDeleteReview, error: errorDeleteReview }] =
    useMutation(DELETE_REVIEW);

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
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error.message}
        </Alert>
      )}

      {errorDeleteReview && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {errorDeleteReview.message}
        </Alert>
      )}

      {dataDeleteReview && dataDeleteReview.deleteReview && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Review successfully deleted.
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            My Reviews
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {data?.reviewsAsAuthor.length === 0 ? (
                <Typography>No reviews.</Typography>
              ) : (
                data?.reviewsAsAuthor.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    handleDelete={handleDelete}
                    router={router}
                  />
                ))
              )}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ReviewsPage;
