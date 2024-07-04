import { gql } from "@apollo/client";

export const SEARCH_TRIPS = gql`
  query SearchTrips(
    $endLocation: String!
    $startLocation: String!
    $sortBy: [SortBy!]
    $date: DateTimeISO
  ) {
    searchTrips(
      endLocation: $endLocation
      startLocation: $startLocation
      sortBy: $sortBy
      date: $date
    ) {
      id
      startLocation
      endLocation
      numberOfPassengers
      status
      date
      price
      startTime
      driver {
        id
        email
        firstname
        lastname
        pictureUrl
      }
      passengers {
        id
        email
        firstname
        lastname
        pictureUrl
      }
    }
  }
`;
