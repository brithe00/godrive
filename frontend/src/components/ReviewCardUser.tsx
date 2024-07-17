import { Card, Typography, CardContent, Box, Avatar } from "@mui/material";

import dayjs from "dayjs";

import StarIcon from "@mui/icons-material/Star";

import { Review } from "@/types/types";

interface ReviewCardUserProps {
  review: Review;
}

export default function ReviewCardUser({ review }: ReviewCardUserProps) {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            margin: "0 0 1rem 0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              alt={review.author?.firstname}
              src={review.author?.pictureUrl}
            />
            <Typography ml={1} variant="h5">
              {review.author?.firstname}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <StarIcon />
            <Typography>{review.rating}</Typography>
          </Box>
        </Box>
        <Box sx={{ margin: "0 0 1rem 0" }}>
          <Typography variant="h5">{review.title}</Typography>
          <Typography>{review.comment}</Typography>
        </Box>
        <Box>
          <Typography variant="body2">
            {dayjs(review.createdAt).format("DD MMMM YYYY")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
