import { gql } from "@apollo/client";

export const GET_REVIEWS_BY_ID = gql`
  query ReviewsForUser($userId: String!) {
    reviewsForUser(userId: $userId) {
      id
      title
      comment
      rating
      createdAt
      author {
        id
        firstname
        lastname
        pictureUrl
      }
    }
  }
`;
