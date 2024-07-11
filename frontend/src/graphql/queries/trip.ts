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
      date
      startTime
      estimatedDuration
      endTime
      price
      status
      numberOfPassengers
      vehicleType
      vehicleModel
      licensePlateNumber
      createdAt
      updatedAt
      stopLocations
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

export const GET_TRIP = gql`
  query GetTrip($tripId: String!) {
    trip(id: $tripId) {
      id
      startLocation
      endLocation
      stopLocations
      startTime
      estimatedDuration
      endTime
      date
      vehicleType
      vehicleModel
      licensePlateNumber
      numberOfPassengers
      price
      status
      driver {
        id
        firstname
        lastname
        pictureUrl
      }
      passengers {
        id
        firstname
        lastname
        pictureUrl
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRIPS_FOR_USER = gql`
  query TripsForUser($userId: String!) {
    tripsForUser(userId: $userId) {
      id
      startLocation
      endLocation
      date
    }
  }
`;
