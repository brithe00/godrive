import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation CreateReview(
    $targetId: String!
    $title: String!
    $comment: String!
    $rating: Int!
  ) {
    createReview(
      targetId: $targetId
      title: $title
      comment: $comment
      rating: $rating
    ) {
      id
      title
      comment
      rating
    }
  }
`;
