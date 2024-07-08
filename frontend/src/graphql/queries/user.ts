import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      id
      email
      firstname
      lastname
      description
      birthdate
      phoneNumber
      pictureUrl
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER = gql`
  query GetUser($getUserByIdId: String!) {
    getUserById(id: $getUserByIdId) {
      id
      email
      pictureUrl
      firstname
      lastname
      description
      birthdate
      reviewsAsTarget {
        id
        rating
        title
        comment
        createdAt
        author {
          id
          firstname
          lastname
          pictureUrl
        }
      }
      tripsAsDriver {
        id
        startLocation
        endLocation
        date
      }
    }
  }
`;
